import React, { useState, useContext } from 'react'
import { closeModal } from '../functions/functions'
import Animation from '../animation/Animation'
import { Context } from '../../index'
import ModalError from '../modal/ModalError'

const Registration = ({ active, setActive, shouldItClose=true, func }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeError, setActiveError] = useState(false)
  const {store} = useContext(Context)

  async function registration(username, email, password){
    setLoading(true)
    if(!loading){
      try{
        await store.registration(username, email, password)
      }catch(e){
        setTimeout(() => {
          setLoading(false)
          setActiveError(true)
        }, 1500)
        return setError(store.error.response.data.message)
      }
    }
    document.body.style.overflow = 'auto'
    if(!store.error && !func){
      window.location.reload()
    }else if(!store.error){
      func()
    }
  }

  document.body.style.overflow = 'hidden'
  return(
    <div className={active ? 'modal active' : 'modal'} onMouseDown={() => closeModal(setActive)}>
      <div className='modal__wrapper'>
        <div className='modal__block' onMouseDown={e => e.stopPropagation()}>
          <div className='modal__header'>
            <div>Регистрация</div>
            <div
              style={{display: shouldItClose ? 'block' : 'none'}}
              className='close' 
              onClick={() => closeModal(setActive)}
            >
              ×
            </div>
          </div>
          <div className='modal__body' onKeyUp={e => {
            if(e.key == 'Enter'){
              registration(username, email, password)
            }
          }}>
            <input 
              className='modal__input' 
              type='text' 
              placeholder='Имя Пользователя'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              className='modal__input' 
              type='email' 
              placeholder='Почта'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              className='modal__input' 
              type='password' 
              placeholder='Пароль'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              className='modal__btn'
              onClick={() => registration(username, email, password)}
            >
              {loading ? <Animation/> : 'Зарегистрироваться'}
            </button>
            <a className='account__link' href='/login'>Вход</a>
            {activeError ? <ModalError errorMessage={error} active={activeError} setActive={setActiveError}/> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration