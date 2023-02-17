import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login1 from '../../components/authorization/Login'
import './.css'

const Login = () => {
  const [active, setActive] = useState(true)
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  return(
    <div className='background'>
      <Login1 active={active} setActive={setActive} shouldItClose={false} func={goBack}/>
    </div>
  )
}

export default Login