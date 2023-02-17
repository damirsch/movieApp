import React, { useState } from 'react'
import './Account-mobile.css'

const AccountMobile = ({ username, email, logout, store }) => {
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [isButtonChangeName, setIsButtonChangeName] = useState(false)
  const [isButtonChangeEmail, setIsButtonChangeEmail] = useState(false)
  const [errorUsernameValidation, setErrorUsernameValidation] = useState()
  const [errorEmailValidation, setErrorEmailValidation] = useState()

  function validateUsername(username, newUsername){
    console.log(newUsername.length);
    if(username == newUsername){
      return setErrorUsernameValidation('Введите новое имя')
    }else if(newUsername.length < 4 || newUsername.length > 20){
      return setErrorUsernameValidation('Имя должно быть больше 4 символов и меньше 20')
    }
    return setErrorUsernameValidation('')
  }

  function validateEmail(email, newEmail){
    if(email == newEmail){
      return setErrorEmailValidation('Новый email не должен совпадать со старым')
    }else if(!newEmail){
      return setErrorEmailValidation('Email не должен быть пустым')
    }
    return setErrorEmailValidation('')
  }

  async function changeUsername(username, newUsername, reload){
    setIsButtonChangeName(true)
    if(isButtonChangeName && !errorUsernameValidation){
      validateUsername(username, newUsername)
      await store.changeUsername(username, newUsername)
      if(reload) window.location.reload()
    }
  }

  async function changeEmail(email, newEmail, reload){
    setIsButtonChangeEmail(true)
    if(isButtonChangeEmail && !errorEmailValidation){
      validateEmail(email, newEmail)
      try{
        await store.changeEmail(email, newEmail)
        if(reload) window.location.reload()
      }catch(e){
        return setErrorEmailValidation('Неверный email')
      }
    }
  }

  async function applyChanges(username, newUsername, email, newEmail){
    if(newEmail && newUsername){
      await changeUsername(username, newUsername, false)
      changeEmail(email, newEmail, true)
    }else if(newEmail){
      changeEmail(email, newEmail, true)
    }else{
      changeUsername(username, newUsername, true)
    }
  }

  return(
    <div className='account-mobile'>
      <table className='account__block'>
        <tbody>
          <tr>
            <td>Имя: </td>
            <td>{username}</td>
          </tr>
          <tr>
            <td>Почта: </td>
            <td>{email}</td>
          </tr>
        </tbody>
      </table>
      <div className='account__block'>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          {isButtonChangeName ?
            <div>
              <input
                className='account__input'
                placeholder='Имя'
                type='text' 
                onChange={e => {
                  setNewUsername(e.target.value)
                  validateUsername(username, e.target.value)
                }}
                value={newUsername}
              />
              <div className='account__error'>
                {errorUsernameValidation}
              </div>
            </div> : null
          }
          <button className='info-btn-mobile' onClick={(e) => {
            changeUsername(username, newUsername, true)
            e.target.className += ' active'
          }}>
            Изменить имя
          </button>
        </div>
      </div>
      <div className='account__block'>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          {isButtonChangeEmail ?
            <div>
              <input
                className='account__input'
                placeholder='Email'
                type='email' 
                onChange={e => {
                  setNewEmail(e.target.value)
                  validateEmail(email, e.target.value)
                }}
                value={newEmail}
              />
              <div className='account__error'>
                {errorEmailValidation}
              </div>
            </div> : null
          }
          <button className='info-btn-mobile' onClick={(e) => {
            changeEmail(email, newEmail, true)
            e.target.className += ' active'
          }}>
            Изменить почту
          </button>
        </div>
        <button 
          className='info-btn-mobile active' 
          style={{display: isButtonChangeEmail && isButtonChangeName ? 'block' : 'none'}}
          onClick={() => applyChanges(username, newUsername, email, newEmail)}
        >
          Сохранить изменения
        </button>
      </div>
      <button onClick={() => logout()} className='warning-btn'>Выйти из аккаунта</button>
    </div>
  )
}

export default AccountMobile