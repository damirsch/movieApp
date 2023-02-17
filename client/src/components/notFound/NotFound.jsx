import React from 'react'
import error404 from '../img/404.png'
import './NotFound.css'

const NotFound = ({ children }) => {
  return(
    <div className='not-found'>
      <div className='not-found__logo'>
        <div className='logo__wrapper'>
          <a href='/'>
            Кинопоиск V2
            <div className='logo__dash'></div>
          </a>
        </div>
      </div>
      <div className='not-found__wrapper'>
        <img src={error404} className='not-found__img'/>
        <div className='not-found__content'>
          <h1 className='not-found__title'>
            404. Страница не найдена
          </h1>
          <div className='not-found__description'>
            Возможно, она была перемещена, или вы просто неверно указали адрес страницы.
          </div>
          <div className='not-found__links'>
            {children}
            <a className='not-found__link' href='/'>
              Перейти на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound