import React from 'react';
import DefaultWrapper from '../components/wrappers/DefaultWrapper';
import Navbar from '../components/navbars/Navbar';
import NavbarMobile from '../components/navbars/NavbarMobile';

const MainPage = ({ isMobile }) => {

  if(isMobile){
    return <NavbarMobile/>
  }
  return(
    <div>
      <Navbar/>
      <DefaultWrapper>
        
      </DefaultWrapper>
    </div>
  )
}

export default MainPage