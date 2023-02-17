import React, { useRef, useEffect, useState } from 'react'
import options from '../../kinopoiskApi/kinopoiskApiOptions'
import DOMPurify from 'dompurify'
import kinopoiskApiUrl from '../../kinopoiskApi/kinopoiskApiUrl'
import Carousel from '../carousel/Carousel'

const FilmThirdBlock = ({ filmId }) => {
  const [facts, setFacts] = useState()
  const [trailers, setTrailers] = useState()
  const [loadFacts, setLoadFacts] = useState(false)
  const [loadTrailers, setLoadTrailers] = useState(false)
  const [isContinue, setIsContinue] = useState(false)

  const factBlock = useRef(null)
  const trailerBlock = useRef(null)

  async function fetchFacts(){
    const response = await fetch(kinopoiskApiUrl + `v2.2/films/${filmId}/facts`, options)
    const data = await response.json()
    setLoadFacts(true)
    setFacts(data)
  }

  async function fetchTrailers(){
    const response = await fetch(kinopoiskApiUrl + `v2.2/films/${filmId}/videos`, options)
    const data = await response.json()
    setLoadTrailers(true)
    setTrailers(data)
  }

  function scrollHandler(){
    let fetchCount = 0
    function calculate(elem){
      if(elem){
        const posTop = elem.getBoundingClientRect().top
        return posTop + elem.clientHeight <= window.innerHeight && posTop >= 0
      }
      return null
    }
    function fetch(condition, callback){
      if(condition){
        fetchCount++
        callback()
        if(fetchCount === 2) document.removeEventListener('scroll', scrollHandler)
      }
    }
    fetch(calculate(factBlock.current), fetchFacts)
    fetch(calculate(trailerBlock.current), fetchTrailers)
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    return function(){
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  const sanitizer = DOMPurify.sanitize

  return(
    <div style={{borderTop: '1px solid #171717'}} ref={factBlock}>
      <div className='film-details-block__wrapper'>
        <div className='film-details-third-block'>
          {!loadFacts 
          ? 
            <div className='loading-title loading-block'></div>
          :
            <h3>Знаете ли вы, что...</h3>
          }
          <ul className='film-details-block__list'>
            {!loadFacts 
            ?
              <div>
                <div className='loading-trivia loading-block'></div> 
                <div className='loading-button loading-block'></div>
              </div>
            : 
              facts.items.map((i, index, arr) => {
                if(index === 3 && !isContinue) {
                  return(
                    <button key={index} className='orig-btn' onClick={() => setIsContinue(true)}>
                      <span className='rotate--90deg'>{'〱'}</span> Показать все
                    </button>
                  )
                }
                if(index > 3 && !isContinue) return
                if(arr.length === index + 1){
                  return(
                    <div>
                      <button key={index} className='orig-btn' onClick={() => setIsContinue(false)}>
                        <span className='rotate-90deg'>{'〱'}</span> Свернуть
                      </button>
                    </div>
                  )
                }
                return(
                  <div key={index}>
                    <li dangerouslySetInnerHTML={{__html: sanitizer(i.text)}}></li>
                    <br/>
                  </div>
                )}
              )}
          </ul>
        </div>
        <div className='film-details-third-block' ref={trailerBlock} style={{marginTop: '60px'}}>
          {!loadTrailers
          ?
            <div style={{marginTop: '20px'}}>
              <div className='loading-title loading-block'></div>
              <div style={{display: 'flex'}}>
                <div className='loading-item loading-block'></div>
                <div className='loading-item loading-block'></div>
              </div>
            </div>
          :
            <div>
              <h3>Трейлеры и тизеры</h3>
              <Carousel items={trailers.items}/>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default FilmThirdBlock