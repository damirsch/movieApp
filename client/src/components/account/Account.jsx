import React, { useEffect, useState } from 'react'
import DefaultWrapper from '../wrappers/DefaultWrapper'
import './Account.css'
import account from '../img/account.svg'
import axios from 'axios'
import Animation from '../animation/Animation'

const Account = ({ username, email, logout, store }) => {
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [isButtonChangeName, setIsButtonChangeName] = useState(false)
  const [isButtonChangeEmail, setIsButtonChangeEmail] = useState(false)
  const [loadingChanges, setLoadingChanges] = useState(false)
  const [errorUsernameValidation, setErrorUsernameValidation] = useState('')
  const [errorEmailValidation, setErrorEmailValidation] = useState('')
  const [file, setFile] = useState('')
  const [picture, setPicture] = useState('')
  const [loadingFavFilms, setLoadingFavFilms] = useState(false)
  const [favFilms, setFavFilms] = useState([])

  const url = 'http://localhost:5000/static/'

  useEffect(() => {
    (async function() {
      try{
        const picture = store.user.picture
        setPicture(picture)
        if(picture) await axios.get(url + picture)
      }catch(e){
        setPicture(null)
      }
    })()
  }, [])

  useEffect(() => {
    (async function(){
      try{
        setLoadingFavFilms(true)
        const films = await store.getUserFavFilms(store.user.username)
        setFavFilms(films)
        setLoadingFavFilms(false)
      }catch(e){
        console.log(e);
      }
    })()
  }, [])

  function validateUsername(username, newUsername){
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

  async function addPicture(email, file){
    if(file){
      setLoadingChanges(true)
      let formData = new FormData()
      formData.append('email', email)
      formData.append('file', file)
      await store.addPicture(formData)
      setLoadingChanges(false)
      setPicture(store.user.picture)
      window.location.reload()
    }
  }

  async function removeAllFilms(){
    if(favFilms){
      setLoadingFavFilms(true)
      const response = await store.removeAllUserFavFilms(store.user.email)
      setLoadingFavFilms(false)
      setFavFilms([])
    }
  }

  return(
    <DefaultWrapper>
      <div className='account'>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div 
            className='account__img'
            style={{backgroundImage: `url(${picture ? url + picture : account})`}}
          >
          <div className='account__wrapper-img'>
            <div className='account__file hidden'></div>
            <input 
              type='file' 
              onChange={e => setFile(e.target.files[0])} 
              className='account__file'
              accept='image/*'
            />
          </div>
          {file ? 
            <div className='default-margin-top' style={{display: 'flex', flexDirection: 'column'}}>
              <div>{file.name}</div>
              <button 
                className='orig-btn default-margin-top'
                onClick={() => addPicture(email, file)}
                disabled={loadingChanges}
              >
                {loadingChanges ? <Animation size='20px'/> : 'Подтвердить'}
              </button>
            </div> : null
          }
        </div>
          <div>
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
                <button className='info-btn' onClick={(e) => {
                  changeUsername(username, newUsername, true)
                  e.target.className = 'info-btn active'
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
                <button className='info-btn' onClick={(e) => {
                  changeEmail(email, newEmail, true)
                  e.target.className += ' active'
                }}>
                  Изменить почту
                </button>
              </div>
              <button 
                className='info-btn active' 
                style={{display: isButtonChangeEmail && isButtonChangeName ? 'block' : 'none'}}
                onClick={() => applyChanges(username, newUsername, email, newEmail)}
              >
                Сохранить изменения
              </button>
            </div>
            <button onClick={() => logout()} className='warning-btn'>Выйти из аккаунта</button>
          </div>
        </div>
        <div className='account__favourite-films'>
          <div className='account__title'>
            В избранном:
          </div>
          {!loadingFavFilms ? 
            favFilms.length ?
              <div className='sequels-and-prequels'>
                <div className='sequels-and-prequels__block'>
                  {favFilms.map(i => 
                    <div key={i.filmId} className='sequels-and-prequels__item'>
                      <a href={`./film/${i.filmId}`}>
                        <img className='sequels-and-prequels__img' src={i.filmPictureLink}/>
                        <div className='sequels-and-prequels__name-of-film'>{i.filmTitle}</div>
                      </a>
                    </div>
                  )}
                  <div className='sequels-and-prequels__item'>
                    <button className='orig-btn-err sequels-and-prequels__img' onClick={() => removeAllFilms()}>
                      Удалить все
                    </button>
                    <div className='sequels-and-prequels__name-of-film' style={{textAlign: 'center'}}>
                      Удалить все фильмы
                    </div>
                  </div>
                </div>
              </div>
            : null
          : 
            <div className='loading'>Загрузка...</div>
          }
        </div>
      </div>
    </DefaultWrapper>
  )
}

export default Account