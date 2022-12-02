import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';
import {auth, db} from '../../firebase';

import {
    Button,
  Text,

} from 'native-base';

import { GiftedChat } from 'react-native-gifted-chat';
import ChatHeader from '../components/chatHeader';


function SubChatrooms (props:any) {
  const {subId, chatId, chatName } = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 
  console.info('all props', props)
  const [chatData, setChatData] = useState('')
  
  const handleChatData = async() => {
    
  }
  useEffect(() => {
    if(chatData === ''){
    db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subId).get().then((doc) => {
      if (doc.exists) {
        setChatData(doc.data()?.chatName)
        console.log("Document data:", chatData);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    }
  }, [chatData])

  console.log('SubChatrooms props', subId)
  console.log('ChatData', chatData)

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
    if(chatData !== ''){
    db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subId).collection('messages').add({
      _id: _id,
      createdAt: createdAt,
      address: chatData,
      text: text,
      user: user,
    })
    }else{
      alert('Please wait for the chat to load')
    }
  }, [])
  return (
    <>
      <ChatHeader chatId={chatId} subId={subId} navigation={props.navigation} route={props.route}/>
      <Button
        onPress={() => console.log('ChatData', chatData)}
      >bruh</Button>
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
