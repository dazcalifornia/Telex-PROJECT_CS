import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';
import {auth, db} from '../../firebase';

import {
  Text,
  Box,
  Heading,
  ScrollView,
  VStack,
  Button,
  Image,
  Input,
  Select,
  CheckIcon,
} from 'native-base';

import { GiftedChat } from 'react-native-gifted-chat';
import ChatHeader from '../components/chatHeader';


function SubChatrooms (props:{subId:string,chatId:string,chatName:string, userId:string,name:string, email:string, photoURL:string,navigation:any}) {
  const {subId, chatId, chatName, userId, name, email, photoURL} = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 
  
  useLayoutEffect(() => {
    console.log('channel',subId)
    const loadSubChat = db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subId).collection('messages')
    .orderBy('createdAt', 'desc').onSnapshot(snapshot => (
        setMessage(snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      })))
    ))
    return loadSubChat;
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessage(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt, 
      text, 
      user 
    } = messages[0]
    db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subId).collection('messages').add({
      _id: _id,
      createdAt,
      text,
      user,
    })
  }, [])
  return (
    <>
      <ChatHeader {...props}/>
      <Text>you are in : {chatName}</Text>
      <GiftedChat
        isTyping={true}
        isAnimated={true}
        messages={message}
        showUserAvatar={true}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth?.currentUser?.uid,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL
        }
        //
      }
      />
    </>
  );
}
export default SubChatrooms;
