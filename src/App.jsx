import {useState} from 'react'
import Student from './Student'
import Teacher from './Teacher'

export default function App(){
  const [role,setRole]=useState(localStorage.getItem('me')?'s':null)
  const exit=()=>setRole(null)
  if(role==='s')return <Student exit={exit}/>
  if(role==='t')return <Teacher exit={exit}/>
  return <div className="wrap" style={{textAlign:'center',paddingTop:50}}>
    <div style={{fontSize:56}}>📝</div>
    <h1>ශිෂ්‍යත්ව අභ්‍යාස පරීක්ෂණ</h1>
    <p>කරුණාකර ඔබ කවුදැයි තෝරන්න</p>
    <button style={{width:'100%',fontSize:20,margin:'8px 0'}} onClick={()=>setRole('s')}>👦 ළමයා (ශිෂ්‍යයා)</button>
    <button className="w" style={{width:'100%',fontSize:20,margin:'8px 0'}} onClick={()=>setRole('t')}>👨‍🏫 සර්</button>
  </div>
}