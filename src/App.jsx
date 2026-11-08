import {useState} from 'react'
import Student from './Student'
import Teacher from './Teacher'
import Landing from './Landing'

export default function App(){
  const [role,setRole]=useState(localStorage.getItem('me')?'s':null)
  const exit=()=>setRole(null)
  if(role==='s')return <Student exit={exit}/>
  if(role==='t')return <Teacher exit={exit}/>
  return <Landing onStudent={()=>setRole('s')} onTeacher={()=>setRole('t')}/>
}
