import axios from "axios";
import React, { useEffect, useState } from "react";
import FilmsList from "../components/top250/FilmsList";
import Preanimation from "../components/animation/Preanimation";
import Navbar from '../components/navbars/Navbar'
import NavbarMobile from "../components/navbars/NavbarMobile";
import '../App.css'

function TopFilms({isMobile}) {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [fetching, setFetching] = useState(true)

  function fetchFilms(){
    if(fetching){
      axios.get(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${currentPage}`,
        {
          headers: {
            'X-API-KEY': '9e4abc82-62f5-44b0-b6da-cf45a8b108ff',
            'Content-Type': 'application/json',
          }
        }
      )
        .then(
          result => {
            setIsLoaded(true);
            setCurrentPage(prev => prev + 1)
            if(data == undefined){
              setData([result.data])
            }else{
              setData([...data, result.data])
            }
          },
          error => {
            setIsLoaded(false);
            setError(error);
          }
        )
        .finally(() => setFetching(false))
    }
  }

  useEffect(() => {
    document.title = '250 лучших фильмов — Кинопоиск V2'
    fetchFilms()
  }, [fetching])

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

  function loadMore(){
    setFetching(true)
  }

  if(error){
    return (
      <div className="error">
        <div>
          <div style={{color: 'red'}}>
            Произошла ошибка
          </div>
          <div onClick={() => window.location.reload()} style={{cursor: 'pointer'}}>
            Попробуйте перезагрузить страницу
          </div>
        </div>
      </div>
    )
  }else if(!isLoaded){
    return <Preanimation/>
  }else if(isMobile && isLoaded){
    return(
      <div className="App">
        <NavbarMobile/>
        <FilmsList isMobile={true} data={data}/>
        <button className="load-button" onClick={loadMore}>Load more</button>
      </div>
    )
  }
  return(
      <div className="App">
        <Navbar/>
        <FilmsList isMobile={false} data={data}/>
        <button className="load-button" onClick={loadMore}>Load more</button>
      </div>
    )
}

export default TopFilms;