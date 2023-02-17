import React from 'react'
import './Modal.css'
import Login from '../authorization/Login'
import Registration from '../authorization/Registration'

const Modal = ({ isAuth, value, active, setActive }) => {
  if(value == 'login' && !isAuth){
    return <Login active={active} setActive={setActive}/>
  }else if(!isAuth){
    return <Registration  active={active} setActive={setActive}/>
  }
  return null
}

export default Modal