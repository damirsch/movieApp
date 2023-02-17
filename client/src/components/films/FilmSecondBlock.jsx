import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import Reviews from './Reviews'
import './Film.css'
import options from '../../kinopoiskApi/kinopoiskApiOptions'
import FilmThirdBlock from './FilmThirdBlock'
import Carousel from '../carousel/Carousel'
import CarouselImg from '../carousel/CarouselImg'

const FilmSecondBlock = ({ filmId }) => {
  const [description, setDescription] = useState({selected: false, isFetching: false});
  const [awards, setAwards] = useState({selected: false, isFetching: false});
  const [images, setImages] = useState({selected: false, isFetching: false});
  const [reviews, setReviews] = useState({
    selected: false, 
    isFetching: false,
    all: null,
    positive: null,
    negative: null,
  });
  const [reviewsSelected, setReviewsSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(true)

  const ref = useRef()

	useEffect(() => {
		fetchFilmDescription()
	}, [])

  async function fetching(opt){
    setLoading(true)
    const response = await fetch(opt, options)
    const data = await response.json()
    setLoading(false)
    return data;
  }

  async function fetchFilmDescription(){
    if(!description?.selected){
      setImages({...images, selected: false})
      setAwards({...awards, selected: false})
      setReviews({...reviews, selected: false})
      const data = description.isFetching ? description : await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/`);
      setDescription({...data, selected: true, isFetching: true})
    }
  }

  async function fetchFilmAwards(){
    if(!awards?.selected){
      setImages({...images, selected: false})
      setDescription({...description, selected: false})
      setReviews({...reviews, selected: false})
      const data = awards.isFetching ? awards : await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/awards`);
      setAwards({...data, selected: true, isFetching: true})
    }
  }

  
  async function fetchFilmReviews(rating = 'all', isClick){
    const rename = {
      all: 'DATE_DESC',
      positive: 'USER_POSITIVE_RATING_DESC',
      negative: 'USER_NEGATIVE_RATING_DESC',
    }
    const renamedRating = rename[rating]
    if(reviewsSelected != rating || isClick){
      setLoading(true)
      setAwards({...awards, selected: false})
      setImages({...images, selected: false})
      setDescription({...description, selected: false})
      const data = reviews[rating] ? reviews : 
      await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/reviews?page=1&order=${renamedRating}`)
      setLoading(false)
      setReviewsSelected(rating)

      const filteredArrayOfPositiveReviews = reviews[rating] ? reviews[rating] : data.items.filter(i => i.type == 'POSITIVE')
      const filteredArrayOfNegativeReviews = reviews[rating] ? reviews[rating] : data.items.filter(i => i.type == 'NEGATIVE')
      console.log(reviews);

      if(rating == 'all' && !reviews.all){
        setReviews({
          ...reviews,
          selected: true,
          isFetching: true,
          all: {...data.items},
          total: data.total,
          totalNegativeReviews: data.totalNegativeReviews,
          totalPositiveReviews: data.totalPositiveReviews,
        })
      }else if(rating == 'positive' && !reviews.positive){
        setReviews({
          ...reviews,
          selected: true,
          isFetching: true,
          positive: {...filteredArrayOfPositiveReviews},
        })
      }else if(rating == 'negative'  && !reviews.negative){
        setReviews({
          ...reviews,
          selected: true,
          isFetching: true,
          negative: {...filteredArrayOfNegativeReviews},
        })
      }else{
        setReviews({
          ...reviews,
          selected: true,
          isFetching: true
        })
      }
      setActive(true)
    }
  }

  async function fetchFilmImages(){
    if(!images?.selected){
      setAwards({...awards, selected: false})
      setDescription({...description, selected: false})
      setReviews({...reviews, selected: false})
      const data = images.isFetching ? images : 
      await fetching(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/images?type=STILL&page=1`)
      setImages({...data, selected: true, isFetching: true})
    }
  }

  function goToComponentStart(){
    if(ref.current){
      ref.current.scrollIntoView({block: "center", behavior: "smooth"})
    }
  }

  let abbreviatedAwards = awards?.items ? awards.hasOwnProperty('items') ? awards.items.map(i => i = i.name) : '' : '';
  abbreviatedAwards = abbreviatedAwards ? abbreviatedAwards.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {}) : '';

  return(
    <div className='film-details-block'>
      <div className='left-block'>
        <div className='film-details-block__nav' ref={ref}>
          <div className='film-details-block__wrapper'>
            <button 
              className='film-details-block__button'
              onClick={() => fetchFilmDescription()}  
            >
              Обзор
            </button>
          </div>
          <div className='film-details-block__wrapper'>
            <button 
              className='film-details-block__button'
              onClick={() => fetchFilmAwards()} 
            >
              Награды
            </button>
          </div>
          <div className='film-details-block__wrapper'>
            <button
              className='film-details-block__button'
              onClick={() => fetchFilmReviews('all', true)}
            >
              Рецензии
            </button>
          </div>
          <div className='film-details-block__wrapper'>
            <button
              className='film-details-block__button'
              onClick={() => fetchFilmImages()}
            >
              Изображения
            </button>
          </div>
        </div>
        <div className='film-details-block__film-description'>
					{description.selected && !loading ? description.description : ''}
          {awards.selected && !loading ?
            Object.keys(abbreviatedAwards).map(key => {
              return(
                <div style={{fontSize: '18px'}} key={key}>{key}: {abbreviatedAwards[key]}</div>
              )
            }) : ''
          }
          {images.selected && !loading ?
            <div>
              <CarouselImg items={images.items}/>
            </div> : ''
          }
          {reviews.selected ? 
            <div className='reviews'>
              {loading 
              ?
                <div className='loading'>Загрузка...</div> 
              :
              active
              ?
                <div>
                  <Reviews data={reviews} selected={reviewsSelected}/>
                  <button 
                    style={{marginRight: '20px'}}
                    className='orig-btn' 
                    onClick={() => window.location.href += '/reviews'}
                  >
                    Показать все
                  </button>
                  <button 
                    className='orig-btn' 
                    onClick={() => {setActive(false); fetchFilmDescription(); goToComponentStart()}}
                  >
                    Скрыть
                  </button>
                </div> : null
              }
              <div className='reviews-right-panel' style={{display: active ? '' : 'none'}}>
                <div 
                  className='reviews-right-panel__block' 
                  onClick={() => fetchFilmReviews('all', false)}
                >
                  <div className='reviews-right-panel__title' style={{color: '#fff'}}>{reviews.total}</div>
                  <div className='reviews-right-panel__description'>Всего</div>
                  <div className='left-line' style={
                    {
                      top: reviewsSelected == 'all' ? '5px' : 
                      reviewsSelected == 'positive' ? '57px' : 
                      reviewsSelected == 'negative' ? '110px' : '163px',
                    }
                  }></div>
                </div>
                <div 
                  className='reviews-right-panel__block'
                  onClick={() => fetchFilmReviews('positive', false)}
                >
                  <div className='reviews-right-panel__title' style={{color: '#3bb33b'}}>{reviews.totalPositiveReviews}</div>
                  <div className='reviews-right-panel__description'>Положительные</div>
                </div>
                <div 
                  className='reviews-right-panel__block'
                  onClick={() => fetchFilmReviews('negative', false)}
                >
                  <div className='reviews-right-panel__title' style={{color: 'red'}}>{reviews.totalNegativeReviews}</div>
                  <div className='reviews-right-panel__description'>Отрицательные</div>
                </div>
              </div>
            </div>
            : ''
          }
          {loading && !reviews.selected ? <div className='loading'>Загрузка...</div> : null}
				</div>
        <FilmThirdBlock filmId={filmId}/>
      </div>
      <div className='right-block'>
        
      </div>
    </div>
  )
}

export default FilmSecondBlock