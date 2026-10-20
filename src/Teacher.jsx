import {useEffect,useState} from 'react'
import * as XLSX from 'xlsx'
import {sb} from './supabase'
const fmt=s=>Math.floor(s/60)+'මි '+Math.round(s%60)+'තත්'
const dt=x=>new Date(x).toLocaleString('si-LK',{dateStyle:'medium',timeStyle:'short'})
const score=(a,qs)=>qs.filter(q=>q.test_id===a.test_id&&a.answers?.[q.id]?.a===q.correct).reduce((s,q)=>s+q.marks,0)

export default function Teacher(){
  const [u,setU]=useState(null),[e,setE]=useState(''),[p,setP]=useState(''),[tab,setTab]=useState(0)
  useEffect(()=>{sb.auth.getSession().then(({data})=>setU(data.session))},[])
  if(!u)return <div className="wrap"><h1>සර්ගේ පිවිසුම</h1><div className="card">
    <input placeholder="Email" value={e} onChange={x=>setE(x.target.value)}/><input type="password" placeholder="මුරපදය" value={p} onChange={x=>setP(x.target.value)}/>
    <button onClick={async()=>{const {data,error}=await sb.auth.signInWithPassword({email:e,password:p});error?alert('වැරදියි'):setU(data.session)}}>පිවිසෙන්න</button></div></div>
  return <div><div className="bar row"><span>සර්</span><span style={{textAlign:'right'}} onClick={()=>sb.auth.signOut().then(()=>setU(null))}>ඉවත් වන්න</span></div>
    <div className="wrap"><div className="row tabs">{['ප්‍රශ්න පත්‍ර','ප්‍රතිඵල','මාසික'].map((t,i)=><button key={i} className={tab===i?'on':''} onClick={()=>setTab(i)}>{t}</button>)}</div>
    {tab===0?<Papers/>:tab===1?<Results/>:<Monthly/>}</div></div>
}

function Papers(){
  const [ts,setTs]=useState([]),[f,setF]=useState({grade:5,name:'',start:'',end:''}),[sel,setSel]=useState(null),[qs,setQs]=useState([]),[s,setS]=useState(''),[day,setDay]=useState('')
  const [n,setN]=useState({body:'',o:['','','',''],c:0,marks:1,sec:'',img:null})
  const load=()=>sb.from('tests').select('*').order('start_at',{ascending:false}).then(({data})=>setTs(data||[]))
  const loadQ=id=>sb.from('questions').select('*').eq('test_id',id).order('pos').then(({data})=>setQs(data||[]))
  useEffect(()=>{load()},[])
  async function create(){if(!f.name||!f.start||!f.end)return alert('සියල්ල පුරවන්න')
    const {error}=await sb.from('tests').insert({grade:f.grade,name:f.name,start_at:new Date(f.start).toISOString(),end_at:new Date(f.end).toISOString()});error?alert(error.message):(setF({...f,name:''}),load())}
  async function addQ(){if(!n.body||n.o.some(x=>!x))return alert('ප්‍රශ්නය සහ පිළිතුරු 4 ම ඕන')
    let url=null;if(n.img){const nm=Date.now()+'_'+n.img.name.replace(/[^\w.]/g,'');const r=await sb.storage.from('qimg').upload(nm,n.img);if(r.error)return alert(r.error.message);url=sb.storage.from('qimg').getPublicUrl(nm).data.publicUrl}
    const {error}=await sb.from('questions').insert({test_id:sel.id,pos:qs.length+1,body:n.body,image_url:url,options:n.o,correct:n.c,marks:+n.marks||1,seconds:n.sec?+n.sec:null})
    error?alert(error.message):(setN({body:'',o:['','','',''],c:0,marks:1,sec:'',img:null}),loadQ(sel.id))}
  if(sel)return <div><button className="w" onClick={()=>{setSel(null);load()}}>◀ ආපසු</button><h2>{sel.name} ({sel.grade} වසර)</h2>
    <p>{dt(sel.start_at)} - {dt(sel.end_at)} · ප්‍රශ්න {qs.length} · මුළු ලකුණු {qs.reduce((a,q)=>a+q.marks,0)}</p>
    {qs.map((q,k)=><div className="card" key={q.id}><b>{k+1}. {q.body}</b> {q.image_url&&'🖼'}<br/>{q.options.map((o,j)=><div key={j} className={j===q.correct?'ok':''}>{j+1}. {o}</div>)}
      <small>ලකුණු {q.marks} · {q.seconds?q.seconds+' තත්':'කාල සීමාවක් නැත'}</small> <button className="r" onClick={async()=>{if(confirm('මකන්නද?')){await sb.from('questions').delete().eq('id',q.id);loadQ(sel.id)}}}>මකන්න</button></div>)}
    <div className="card"><h2>නව ප්‍රශ්නයක්</h2><input placeholder="ප්‍රශ්නය" value={n.body} onChange={e=>setN({...n,body:e.target.value})}/>
      <input type="file" accept="image/*" onChange={e=>setN({...n,img:e.target.files[0]})}/>
      {n.o.map((o,j)=><div className="row" key={j}><input placeholder={'පිළිතුර '+(j+1)} value={o} onChange={e=>{const x=[...n.o];x[j]=e.target.value;setN({...n,o:x})}}/><button style={{flex:'0 0 90px'}} className={n.c===j?'g':'w'} onClick={()=>setN({...n,c:j})}>{n.c===j?'නිවැරදි ✔':'නිවැරදිද?'}</button></div>)}
      <div className="row"><input type="number" placeholder="ලකුණු" value={n.marks} onChange={e=>setN({...n,marks:e.target.value})}/><input type="number" placeholder="තත්පර (හිස් නම් කාල සීමාවක් නැත)" value={n.sec} onChange={e=>setN({...n,sec:e.target.value})}/></div>
      <button onClick={addQ}>ප්‍රශ්නය එකතු කරන්න</button></div></div>
  return <div><div className="card"><h2>නව පරීක්ෂණයක්</h2>
    <select value={f.grade} onChange={e=>setF({...f,grade:+e.target.value})}>{[3,4,5].map(g=><option key={g} value={g}>{g} වසර</option>)}</select>
    <input placeholder="නම (උදා: morning test 01)" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
    ආරම්භය<input type="datetime-local" value={f.start} onChange={e=>setF({...f,start:e.target.value})}/>අවසානය<input type="datetime-local" value={f.end} onChange={e=>setF({...f,end:e.target.value})}/>
    <button onClick={create}>සාදන්න</button></div>
    <h2>සොයන්න</h2><div className="row"><input placeholder="නම" value={s} onChange={e=>setS(e.target.value)}/><input type="date" value={day} onChange={e=>setDay(e.target.value)}/></div>
    {ts.filter(t=>t.name.toLowerCase().includes(s.toLowerCase())&&(!day||t.start_at.slice(0,10)===day||new Date(t.start_at).toLocaleDateString('en-CA')===day)).map(t=>
      <div className="card" key={t.id}><b>{t.name}</b> · {t.grade} වසර<br/>{dt(t.start_at)}<div className="row" style={{marginTop:8}}><button onClick={()=>{setSel(t);loadQ(t.id)}}>ප්‍රශ්න</button>
      <button className="r" onClick={async()=>{if(confirm('මුළු පරීක්ෂණයම මකන්නද?')){await sb.from('tests').delete().eq('id',t.id);load()}}}>මකන්න</button></div></div>)}</div>
}

function Results(){
  const [ts,setTs]=useState([]),[rows,setRows]=useState(null),[t,setT]=useState(null)
  useEffect(()=>{sb.from('tests').select('*').order('start_at',{ascending:false}).then(({data})=>setTs(data||[]))},[])
  async function show(x){setT(x);const [a,q]=await Promise.all([sb.from('attempts').select('*').eq('test_id',x.id),sb.from('questions').select('*').eq('test_id',x.id)])
    const nq=q.data.length||1,tot=q.data.reduce((s,y)=>s+y.marks,0)
    setRows(a.data.map(r=>{const sec=((r.finished_at?new Date(r.finished_at):new Date(x.end_at))-new Date(r.started_at))/1000;return {නම:r.student,ලකුණු:score(r,q.data),මුළු_ලකුණු:tot,'මුළු කාලය(තත්)':Math.round(sec),'ප්‍රශ්නයකට සාමාන්‍ය(තත්)':Math.round(sec/nq)}}).sort((a,b)=>b.ලකුණු-a.ලකුණු).map((r,i)=>({ස්ථානය:i+1,...r})))}
  const xl=(r,n)=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(r),'Results');XLSX.writeFile(wb,n+'.xlsx')}
  return <div><h2>පරීක්ෂණය තෝරන්න</h2>{ts.map(x=><button key={x.id} className={t?.id===x.id?'':'w'} style={{margin:3}} onClick={()=>show(x)}>{x.name} · {x.grade}වසර · {new Date(x.start_at).toLocaleDateString('en-CA')}</button>)}
    {rows&&<><div className="row" style={{margin:'10px 0'}}><button className="g" onClick={()=>xl(rows,t.name)}>Excel ලෙස ගන්න</button></div>
    <div style={{overflowX:'auto'}}><table><thead><tr><th>#</th><th>නම</th><th>ලකුණු</th><th>කාලය</th><th>ප්‍රශ්නයකට</th></tr></thead>
    <tbody>{rows.map(r=><tr key={r.නම}><td>{r.ස්ථානය}</td><td>{r.නම}</td><td>{r.ලකුණු}/{r.මුළු_ලකුණු}</td><td>{fmt(r['මුළු කාලය(තත්)'])}</td><td>{fmt(r['ප්‍රශ්නයකට සාමාන්‍ය(තත්)'])}</td></tr>)}</tbody></table></div></>}</div>
}

function Monthly(){
  const [g,setG]=useState(5),[m,setM]=useState(new Date().toISOString().slice(0,7)),[rows,setRows]=useState(null)
  async function go(){const a=new Date(m+'-01'),b=new Date(a.getFullYear(),a.getMonth()+1,1)
    const {data:ts}=await sb.from('tests').select('id').eq('grade',g).gte('start_at',a.toISOString()).lt('start_at',b.toISOString());const ids=(ts||[]).map(x=>x.id)
    if(!ids.length)return setRows([])
    const [at,q]=await Promise.all([sb.from('attempts').select('*').in('test_id',ids),sb.from('questions').select('*').in('test_id',ids)]);const o={}
    at.data.forEach(r=>{const k=r.student.toLowerCase();o[k]=o[k]||{නම:r.student,n:0,s:0};o[k].n++;o[k].s+=score(r,q.data)})
    setRows(Object.values(o).map(x=>({නම:x.නම,'සහභාගී වූ පරීක්ෂණ':x.n,'මුළු පරීක්ෂණ':ids.length,'සාමාන්‍ය ලකුණු':+(x.s/x.n).toFixed(1)})).sort((a,b)=>b['සාමාන්‍ය ලකුණු']-a['සාමාන්‍ය ලකුණු']).map((r,i)=>({ස්ථානය:i+1,...r})))}
  return <div><h2>මාසික සාමාන්‍යය</h2><div className="row"><select value={g} onChange={e=>setG(+e.target.value)}>{[3,4,5].map(x=><option key={x} value={x}>{x} වසර</option>)}</select><input type="month" value={m} onChange={e=>setM(e.target.value)}/></div>
    <button onClick={go}>ලැයිස්තුව ගන්න</button>
    {rows&&<><button className="g" style={{marginLeft:8}} onClick={()=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),'Monthly');XLSX.writeFile(wb,`monthly_${g}_${m}.xlsx`)}}>Excel</button>
    <table><thead><tr><th>#</th><th>නම</th><th>පරීක්ෂණ</th><th>සාමාන්‍යය</th></tr></thead><tbody>{rows.map(r=><tr key={r.නම}><td>{r.ස්ථානය}</td><td>{r.නම}</td><td>{r['සහභාගී වූ පරීක්ෂණ']}/{r['මුළු පරීක්ෂණ']}</td><td>{r['සාමාන්‍ය ලකුණු']}</td></tr>)}</tbody></table></>}</div>
}
