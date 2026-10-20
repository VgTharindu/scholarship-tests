import {useEffect,useRef,useState} from 'react'
import {sb} from './supabase'
const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
const dt=x=>new Date(x).toLocaleString('si-LK',{dateStyle:'medium',timeStyle:'short'})

export default function Student(){
  const [me,setMe]=useState(JSON.parse(localStorage.getItem('me')||'null'))
  const [v,setV]=useState({p:'home'})
  if(!me)return <Login done={m=>{localStorage.setItem('me',JSON.stringify(m));setMe(m)}}/>
  if(v.p==='test')return <Test aid={v.aid} done={()=>setV({p:'result',aid:v.aid})}/>
  if(v.p==='result')return <Result aid={v.aid} back={()=>setV({p:'home'})}/>
  return <Home me={me} go={setV} out={()=>{localStorage.removeItem('me');setMe(null)}}/>
}

function Login({done}){
  const [n,setN]=useState(''),[g,setG]=useState(0)
  return <div className="wrap"><h1>ශිෂ්‍යත්ව අභ්‍යාස පරීක්ෂණ</h1>
    <div className="card"><b>1. ඔබේ නම ලියන්න</b>
      <input value={n} onChange={e=>setN(e.target.value)} placeholder="සම්පූර්ණ නම"/>
      <b>2. ඔබේ පන්තිය තෝරන්න</b>
      <div className="row" style={{marginTop:8}}>{[3,4,5].map(x=><button key={x} className={g===x?'g':'w'} onClick={()=>setG(x)}>{x} වසර</button>)}</div></div>
    <button disabled={!n.trim()||!g} onClick={()=>done({name:n.trim(),grade:g})} style={{width:'100%'}}>ඉදිරියට යන්න</button></div>
}

function Home({me,go,out}){
  const [ts,setTs]=useState([]),off=useRef(0),[,tick]=useState(0)
  const load=()=>sb.rpc('list_tests',{g:me.grade}).then(({data})=>{if(data?.length)off.current=new Date(data[0].now_ts)-Date.now();setTs(data||[])})
  useEffect(()=>{load();const a=setInterval(load,30000),b=setInterval(()=>tick(x=>x+1),1000);return()=>{clearInterval(a);clearInterval(b)}},[])
  const now=Date.now()+off.current
  async function open(t,p){const {data,error}=await sb.rpc('start_attempt',{tid:t.id,nm:me.name,g:me.grade});error?alert('ඔබ මෙම පරීක්ෂණයට සහභාගී වී නැත'):go({p,aid:data})}
  return <div><div className="bar">{me.name} · {me.grade} වසර</div><div className="wrap">
    <h2>පරීක්ෂණ</h2>{!ts.length&&<p>තවම පරීක්ෂණ නැත.</p>}
    {ts.map(t=>{const s=new Date(t.start_at),e=new Date(t.end_at),st=now<s?0:now<e?1:2
      return <div className="card" key={t.id}><b>{t.name}</b><br/>{dt(s)} සිට {dt(e)} දක්වා<br/>
        {st===0&&<><span className="tag" style={{background:'#ca8a04'}}>ආරම්භ වීමට: {fmt((s-now)/1000)}</span></>}
        {st===1&&<><span className="tag" style={{background:'#16a34a'}}>දැන් පවතී</span><br/><button className="g" style={{marginTop:8,width:'100%'}} onClick={()=>open(t,'test')}>පරීක්ෂණය ආරම්භ කරන්න</button></>}
        {st===2&&<button className="w" style={{marginTop:8,width:'100%'}} onClick={()=>open(t,'result')}>ප්‍රතිඵල බලන්න</button>}</div>})}
    <button className="w" onClick={out}>නම / පන්තිය වෙනස් කරන්න</button></div></div>
}

function Test({aid,done}){
  const [d,setD]=useState(null),[i,setI]=useState(+localStorage.getItem('i_'+aid)||0),[ans,setAns]=useState({}),[msg,setMsg]=useState(''),[,tick]=useState(0)
  const off=useRef(0),enter=useRef(Date.now()),fin=useRef(false)
  useEffect(()=>{sb.rpc('get_questions',{aid}).then(({data})=>{off.current=new Date(data.now)-Date.now();setAns(data.answers||{});setD(data)});const t=setInterval(()=>tick(x=>x+1),500);return()=>clearInterval(t)},[aid])
  const q=d?.qs[i],now=()=>Date.now()+off.current
  const total=d?(new Date(d.end_at)-now())/1000:1
  let left=null
  if(q?.seconds){const k='dl_'+aid+'_'+q.id;let x=+localStorage.getItem(k);if(!x){x=Date.now()+q.seconds*1000;localStorage.setItem(k,x)};left=(x-Date.now())/1000}
  function leave(){const s=Math.round(((ans[q.id]?.s||0)+(Date.now()-enter.current)/1000));enter.current=Date.now();const a={...ans,[q.id]:{...ans[q.id],s}};setAns(a);sb.rpc('save_answers',{aid,ans:a});return a}
  async function finish(){if(fin.current)return;fin.current=true;if(q&&total>0){const a=leave();await sb.rpc('save_answers',{aid,ans:a})};await sb.rpc('finish_attempt',{aid});done()}
  function go(n){if(n>=d.qs.length)return finish();leave();setI(n);localStorage.setItem('i_'+aid,n)}
  function pick(k){const a={...ans,[q.id]:{...ans[q.id],a:k}};setAns(a);sb.rpc('save_answers',{aid,ans:a})}
  useEffect(()=>{if(!d||fin.current)return
    if(d.finished||total<=0){finish();return}
    if(left!==null&&left<=0&&!msg){setMsg('⏰ කාලය අවසන්!');setTimeout(()=>{setMsg('');go(i+1)},1200)}})
  if(!d)return <div className="wrap">රැඳී සිටින්න…</div>
  if(!q)return <div className="wrap"><p>ප්‍රශ්න නැත.</p></div>
  const last=i===d.qs.length-1,canBack=i>0&&!q.seconds&&!d.qs[i-1].seconds
  return <div><div className="bar row"><span>ප්‍රශ්නය {i+1} / {d.qs.length}</span><span style={{textAlign:'right'}}>මුළු කාලය: {fmt(total)}</span></div>
    <div className="wrap">
      {left!==null&&<div className={'tm '+(left<10?'warn':'')}>⏱ {Math.ceil(Math.max(0,left))} තත්පර</div>}
      {msg&&<div className="card warn"><b>{msg}</b></div>}
      <h2>{q.body}</h2>{q.image_url&&<img className="q" src={q.image_url} alt=""/>}
      <small>ලකුණු {q.marks}</small>
      {q.options.map((o,k)=><button key={k} disabled={!!msg} className={'opt '+(ans[q.id]?.a===k?'sel':'')} onClick={()=>pick(k)}>{k+1}. {o}</button>)}
      <div className="row" style={{marginTop:14}}>
        {canBack&&<button className="w" onClick={()=>go(i-1)}>◀ පෙර</button>}
        <button className={last?'g':''} disabled={!!msg} onClick={()=>last?confirm('ඉදිරිපත් කරන්නද?')&&finish():go(i+1)}>{last?'ඉදිරිපත් කරන්න ✔':'ඊළඟ ▶'}</button></div>
      {q.seconds&&<p><small>මෙම ප්‍රශ්නයට කාල සීමාවක් ඇත. පසුව නැවත පැමිණිය නොහැක.</small></p>}
    </div></div>
}

function Result({aid,back}){
  const [r,setR]=useState(null)
  useEffect(()=>{sb.rpc('get_result',{aid}).then(({data,error})=>error?(alert('ප්‍රතිඵල තවම නැත'),back()):setR(data))},[aid])
  if(!r)return <div className="wrap">රැඳී සිටින්න…</div>
  return <div className="wrap"><h1>ඔබේ ප්‍රතිඵලය</h1>
    <div className="card" style={{textAlign:'center'}}><div className="tm">{r.score} / {r.total}</div>ස්ථානය: {r.rank} (ළමුන් {r.count} න් අතරින්)</div>
    {r.items.map((it,k)=>{const m=it.mine===null?null:+it.mine,ok=m===it.correct
      return <div className="card" key={k}><b>{k+1}. {it.body}</b>{it.image_url&&<img className="q" src={it.image_url} alt=""/>}
        {it.options.map((o,j)=><div key={j} className={'opt '+(j===it.correct?'ok':j===m?'bad':'')} style={{padding:'8px 12px',borderRadius:10,border:'2px solid #e2e8f0',margin:'6px 0'}}>{j===m?(ok?'✅ ':'❌ '):''}{o}{j===it.correct&&!ok?' (නිවැරදි පිළිතුර)':''}</div>)}
        {m===null&&<span className="warn">පිළිතුරක් දී නැත</span>}</div>})}
    <button onClick={back} style={{width:'100%'}}>මුල් පිටුවට</button></div>
}
