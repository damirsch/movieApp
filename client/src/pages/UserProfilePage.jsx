import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../index'
import Preanimation from '../components/animation/Preanimation'
import DefaultWrapper from '../components/wrappers/DefaultWrapper'
import Navbar from '../components/navbars/Navbar'
import NavbarMobile from '../components/navbars/NavbarMobile'
import account from '../components/img/account.svg'
import NotFound from '../components/notFound/NotFound'
import axios from 'axios'

const UserProfile = ({ isMobile }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [picture, setPicture] = useState('')
  const [error, setError] = useState()

  const url = 'http://localhost:5000/static/'
  
  const username = window.location.pathname.split('/', -1)[2]
  const {store} = useContext(Context)

  useEffect(() => {
    (async () => {
      try{
        const response = await store.getUser(username)
        setData(response)
        setLoading(false)
      }catch(e){
        setError(e)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if(data){
        try{
          const picture = await store.getUserPicture(data.username)
          if(picture) await axios.get(url + picture)
          setPicture(picture)
        }catch(e){
          setPicture(null)
        }
      }
    })()
  }, [data])

  if(error){
    return <NotFound/>
  }
  if(loading){
    return <Preanimation/>
  }else if(!loading && !isMobile){
    return(
      <div>
        <Navbar/>
        <DefaultWrapper>
          <div style={{display: 'flex'}}>
            <div 
              className='account__img'
              style={{backgroundImage: `url(${picture ? url + picture : account})`}}
            >
            </div>
            <div className='user'>
              Имя: {data.username}
              <br/>
              Почта: {data.email}
            </div>
          </div>
        </DefaultWrapper>
      </div>
    )
  }else if(!loading && isMobile){
    return(
      <div className='content-mobile'>
        <NavbarMobile/>
      </div>
    )
  }
}

export default UserProfile