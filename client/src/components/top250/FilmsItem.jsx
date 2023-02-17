import React from 'react'
import { Link } from 'react-router-dom'
import './Films.css'

const FilmsItem = (props) => {
  const film = props.film
  const filmNameEn = film.nameEn !== null ? film.nameEn + ', ' : ''
  const isMobile = props.isMobile
  const rating = +film.rating || null
  const isSequel = props.isSequel
  const hideRating = props.hideRating || false

  if(isMobile){
    require('./Films-mobile.css')
    return(
      <Link className='film-item-mobile' to={`/film/${film.filmId}`} key={film.filmId}>
        <div
          className='item__rating-mobile' 
          style={{display: !hideRating ? 'flex' : 'none'}}
        >
          {rating}
        </div>
        <img className='item__img-mobile' src={film.posterUrlPreview}/>
        <div style={{cursor: 'pointer'}} className='item__block'>
          <div className='block__title-mobile'>
            {film.nameRu}
          </div>
          <div className='block__description-mobile'>
            {!isSequel ? filmNameEn : ''} {!isSequel ? film.year : ''}
          </div>
          <div className='block__countries-mobile'>
            {!isSequel ? film.countries[0]?.country : ''} 
            {!isSequel ? '·' : ''} 
            {!isSequel ? film.genres.map((item, index) => {
              if(index < 3){
                return item.genre + ', '
              }
            }).join('').slice(0, -2) : ''}
          </div>
        </div>
      </Link>
    )
  }
  return(
    <Link to={`/film/${film.filmId}`} className='film-item' key={film.filmId}>
      <img className='item__img' src={film.posterUrlPreview}/>
      <div 
        style={{
          border: rating > 7.5 ?  '2px solid #3aec16' : '2px solid #ffb957',
          display: rating ? 'flex' : 'none'
        }} 
        className='item__rating'
      >
        {rating}
      </div>
      <div className='item__title'>
        {film.nameRu}
      </div>
    </Link>
  )
}

export default FilmsItem