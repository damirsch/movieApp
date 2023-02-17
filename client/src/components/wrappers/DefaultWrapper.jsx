import React from 'react'

const DefaultWrapper = (props) => {
  return (
    <div className='content'>
      <div className='content__wrapper'>
        {props.children}
      </div>
    </div>
  )
}

export default DefaultWrapper