import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';

import {auth, db} from '../../firebase';

import {
  Text,
  HStack,
  Input,
  Button,
} from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import ChatHeader from '../components/chatHeader';

function Chat (props:{userId:string,name:string, email:string, photoURL:string,navigation:any}) {
  const {userId, name, email, photoURL} = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 
  
  const member = [auth.currentUser?.uid, userId];
  const chatId = member.sort().join('_');

  useLayoutEffect(() => {
    const loadChat = db.collection('message').doc(chatId).collection('messages')
    .orderBy('createdAt', 'desc').onSnapshot(snapshot => (
        setMessage(snapshot.docs.map(doc => ({
        _id: doc.data()._id,    
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      })))
    ))
    return loadChat;
  }, [])
 

  //create chatRooms in firebase
  const createChatRoom = useCallback(() => {
    db.collection('chatRooms').doc(chatId).set({
      member: member,
      chatId: chatId,
    })
  }, [chatId, member])

  const onSend = useCallback((messages = []) => {
    setMessage(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt, 
      text, 
      user 
    } = messages[0]
      db.collection('message').doc(chatId).collection('messages').add({
        _id: _id,
        createdAt,
        text,
        user,
      })
  }, [])


  return (
    <>
      <ChatHeader {...props}/>
      <Text>Target UID:{userId}</Text>
      <Text>{auth?.currentUser?.uid}</Text>
      <Button onPress={createChatRoom}>add collection</Button>
      <GiftedChat
          messages={message}
          showUserAvatar={true}
          onSend={messages => onSend(messages)}
          user={{
            _id: auth?.currentUser?.uid,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL
          }}
        />
    </>
  );
}
export default Chat;
