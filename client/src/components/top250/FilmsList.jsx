import React, { useState } from 'react'
import FilmsItem from './FilmsItem'

const FilmsLIst = ({data, isMobile}) => {

  if(isMobile){
    return(
      <div className='films-list-mobile'>
        {data.map(item => 
          item.films.map(film => 
            <FilmsItem isMobile={isMobile} key={film.filmId} film={film}/>
          )
        )}
      </div>
    )
  }
  return (
    <div className='films-list'>
      {data.map(item => 
        item.films.map(film => 
          <FilmsItem key={film.filmId} isMobile={isMobile} film={film}/>
        )
      )}
    </div>
  )
}

export default FilmsLIst