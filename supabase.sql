create table tests(id uuid primary key default gen_random_uuid(),grade int not null check(grade in(3,4,5)),name text not null,start_at timestamptz not null,end_at timestamptz not null);
create table questions(id uuid primary key default gen_random_uuid(),test_id uuid references tests on delete cascade,pos int not null,body text not null,image_url text,options text[] not null,correct int not null,marks int not null default 1,seconds int);
create table attempts(id uuid primary key default gen_random_uuid(),test_id uuid references tests on delete cascade,student text not null,grade int not null,started_at timestamptz default now(),finished boolean default false,finished_at timestamptz,answers jsonb default '{}');
alter table tests enable row level security;alter table questions enable row level security;alter table attempts enable row level security;
create policy a on tests for all to authenticated using(true) with check(true);
create policy a on questions for all to authenticated using(true) with check(true);
create policy a on attempts for all to authenticated using(true) with check(true);
insert into storage.buckets(id,name,public) values('qimg','qimg',true);
create policy up on storage.objects for insert to authenticated with check(bucket_id='qimg');

create function score_of(a attempts) returns int language sql stable as $$
select coalesce(sum(q.marks),0)::int from questions q where q.test_id=a.test_id and (a.answers->(q.id::text)->>'a')::int=q.correct $$;

create function list_tests(g int) returns table(id uuid,name text,start_at timestamptz,end_at timestamptz,now_ts timestamptz)
language sql security definer as $$ select id,name,start_at,end_at,now() from tests where grade=g and end_at>now()-interval '7 days' order by start_at $$;

create function start_attempt(tid uuid,nm text,g int) returns uuid language plpgsql security definer as $$
declare t tests;a uuid;
begin select * into t from tests where id=tid and grade=g;
if t.id is null then raise exception 'no test';end if;
select id into a from attempts where test_id=tid and lower(student)=lower(trim(nm));
if a is not null then return a;end if;
if now()<t.start_at or now()>=t.end_at then raise exception 'closed';end if;
insert into attempts(test_id,student,grade) values(tid,trim(nm),g) returning id into a;return a;end $$;

create function get_questions(aid uuid) returns json language plpgsql security definer as $$
declare a attempts;t tests;
begin select * into a from attempts where id=aid;select * into t from tests where id=a.test_id;
return json_build_object('now',now(),'end_at',t.end_at,'finished',a.finished or now()>=t.end_at,'answers',a.answers,
'qs',(select coalesce(json_agg(json_build_object('id',q.id,'body',q.body,'image_url',q.image_url,'options',q.options,'marks',q.marks,'seconds',q.seconds) order by q.pos),'[]'::json) from questions q where q.test_id=t.id));end $$;

create function save_answers(aid uuid,ans jsonb) returns void language sql security definer as $$
update attempts set answers=ans where id=aid and not finished and now()<(select end_at from tests where id=test_id) $$;

create function finish_attempt(aid uuid) returns void language sql security definer as $$
update attempts set finished=true,finished_at=now() where id=aid and not finished $$;

create function get_result(aid uuid) returns json language plpgsql security definer as $$
declare a attempts;t tests;sc int;rk int;
begin select * into a from attempts where id=aid;select * into t from tests where id=a.test_id;
if not(a.finished or now()>=t.end_at) then raise exception 'not yet';end if;
sc:=score_of(a);select 1+count(*) into rk from attempts x where x.test_id=t.id and score_of(x)>sc;
return json_build_object('score',sc,'total',(select sum(marks) from questions where test_id=t.id),'rank',rk,'count',(select count(*) from attempts where test_id=t.id),
'items',(select json_agg(json_build_object('body',q.body,'image_url',q.image_url,'options',q.options,'correct',q.correct,'marks',q.marks,'mine',(a.answers->(q.id::text)->>'a')) order by q.pos) from questions q where q.test_id=t.id));end $$;
