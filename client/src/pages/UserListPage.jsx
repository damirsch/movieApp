import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import Preanimation from '../components/animation/Preanimation'
import DefaultWrapper from '../components/wrappers/DefaultWrapper'
import Navbar from '../components/navbars/Navbar'
import NavbarMobile from '../components/navbars/NavbarMobile'
import Profile from './ProfilePage'
import './.css'

const UserList = ({ isMobile }) => {
  const [loaded, setLoaded] = useState(false)
  const [users, setUsers] = useState()
  const {store} = useContext(Context)

  const url = 'http://localhost:5000/static/'
  
  useEffect(() => {
    if(store.isAuth){
      (async () => {
        await store.getUsers()
        setUsers(store.users)
        setLoaded(true)
      })()
    }
  }, [])
  
  if(!store.isAuth){
    return <Profile/>
  }

  if(!loaded){
    return <Preanimation/>
  }else if(loaded && !isMobile){
    return(
      <div>
        <Navbar/>
        <DefaultWrapper>
          <div className='user-list'>
            {users.map((i, index) => 
              <div key={i._id}>
                <div className='user-list__link' onClick={() => window.location.href=`/user/${i.username}`}>
                  <div className='user-list__img' style={{backgroundImage: `url(${url + i.picture})`}}>

                  </div>
                  {index + 1}.{' '}
                  {i.username}
                  {store.user.username === i.username ? 
                    <span style={{color: 'blue'}}> (Вы)</span>
                    : ''
                  }
                </div>
              </div>
            )}
          </div>
        </DefaultWrapper>
      </div>
    )
  }else if(loaded && isMobile){
    return <NavbarMobile/>
  }
  return <Preanimation/>
}

export default UserList