import React, { useEffect, useRef } from "react"

const CarouselImg = ({ items }) => {
  const carousel = useRef(null)

  useEffect(() => {
    let list = carousel.current.querySelector('.carousel__container.for-img')
    let listElems = carousel.current.querySelectorAll('.carousel__item.for-img')
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
        <div className='carousel__container for-img' style={{alignItems: 'center'}}>
          {items.map((i, index) => 
            <div className='carousel__item for-img' style={{width: 'auto', display: 'inline-block'}} key={index}>
              <img src={i.previewUrl}/>
            </div>
          )}
        </div>
      </div>
      <button className='arrow next'><span className='rotate-180deg'>{'〱'}</span></button>
    </div>
  )
}

export default CarouselImg