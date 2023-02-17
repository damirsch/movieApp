import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Registration1 from '../../components/authorization/Registration'

const Registration = () => {
  const [active, setActive] = useState(true)

  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  return(
    <div className='background'>
      <Registration1 active={active} setActive={setActive} shouldItClose={false} func={goBack}/>
    </div>
  )
}

export default Registration