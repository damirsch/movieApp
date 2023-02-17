import React, { useRef, useEffect } from 'react'
import './Carousel.css'

const Carousel = ({ items }) => {
  const carousel = useRef(null)

  useEffect(() => {
    let list = carousel.current.querySelector('.carousel__container')
    let listElems = carousel.current.querySelectorAll('.carousel__item')
    const prev = carousel.current.querySelector('.prev')
    const next = carousel.current.querySelector('.next')

    let width = listElems[0].clientWidth + 10
    let count = 1
    let position = 0

    prev.onclick = function() {
      position += width * count
      position = Math.min(position, 0)
      list.style.marginLeft = position + 'px'
      next.style.display = 'block'
      if(position === 0) prev.style.display = 'none'
    }
  
    next.onclick = function() {
      position -= width * count
      position = Math.max(position, -width * (listElems.length - count))
      list.style.marginLeft = position + 'px'
      if(position == -width * (listElems.length - count)) next.style.display = 'none'
      if(position !== 0) prev.style.display = 'block'
    }

    window.addEventListener('resize', () => {
      width = listElems[0].clientWidth + 10
    }, false);
  }, [])

  return(
    <div className='carousel' ref={carousel}>
      <button className='arrow prev'>〱</button>
      <div className='carousel__items'>
        <div className='carousel__container'>
          {items.map((i, index) => 
            <a 
              href={i.url} 
              className='carousel__item' 
              key={index}
            >
              <div className='carousel__img'></div>
              <div className='carousel__title all'>{i.name}</div>
            </a>
          )}
        </div>
      </div>
      <button className='arrow next'><span className='rotate-180deg'>{'〱'}</span></button>
    </div>
  )
}

export default Carousel