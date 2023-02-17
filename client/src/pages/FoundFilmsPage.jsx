import React, { useState, useEffect } from 'react'
import kinopoiskApiUrl from '../kinopoiskApi/kinopoiskApiUrl'
import Preanimation from '../components/animation/Preanimation'
import DefaultWrapper from '../components/wrappers/DefaultWrapper'
import Navbar from '../components/navbars/Navbar'
import NavbarMobile from '../components/navbars/NavbarMobile'
import FilmsItem from '../components/top250/FilmsItem'
import axios from 'axios'

const FoundFilms = ({ isMobile }) => {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [stop, setStop] = useState(false)
  const [data, setData] = useState(null)

  const searchKey = window.location.pathname.replace('/films/search/','')

  useEffect(() => {
    fetchFilms()
  }, [fetching])

  useEffect(() => {
    if(!data) return
    document.title = `Поиск по запросу: ${data[0].keyword}`
  }, [data])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    return function(){
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  const scrollHandler = e => {
    const documentEl = e.target.documentElement
    if(documentEl.scrollHeight - (documentEl.scrollTop + window.innerHeight) < 700){
      setFetching(true)
    }
  }

  function fetchFilms(){
    if(fetching){
      if(stop) return
      axios.get(
        kinopoiskApiUrl + `v2.1/films/search-by-keyword?keyword=${searchKey}&page=${currentPage}`,
        {
          headers: {
            'X-API-KEY': '9e4abc82-62f5-44b0-b6da-cf45a8b108ff',
            'Content-Type': 'application/json',
          }
        }
      )
        .then(
          result => {
            if(!result.data.films.length){
              setStop(true)
            }
            if(data == undefined){
              setData([result.data])
            }else if(result.data.films.length){
              setData([...data, result.data])
            }
            setIsLoaded(true);
            setCurrentPage(prev => prev + 1)
          },
          error => {
            setIsLoaded(false);
            setError(error);
          }
        )
        .finally(() => setFetching(false))
    }
  }

  if(isLoaded && !error){
    if(isMobile){
      if(!data[0].films.length){
        return(
          <div className='content-mobile'>
            <NavbarMobile/>
            <div className='films-not-found'>
              <div>
                Увы, фильмы по заросу "{data[0].keyword}" не найдены
              </div>
            </div>
          </div>
        )
      }else{
        return(
          <div>
            <NavbarMobile/>
            <div className='films-list-mobile'>
              {data.map(i =>
                i.films.map(i => 
                  <FilmsItem isMobile={isMobile} film={i} hideRating={true}/>
                )
              )}
            </div>
          </div>
        )
      }
    }

    if(!data[0].films.length){
      return(
        <div>
          <Navbar/>
          <DefaultWrapper>
            <div className='large-text'>
              Увы, фильмы по заросу "{data[0].keyword}" не найдены
            </div>
          </DefaultWrapper>
        </div>
      )
    }else{
      return(
        <div>
          <Navbar/>
          <DefaultWrapper>
            <div>
              <div className='large-text default-margin-bottom'>
                Результаты поиска по запросу: {data[0].keyword}
              </div>
              <div className='default-flex'>
                {data.map(i =>
                  i.films.map(i =>
                    <a 
                      className='film-item' 
                      key={i.filmId}
                      onClick={() => window.location.href = '/film/' + i.filmId}
                    >
                      <img className='item__img' src={i.posterUrlPreview}/>
                      <div className='item__title'>{i.nameRu || i.nameEn}</div>
                    </a>
                  )
                )}
              </div>
            </div>
          </DefaultWrapper>
        </div>
      )
    }
  }
  if(error){
    return(
      <div className='error'>
        Произошла ошибка
      </div>
    )
  }
  if(isLoaded){
    return(
      <Preanimation/>
    )
  }
}

export default FoundFilms