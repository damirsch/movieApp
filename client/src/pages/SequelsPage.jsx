import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbars/Navbar';
import NavbarMobile from '../components/navbars/NavbarMobile';
import FilmsItem from '../components/top250/FilmsItem'
import '../components/top250/Films-mobile.css'
import options from '../kinopoiskApi/kinopoiskApiOptions';
import kinopoiskApiUrl from '../kinopoiskApi/kinopoiskApiUrl';

const Sequels = ({ isMobile }) => {
  const [sequels, setSequels] = useState()
  const [isLoad, setIsLoad] = useState(false)

  const pathName = window.location.pathname.replace('/sequels-and-prequels','');
  const filmId = pathName.substring(pathName.lastIndexOf('/') + 1);
  
  async function fetchSequels(){
    const response = await fetch(kinopoiskApiUrl + `/v2.1/films/${filmId}/sequels_and_prequels`, options)
    const data = await response.json()
    setSequels(data)
    setIsLoad(true)
  }

  useEffect(() => {
    fetchSequels()
  }, [])
  
  if(!isMobile && isLoad && sequels.length){
    return(
      <div>
        <Navbar/>
        <div className='films-list'>
          {sequels.map(film => 
            <FilmsItem key={film.filmId} isMobile={isMobile} film={film}/>
          )}
        </div>
      </div>
    )
  }else if(isMobile && isLoad && sequels.length){
    return(
      <div>
        <NavbarMobile/>
        <div className='films-list-mobile'>
          Сиквелы и приквелы
          {sequels.map(film => 
            <FilmsItem key={film.filmId} isMobile={isMobile} film={film} isSequel={true}/>
          )}
        </div>
      </div>
    )
  }else if(isLoad){
    return (
      <div className='error'>
        404. Страница не найдена
      </div>
    )
  }
}

export default Sequels