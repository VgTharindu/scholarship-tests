import React from 'react'
import {createRoot} from 'react-dom/client'
import Student from './Student'
import Teacher from './Teacher'
import './styles.css'
createRoot(document.getElementById('root')).render(location.hash.startsWith('#/sir')?<Teacher/>:<Student/>)
