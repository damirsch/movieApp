import React from 'react'
import './Animation.css'

const Animation = ({size}) => {
  return (
    <svg className="spinner" viewBox="0 0 50 50" style={size ? {width: size, height: size} : null}>
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  )
}

export default Animation