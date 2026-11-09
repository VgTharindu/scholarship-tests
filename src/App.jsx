import {useCallback,useState} from 'react'
import Student from './Student'
import Teacher from './Teacher'
import Landing from './Landing'
import Splash from './Splash'

export default function App(){
  const [role,setRole]=useState(localStorage.getItem('me')?'s':null)
  const [splash,setSplash]=useState(true)
  const hideSplash=useCallback(()=>setSplash(false),[])
  const exit=()=>setRole(null)
  let page
  if(role==='s')page=<Student exit={exit}/>
  else if(role==='t')page=<Teacher exit={exit}/>
  else page=<Landing onStudent={()=>setRole('s')} onTeacher={()=>setRole('t')}/>
  return <>{page}{splash&&<Splash onDone={hideSplash}/>}</>
}
