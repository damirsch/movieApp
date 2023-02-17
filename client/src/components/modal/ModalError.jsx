import React from 'react'
import './ModalError.css'

const ModalError = ({ errorMessage, active, setActive }) => {
  const time = 2000

  if(active){
    setTimeout(() => setActive(false), time)
    return(
      <div className='modal-error'>
        <div className='modal-error__wrapper'>
          <div className='modal-error__block' style={{animation: `modalErrorMove ${time}ms cubic-bezier(.17,.67,0,1.56)`}}>
            {errorMessage}
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default ModalError