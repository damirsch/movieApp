import React from 'react'
import { getTimeFromMins } from '../functions/functions'
import NavbarMobile from '../navbars/NavbarMobile'

const FilmMobile = ({ info }) => {
  return(
    <div className='content-mobile'>
      <NavbarMobile/>
      <div className='content-mobile__posters'>
        <img src={info.posterUrl} className='content-mobile__poster-blur' alt='img'/>
        <img src={info.posterUrl} className='content-mobile__poster' alt='img'/>
      </div>
      <div className='content-mobile__block'>
        <div className='content-mobile__name-ru'>{info.nameRu}</div>  
        <div className='content-mobile__name-en'>
          <span className='rating'>
            <span className='rating__icon'></span>
            {info.ratingKinopoisk}
            <span className='rating__icon'></span>
          </span>
          <span>{info.nameOriginal}</span>
        </div>
        <div className='info-mobile'>
          <div className='info-mobile__genres'>{info.year}, 
            {info.genres.map((item, index, arr) => {
              if(index == arr.length-1){
                return item.genre
              }else{
                return item.genre + ', '
              }
            })}
          </div>
          <div className='info-mobile__duration'>
            {info.countries[0]?.country}, {getTimeFromMins(info.filmLength)}
          </div>
        </div>
        <div className='content-mobile__descriptions'>
          <div className='content-mobile__short-description'>
            {info.shortDescription}
          </div>
          <div className='content-mobile__long-description'>
            {info.description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilmMobile