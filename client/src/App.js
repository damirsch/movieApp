import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import TopFilms from "./pages/TopFilmsPage";
import Film from "./components/films/Film";
import Sequels from "./pages/SequelsPage";
import { Context } from './index'
import Profile from "./pages/ProfilePage";
import Registration from "./pages/authPages/RegistrationPage";
import Login from "./pages/authPages/LoginPage";
import UserList from "./pages/UserListPage";
import UserProfile from "./pages/UserProfilePage";
import FoundFilms from "./pages/FoundFilmsPage";
import NotFound from "./components/notFound/NotFound";

function App(){
  const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobile = mobileDevices.test(navigator.userAgent)
  
  const [loaded, setLoaded] = useState(false)
  const {store} = useContext(Context)

  useEffect(() => {
    (async function(){
      if(localStorage.getItem('token')){
        await store.checkAuth()
      }
      setLoaded(true)
    })()
    setTimeout(() => {
      setLoaded(true)
    }, 10000)
  })

  if(!loaded){
    return(
      <div className="user-loading">
        <div className="user-loading__text">
          Загрузка данных о пользователе...
          <div className="user-loading__border"></div>
        </div>
      </div>
    )
  }

  return(
    <Router>
      <Routes>
        <Route path="/" element={<MainPage isMobile={isMobile}/>}></Route>
        <Route path="/profile" element={<Profile isMobile={isMobile}/>}></Route>
        <Route path="/users" element={<UserList isMobile={isMobile}/>}></Route>
        <Route path="/user/:username" element={<UserProfile isMobile={isMobile}/>}></Route>
        <Route path="/registration" element={<Registration isMobile={isMobile}/>}></Route>
        <Route path="/login" element={<Login isMobile={isMobile}/>}></Route>
        <Route path="/top250" element={<TopFilms isMobile={isMobile}/>}></Route>
        <Route path="/film/:userId" element={<Film isMobile={isMobile}/>}></Route>
        <Route path="/film/:userId/sequels-and-prequels" element={<Sequels isMobile={isMobile}/>}></Route>
        <Route path="/films/search/:key" element={<FoundFilms isMobile={isMobile}/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;