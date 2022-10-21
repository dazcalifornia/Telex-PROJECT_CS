import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import {
  Input
} from 'native-base'
import { db } from '../../firebase';
;
import Header from '../components/header'
import ChatList from '../components/chatList';

const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  const [message, setMessage] = useState([])

  const [friendList, setFriendList] = useState([])

  //search user in user Firestore
  const searchUser = (text: string) => {
    db.collection('users').where('username', '==', text).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setFriendList(doc.data().name)
          console.log(friendList)
      })
    })
  }
  return(
    <>
      <Header {...props}/>
      <Input 
        placeholder="Add Friend"
        onChangeText={(text) => searchUser(text)}
      />
      <ChatList {...props}/>

   </>
 )
}
export default HomeScreen
