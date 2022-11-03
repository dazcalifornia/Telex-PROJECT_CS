import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'

import Header from '../components/header'
import ChatList from '../components/chatList'

const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  return(
    <>
      <Header {...props}/>
      <ChatList {...props}/>
   </>
 )
}
export default HomeScreen
