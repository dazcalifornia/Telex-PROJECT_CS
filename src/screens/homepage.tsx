import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'

import Header from '../components/header'
import ChatList from '../components/chatList'
import Menubar from '../components/menubar'

const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  return(
    <>
      <Header {...props}/>
      <Menubar {...props}/>
      <ChatList {...props}/>
   </>
 )
}
export default HomeScreen
