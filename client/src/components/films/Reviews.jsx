import React, { useRef, useState } from 'react'
import './Reviews.css'

const Reviews = ({ data, selected }) => {
  const [isSelected, setIsSelected] = useState({})
  const [isContinue, setIsContinue] = useState(false)

  function showReview(index, arr){
    const obj = {}
    for(let i = 0; i <= arr.length; i++){
      obj[i] = false
    }
    setIsSelected({...obj, ...isSelected, [index]: true})
  }
  
  async function hideReview(index, arr, e){
    const obj = {}
    for(let i = 0; i <= arr.length; i++){
      obj[i] = false
    }
    await setIsSelected({...obj, ...isSelected, [index]: false})
    window.scrollBy(window.pageXOffset, e.target.getBoundingClientRect().y - 600)
  }
  
  const reviews = data[selected]
  return(
    <div>
      {Object.values(reviews).map((i, index, arr) => {
        if(index === 3 && !isContinue){
          return(
            <button key={index} className='orig-btn' onClick={() => setIsContinue(true)}>
              <span className='rotate--90deg'>{'〱'}</span> Показать еще
            </button>
          )
        }
        if(index > 3 && !isContinue) return 
        return(
          <div
            key={i.kinopoiskId}
            className='reviews__block' 
            style={{
              backgroundColor: i.type == 'POSITIVE' ? '#3bb33b80' : i.type == 'NEGATIVE' ? '#ff000080' : '#c2c2c299',
              display: index >= 7 ? 'none' : ''
            }}
          >
            <div className='reviews__head'>
              <div className='reviews__name'>{i.author}</div>
              <div className='reviews__date'>{i.date}</div>
            </div>
            <div className='reviews__body'>
              <h4 className='reviews__title'>{i.title}</h4>
              <div style={{maxHeight: isSelected[index] ? '' : '270px', overflow: 'hidden'}}>
                <div className='reviews__description'>{i.description}</div>
              </div>
              <button 
                className='reviews__button' 
                onClick={(e) => isSelected[index] ? hideReview(index, arr, e) : showReview(index, arr)}
              >
                {!isSelected[index] ? 'показать всю рецензию' : 'скрыть'}
              </button>
            </div>
          </div>
        )}
      )}
    </div>
  )
}

export default Reviews