import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'

import Header from '../components/header'
import ChatList from '../components/chatList'
import {
  View,
  } from 'native-base';
import {LinearGradient} from 'expo-linear-gradient';
const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  return(
    <View
      flex={1}>
      <LinearGradient
        // Background LinearGradient
        colors={['#076585', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 1000,
        }}

      />
      <Header {...props}/>
      <ChatList {...props}/>
   </View>
 )
}
export default HomeScreen
