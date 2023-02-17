import React, { useContext } from 'react'
import Navbar from '../components/navbars/Navbar'
import NavbarMobile from '../components/navbars/NavbarMobile'
import { Context } from '../index'
import Account from '../components/account/Account'
import DefaultWrapper from '../components/wrappers/DefaultWrapper'
import AccountMobile from '../components/account/AccountMobile'

const Profile = ({ isMobile }) => {
  const {store} = useContext(Context)
  const isAuth = store.isAuth
  const user = store.user

  async function logout() {
    await store.logout()
    window.location.reload()
  }
  
  if(isMobile && isAuth){
    return(
      <div className='content-mobile'>
        <NavbarMobile/>
        <div className='content-mobile__wrapper'>
          <AccountMobile username={user.username} email={user.email} logout={logout} store={store}/>
        </div>
      </div>
    )
  }else if(isAuth){
    return(
      <div>
        <Navbar/>
        <Account username={user.username} email={user.email} logout={logout} store={store}/>
      </div>
    )
  }else if(isMobile && !isAuth){
    return(
      <div className='content-mobile'>
        <NavbarMobile/>
        <div className='content-mobile__wrapper'>
          <div>
            <div style={{fontSize: '35px', marginBottom: '20px'}}>
              Вы не авторизованы
            </div>
            <div>
              <a className='account__link' href='./login'>Вход</a>
              <a className='account__link' href='./registration'>Регистрация</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return(
    <div>
      <Navbar/>
      <DefaultWrapper>
        <div>
          <div style={{fontSize: '30px', textAlign: 'center', width: '100%'}}>
            Вы не авторизованы
          </div>
          <div>
            <a href='/login' className='account__link'>Вход</a>
            <a href='/registration' className='account__link'>Регистрация</a>
          </div>
        </div>
      </DefaultWrapper>
    </div>
  )
}

export default Profile