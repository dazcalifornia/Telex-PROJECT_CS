import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';
import {auth, db} from '../../firebase';

import {
  View
} from 'native-base';

import { 
  GiftedChat,
  InputToolbar,
  RenderMessageImage,

  } from 'react-native-gifted-chat';
import ChatHeader from '../components/chatHeader';


function Chat (props:{userId:string,name:string, email:string, photoURL:string,navigation:any}) {

  const {userId, name, email, photoURL} = props.route.params;

  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 

  const [channel, setChannel] = useState([]) //load subroom from firebase

  const [chatName, setChatName] = useState('') //load chat name from firebase specific to userId
  const member = [auth.currentUser?.uid, userId];

  const chatId = member.sort().join('_');
 
  useLayoutEffect(() => {
    const loadChat = db.collection('Chatroom').doc(chatId).collection('messages')
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

  const onSend = useCallback((messages = []) => {
    setMessage(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt, 
      text, 
      user 
    } = messages[0]
    const docId = Math.random().toString(36).substring(7);
    db.collection('Chatroom').doc(chatId).set({
      chatId: chatId,
      member: member,
      chatName: "Regular",
      recentMessage: {
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: user
      }
    }).then(() => {
      db.collection('Chatroom').doc(chatId).collection('messages').add({
        _id: _id,
        createdAt,
        address: chatId,
        text,
        user,
        delivered: false,
      })
    })
  }, [])

  //render image in chat 
  const renderCustomView = (props) => {
    return (
      <RenderMessageImage
        {...props}
        imageStyle={{
          width: 150,
          height: 150,
          borderRadius: 13,
          margin: 3,
        }}
      />
    )
  }


  const customInputToolbar = (props:any) => {
    return(
      <InputToolbar
        {...props}
        containerStyle={{
          //make it blur and adjust it to center screen
          //text white
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'white',
          marginHorizontal: 10,

        
          borderTopWidth: 0,
          borderBottomWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        />
    )
  }

  return (
    <View style={{flex:1, backgroundColor:'#1D1E24'}}>
      <ChatHeader chatId={chatId} navigation={props.navigation} route={props.route}/>
     
      <GiftedChat
        isTyping={true}
        isAnimated={true}
        messages={message}
        showUserAvatar={true}
        renderInputToolbar={props => customInputToolbar(props)}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth?.currentUser?.uid,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL
        }
      }
      />
    </View>
  );
}
export default Chat;
