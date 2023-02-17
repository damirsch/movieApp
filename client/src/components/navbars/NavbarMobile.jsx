import React, { useState, useEffect, useRef } from 'react'
import './Navbar-mobile.css'
import search from '../img/search.svg'
import account from '../img/account.svg'
import close from '../img/close.svg'
import { useDebounce } from '../functions/use-debounce'
import { navbarItems } from './navbarItems'

const NavbarMobile = () => {
  const [value, setValue] = useState()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState()
  const [data, setData] = useState()
  const [hasItems, setHasItems] = useState()
  const [isButtonClick, setIsButtonClick] = useState(false)
  const debouncedSearchTerm = useDebounce(value, 200)
  const ref = useRef(null)

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
    if(!ref.current) return
    if(isButtonClick){
      ref.current.focus()
    }else{
      ref.current.blur()
    }
  }, [isButtonClick])

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
  
  function onSubmit(e){
    const origin = window.location.origin
    e.preventDefault()
    console.log(window.location.href);
    window.location.href = new URL('films/search/' + value, origin)
  }

  document.body.style.overflow = isButtonClick || checked ? "hidden" : ""

  const firstFilm = data ? data.films[0] : 'null';
  return (
    <nav className='navbar-mobile'>
      <div className='navbar__wrapper-mobile'>
        <div className='navbar__menu-mobile'
        >
          <input className='toggle-mobile' type='checkbox' onChange={e => setChecked(e.target.checked)}/>
          <div className='navbar__logo-mobile'>
            <div className='burger-mobile'>
              <div className='burger__top-mobile'></div>
              <div className='burger__middle-mobile'></div>
              <div className='burger__bottom-mobile'></div>
            </div>
            <div className='navbar__text-mobile'>
              Kinopoisk V2
            </div>
          </div>
          <div className='navbar__items-mobile' 
            style={{display: checked ? 'flex' : 'none'}}
          >
            {navbarItems}
          </div>
        </div>
        <div className='navbar__right-block-mobile'>
          <div className='navbar__search-mobile-open' onClick={() => setIsButtonClick(true)}>
            <img className='navbar__search-mobile' src={search}/>
          </div>
          {isButtonClick 
            ?
            <div 
              style={{
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                zIndex: 4
              }}
              onClick={() => setIsButtonClick(false)}
            >
              <div className='fixed-left-block'>
                <div className='fixed-left-block__nav' onClick={e => e.stopPropagation()}>
                  <img src={search} style={{margin: '10px'}}/>
                  <form onSubmit={(e) => onSubmit(e)} style={{width: '100%'}}>
                    <input 
                      type='text'
                      className='fixed-left-block__input' 
                      placeholder='Введите название фильма или сериала'
                      onChange={(e) => setValue(e.target.value)}
                      required
                      ref={ref}
                    />
                    <input type='submit' style={{display: 'none'}}/>
                  </form>
                  <button className='close' onClick={() => setIsButtonClick(false)}>
                    <img src={close}/>
                  </button>
                </div>
                <div className='navbar__items-mobile'>
                  {data ? data.films.length ? value !== '' ?
                    <div key={2} className='navbar__films-mobile' onClick={e => e.stopPropagation()}>
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
                            style={{display: index ? 'flex' : 'none'}}
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
                  : '' : '' : ''}
                  {loading ? <div style={{padding: '40px', textAlign: 'center'}}>Загрузка...</div> : ''}
                  {data && hasItems ? <div style={{padding: '40px', textAlign: 'center'}}>По вашему запросу ничего не надено</div> : ''}
                </div>
              </div>
            </div> : ''
          }
          <a href='/profile' style={{cursor: 'default'}}>
            <img className='navbar__account-mobile' src={account}/>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default NavbarMobile