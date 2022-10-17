import React, { useCallback, useEffect, useMemo } from 'react'
import {
  View,
  ScrollView,
  Button,
  VStack
} from 'native-base'
import ThemeToggle from '../components/ThemeToggle';



import Header from '../components/header'
import ChatList from '../components/chatList'
const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  const { navigate } = props.navigation;


  return (
    <>
      <Header />
      <ScrollView>
        <ChatList />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <VStack space={4} alignItems="center">
            <Button
              colorScheme="primary"
              onPress={() => {
                console.log('Navigate to login')
                navigate('Login')
              }}>
              Login Screen
            </Button>
            <Button
              variant={"subtle"}
              colorScheme="primary"
              onPress={() => {
                navigate('MessageTest')
                console.log('Navigate to messageTest')
              }}>MessageTest</Button>

            <ThemeToggle />
          </VStack>
        </View>
      </ScrollView>
    </>
  )
}



export default HomeScreen
