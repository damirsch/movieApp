import React, { useState, useEffect, useContext } from 'react'
import Modal from '../modal/Modal'
import './Navbar.css'
import { useDebounce } from '../functions/use-debounce'
import { Context } from '../..'
import {navbarItems} from './navbarItems'

const Navbar = () => {
  const [value, setValue] = useState()
  const [focus, setFocus] = useState(false)
  const [loading, setLoading] = useState()
  const [data, setData] = useState()
  const [hasItems, setHasItems] = useState()
  const debouncedSearchTerm = useDebounce(value, 200)
  const [valueOfButton, setValueOfButton] = useState(null)
  const [modalActive, setModalActive] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [isResponseLoaded, setIsResponseLoaded] = useState(false)
  const [picture, setPicture] = useState('')
  const {store} = useContext(Context)

  const serverUrl = 'http://localhost:5000/static/'

  const options = {
    method: 'GET',
    headers: {
      'X-API-KEY': '9e4abc82-62f5-44b0-b6da-cf45a8b108ff',
      'Content-Type': 'application/json',
    }
  }

  useEffect(() => {
    if(debouncedSearchTerm){
      fetchMovie(value)
    }
  }, [debouncedSearchTerm])
  
  useEffect(() => {
    (async function() {
      const picture = store.user.picture
      setIsAuth(store.isAuth)
      setIsResponseLoaded(true)
      setPicture(picture)
    })()
  }, [])
  
  async function fetchMovie(value){
    if(value){
      setLoading(true)
      setData(null)
      const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${value}&page=1`, options)
      const data = await response.json()
      setLoading(false)
      setData(data);
      setHasItems(!data.searchFilmsCountResult)
    }
  }

  const div = document.querySelector('.navbar__block');
  document.addEventListener('click', (e) => {
    const withinBoundaries = e.composedPath().includes(div);
    if(!withinBoundaries){
      setFocus(false)
    }else{
      setFocus(true)
    }
  })

  document.addEventListener('keydown', function(event){
    let target = event.target;
    if(event.key === 'Enter' && focus){
      if(target.matches(':focus')) {
        if(value){
          window.location.href = new URL('films/search/' + value, origin)
        }
      }
    }
  })
  
  const firstFilm = data ? data.films[0] : 'null';
  return(
    <nav className='navbar'>
      <div className='navbar__wrapper'>
        <div className='navbar__menu'>
          <a className='navbar__logo' href='/'>
            Кинопоиск V2
          </a>
          <div className='navbar__items'>
            {navbarItems}
          </div>
        </div>
        <div style={{position: 'relative', width: '100%', margin: '0 60px 0 20px', height: '100%'}}>
          <div className='navbar__block'>
            <input 
              className='navbar__input'
              onFocus={() => setFocus(true)}
              onChange={e => setValue(e.target.value.trim())} 
              placeholder='Поиск фильмов'
            />
            <div className='navbar__items' style={{display: focus && value ? 'block' : 'none'}}>
              {data?.films.length ? value !== '' ?
                <div key={2} className='navbar__films'>
                  <div style={{padding: '5px 0 5px 10px'}}>
                    Возможно, вы искали
                  </div>
                  <div className='navbar__first-search'>
                    <a className='navbar__item' onClick={() => window.location.pathname = `/film/${firstFilm.filmId}`}>
                      <img className='navbar__img' src={firstFilm.posterUrlPreview || ''}/>
                      <div className='navbar__container' style={{marginLeft: '10px', lineHeight: '25px'}}>
                        <div className='navbar__name'>{firstFilm.nameRu || firstFilm.nameEn}</div>
                        <div className='navbar__description'>
                          <span className='navbar__rating' style={{color: firstFilm.rating >= 7 ? 'green' : 'gray'}}>
                            {firstFilm.rating == 'null' ? '-' : firstFilm.rating}
                          </span>
                          <span style={{marginLeft: '8px'}}>
                            {firstFilm.nameEn}, {firstFilm.year}
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div style={{padding: '5px 0 5px 10px'}}>
                    Фильмы и серилы
                  </div>
                  <div className='navbar__search'>
                    {data.films.map((i, index) =>
                      <a 
                        key={index} 
                        className='navbar__item' 
                        onClick={() => window.location.pathname = `/film/${i.filmId}`}
                        style={{display: index > 0 && index < 7 ? 'flex' : 'none'}}
                      >
                        <img className='navbar__img' src={i.posterUrlPreview || ''}/>
                        <div className='navbar__container' style={{marginLeft: '10px', lineHeight: '25px'}}>
                          <div className='navbar__name'>{i.nameRu || i.nameEn}</div>
                          <div className='navbar__description'>
                            <span className='navbar__rating' style={{color: i.rating >= 7 ? 'green' : 'gray'}}>
                              {i.rating == 'null' ? '-' : i.rating}
                            </span>
                            <span style={{marginLeft: '8px'}}>
                              {i.nameEn}, {i.year}
                            </span>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              : null : null}
              {loading ? <div className='loading' style={{padding: '40px'}}>Загрузка...</div> : ''}
              {data && hasItems ? <div className='loading' style={{padding: '40px'}}>По вашему запросу ничего не найдено</div> : ''}
            </div>
          </div>
        </div>
        {!isAuth && isResponseLoaded
          ? 
            <div style={{display: 'flex'}}>
              <button 
                className='navbar__button-authorization'
                onClick={() => {
                  setValueOfButton('login')
                  setModalActive(true)
                }}
              >
                Войти
              </button>
              <button 
                className='navbar__button-authorization'
                onClick={() => {
                  setValueOfButton('registration')
                  setModalActive(true)
                }}
              >
                Регистрация
              </button> 
            </div>
          :
            <div className='navbar__account'>
              {picture ? 
                <a href='/profile' style={{backgroundImage: `url(${serverUrl + picture})`}}></a>
              : null
              }
            </div>
        }
        {modalActive ? 
          <Modal
            isAuth={isAuth}
            value={valueOfButton} 
            active={modalActive} 
            setActive={setModalActive}
          /> : ''
        }
      </div>
    </nav>
  )
}

export default Navbar