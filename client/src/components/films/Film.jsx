import React, { useState, useEffect, useContext } from 'react'
import Preanimation from '../animation/Preanimation'
import './Film.css'
import './Film-mobile.css'
import Navbar from '../navbars/Navbar'
import FilmMobile from './FilmMobile'
import { getTimeFromMins } from '../functions/functions'
import FilmSecondBlock from './FilmSecondBlock'
import { Context } from '../../index'
import Animation from '../animation/Animation'
import options from '../../kinopoiskApi/kinopoiskApiOptions'
import NotFound from '../notFound/NotFound'

function AddToFavourite({ filmId, filmPicture, filmTitle }){
  const [favValue, setFavValue] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingFav, setLoadingFav] = useState(true)
  const {store} = useContext(Context)

  useEffect(() => {
    (async function(){
      try{
        const films = await store.getUserFavFilms(store.user.username)
        setLoading(false)
        setLoadingFav(false)
        setFavValue(!films.filter(i => i.filmId == filmId).length)
      }catch(e){
        console.log(e);
      }
    })()
  }, [])

  async function addUserFavFilm(){
    try{
      setLoadingFav(true)
      await store.addUserFavFilm(store.user.email, filmId, filmPicture, filmTitle)
      setFavValue(false)
      setLoadingFav(false)
    }catch(e){
      console.log(e);
    }
  }

  async function removeUserFavFilm(){
    try{
      setLoadingFav(true)
      await store.removeUserFavFilm(store.user.email, filmId)
      setFavValue(true)
      setLoadingFav(false)
    }catch(e){
      console.log(e);
    }
  }

  return(
    <div>
      {!loading ? 
        favValue ? (
          <button 
            className='orig-btn default-margin-top' 
            onClick={() => addUserFavFilm()}
            disabled={loadingFav}
          >
            {loadingFav ? <Animation size='20px'/> : 'Добавить в Избранное'}
          </button>
        ) : (
          <button 
            className='orig-btn-err default-margin-top' 
            onClick={() => removeUserFavFilm()}
            disabled={loadingFav}
          >
            {loadingFav ? <Animation size='20px'/> : 'Удалить из избранного'}
          </button>
        ) : null
      }
    </div>
  )
}

const Film = ({ isMobile }) => {
  const [info, setInfo] = useState()
  const [budget, setBudget] = useState()
  const [posters, setPosters] = useState()
  const [videoLink, setVideoLink] = useState()
  const [sequelsAndPrequels, setSequelsAndPrequels] = useState()
  const [isLoad, setIsLoad] = useState(false)
  const [error, setError] = useState(false)

  const pathName = window.location.pathname;
  const filmId = pathName.substring(pathName.lastIndexOf('/') + 1)

  useEffect(() => {

  }, [])

  useEffect(() => {
    (async function(){
      try{
        await fetchFilmPosters()
        await fetchFilmVideoLink()
        await fetchSequelsAndPrequels()
        await fetchFilmBudget()
        await fetchFilmInfo()
      }catch(e){
        setError(e)
      }
    })()
  }, [])

  async function fetching(opt){
    const response = await fetch(opt, options)
    const data = await response.json()
    return data;
  }

  async function fetchFilmInfo(){
    const data = await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`)
    setInfo(data)
    setIsLoad(true)
  }
  async function fetchFilmBudget(){
    const data = await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/box_office`)
    setBudget(data)
  }
  async function fetchFilmVideoLink(){
    const data = await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/videos`)
    setVideoLink(data.items.filter(i => {
      return i.url.includes('kinopoisk')
    })[0].url)
  }
  async function fetchFilmPosters(){
    const data = await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/images?type=SHOOTING&page=1`)
    setPosters(data)
  }
  async function fetchSequelsAndPrequels(){
    const data = await fetching(`https://kinopoiskapiunofficial.tech/api/v2.1/films/${filmId}/sequels_and_prequels`)
    setSequelsAndPrequels(data)
  }

  String.prototype.addSpaces = function(){
    return this.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')
  }
  
  if(isLoad && !isMobile && !error){
    function returnBudget(arr, settings){
      const filteredArr = arr?.items.filter(i => i.type == settings)[0];
      if(filteredArr === undefined){
        return 'неизвестно';
      }else{
        const symbol = filteredArr.symbol == '$' ? filteredArr.symbol : filteredArr.symbol + ' '
        return symbol + filteredArr.amount
      }
    }
    
    const BUDGET = returnBudget(budget, 'BUDGET');
    const MARKETING = returnBudget(budget, 'MARKETING');
    const US_FEES = returnBudget(budget, 'USA');
    const WORLD_FEES = returnBudget(budget, 'WORLD')
    
    const randomPoster = Math.floor(Math.random() * posters?.items.length) || '';
    return(
      <div>
        <Navbar/>
        <button className='on-top' onClick={() => window.scrollTo(0, 0)}>
          <div className="arrow-top"></div>
        </button>
        <div className='content'>
          <div className='content__wrapper'>
            <div className='content__images'>
              <img className='content__img' src={info.posterUrlPreview}/>
              <div>
                <img 
                  src={posters.total == 0 ? '' : typeof posters == 'object' ? posters.items[randomPoster]?.imageUrl : ''}
                />
              </div>
              <button
                className='orig-btn'
                style={{marginTop: '10px'}}
                onClick={() => window.location.href = videoLink}
                target='_blank'
              >
                Смотреть трейлер
              </button>
            </div>
            <div className='content__block'>
              <h1 className='content__title-ru'>
                {info.nameRu} ({info.year})
              </h1>
              <div className='content__title-en'>
                {info.nameOriginal}
                <span className='content__age-limit'>
                  {info.ratingAgeLimits.substring(3) + '+'}
                </span>
              </div>
              <AddToFavourite filmId={filmId} filmPicture={info.posterUrlPreview} filmTitle={info.nameRu}/>
              <div className='about-film__block'>
                <h2 className='contnet__title'>О фильме</h2>
                <table className='content__table'>
                  <tbody>
                    <tr>
                      <td className='content__title'>Год производства</td>
                      <td className='content__description'>{info.year}</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Страна</td>
                      <td className='content__description'>{info.countries.map((item, index, arr) => {
                          if(index == arr.length-1){
                            return item.country
                          }else{
                            return item.country + ', '
                          }
                        })}</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Жанр</td>
                      <td className='content__description'>{info.genres.map((item, index, arr) => {
                          if(index == arr.length-1){
                            return item.genre
                          }else{
                            return item.genre + ', '
                          }
                        })}</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Слоган</td>
                      <td className='content__description' id='slogan'>«{info.slogan}»</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Бюджет</td>
                      <td className='content__description'>{BUDGET.addSpaces()}</td>
                    </tr>
                    <tr style={{display: MARKETING == 'неизвестно' ? 'none' : ''}}>
                      <td className='content__title'>Маркетинг</td>
                      <td className='content__description'>{MARKETING.addSpaces()}</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Сборы в США</td>
                      <td className='content__description'>{US_FEES.addSpaces()}</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Сборы в мире</td>
                      <td className='content__description'>{WORLD_FEES.addSpaces()}</td>
                    </tr>
                    <tr>
                      <td className='content__title'>Время</td>
                      <td className='content__description'>{info.filmLength} мин. / {getTimeFromMins(info.filmLength)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
                <div className='sequels-and-prequels'>
                  <div className='sequels-and-prequels__title' 
                    style={{display: sequelsAndPrequels?.length === 0 ? 'none' : 'block'}}
                  >
                    <a href={pathName + '/sequels-and-prequels'} style={{cursor: 'pointer', display: 'inline-block'}}>
                      Сиквелы и приквелы 
                      <span style={{color: '#b4b4b466'}}>
                        {'  ' + sequelsAndPrequels?.length}{' >'}
                      </span>
                    </a>
                  </div>
                  <div className='sequels-and-prequels__block'>
                    {sequelsAndPrequels.map((i, index) => {
                      if(i != [] && index < 6){
                        return(
                          <div key={i.filmId} className='sequels-and-prequels__item'>
                            <a href={`./${i.filmId}`}>
                              <img className='sequels-and-prequels__img' src={i.posterUrlPreview}/>
                              <div className='sequels-and-prequels__name-of-film'>{i.nameRu}</div>
                            </a>
                          </div>
                        )
                      }
                    })}
                    <div className='sequels-and-prequels__items'></div>
                  </div>
                </div>
            </div>
            <div className='right-block'>
              <div className='film-rating'>
                <div className='film-rating__bg left'></div>
                <div className='film-rating__count'>{info.ratingKinopoisk}</div>
                <div className='film-rating__bg right'></div>
              </div>
              <div className='vote-count'>
                {String(info.ratingKinopoiskVoteCount).addSpaces()} оценки
              </div>
              <div className='reviews-count'>
                {String(info.reviewsCount).addSpaces()} рецензии
              </div>
            </div>
          </div>
          <FilmSecondBlock filmId={filmId}/>
        </div>
      </div>
    )
  }else if(error){
    return(
      <NotFound>
        <a className='not-found__link' href={`https://kinopoisk.ru/film/${filmId}`}>
          Посмотреть фильм на оффициальном сайте кинопоиска
        </a>
      </NotFound>
    )
  }else if(!isLoad){
    return <Preanimation/>
  }else{
    return(
      <FilmMobile info={info}/>
    )
  }
}

export default Film