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

function Chat (props:{name:string, email:string, photoURL:string,navigation:any}) {
  const {name, email, photoURL} = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 

  useLayoutEffect(() => {
    const loadChat = db.collection('message').orderBy('createdAt', 'desc').onSnapshot(snapshot => (
      setMessage(snapshot.docs.map(doc => ({
        _id: doc.data()._id,    
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      })))
    ))
    return loadChat;
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
      _id: _id,
      createdAt,
      text,
      user
      })
  }, [])

  return (
    <>
      <ChatHeader {...props}/>
      <Text>{auth?.currentUser?.uid}</Text>
      <GiftedChat
          messages={message}
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
