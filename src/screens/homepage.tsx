import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import {
  View,
  ScrollView,
  Button,
  VStack
} from 'native-base'
import { GiftedChat } from 'react-native-gifted-chat'
import { auth,db } from '../../firebase';
import ChatList from '../components/chatList';
import Header from '../components/header'

const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  const { navigate } = props.navigation;
  const [message, setMessage] = useState([])

  useLayoutEffect(() => {
    const unsubscribe = db.collection('messages').orderBy('createdAt', 'desc').onSnapshot(snapshot => (
      setMessage(snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      })))
    ))
    return unsubscribe;
  }, [])
 
  const onSend = useCallback((messages = []) => {
    setMessage(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id, 
      createdAt, 
      text, 
      user 
    } = messages[0]
    db.collection('messages').add({
      _id,
      createdAt,
      text,
      user
      })
  }, [])

  return (
    <>
      <Header {...props}/>
      <ChatList {...props}/>
      <GiftedChat
        messages={message}
        showAvatarForEveryMessage={true}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser?.email,
          name: auth.currentUser?.displayName,
          avatar: auth.currentUser?.photoURL,

        }}
      />
    </>
 )
}
export default HomeScreen
