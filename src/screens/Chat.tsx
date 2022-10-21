import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';

import {auth, db} from '../../firebase';

import { 
  View,
  Text,
  Box,
  Heading,
  ScrollView, 
  HStack,
  Input,
  Button,
} from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import ChatHeader from '../components/chatHeader';
function Chat (props:{name:string, email:string, photoURL:string}) {
  const {name, email, photoURL} = props.route.params;
  const [message, setMessage] = useState([])

  //test data insert to firestore
  const [inputRef, setInputRef] = useState('');
  
  //hendle input
  const sentData=()=>{
    let chatroofRef = db.collection('Chatrooms');
    console.log(inputRef)
  }

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
      <HStack style={{width:100}}>
        <Input onChange={(input)=>setInputRef(input)} w='100%' type="text" placeholder="Add data" />
        <Button onPress={sentData}>Send</Button>
      </HStack>
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
