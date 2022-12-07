import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';
import {auth, db} from '../../firebase';

import {
  Button,
  Text,
  Icon
} from 'native-base';

import { 
  GiftedChat,
  InputToolbar,
  RenderMessageImageProps,
  Actions,
} from 'react-native-gifted-chat';

import ChatHeader from '../components/chatHeader';
import {Entypo} from '@expo/vector-icons';
import {
  renderInputToolbar,
  renderActions,
  renderComposer,
  renderSend,
} from '../components/eventHandle/inputTools';
function SubChatrooms (props:any) {
  const {subId, chatId, chatName } = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 


  useLayoutEffect(() => {
    console.log('channel',subId)
    const loadSubChat = db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subId).collection('messages')
    .orderBy('createdAt', 'desc').onSnapshot(snapshot => (
        setMessage(snapshot.docs.map(doc => ({
        _id: doc.data()._id,    
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        image: doc.data().image,
        sent: doc.data().sent,
        received: doc.data().received,
        video: doc.data().video,
        user: doc.data().user,
      })))
    ))
    return loadSubChat;
  }, [])

  const onSend = useCallback((messages = []) => {
    console.log('chatName:', chatData)
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
        address: "Regular",
        text,
        user,
        sent: true,
        received: false,
    })
  }, [])
  return (
    <>
      <ChatHeader chatId={chatId} subId={subId} navigation={props.navigation} route={props.route}/>
      
      <GiftedChat
        isTyping={true}
        isAnimated={true}
        messages={message}
        showUserAvatar={true}
      alignTop
      alwaysShowSend
      scrollToBottom
      // showUserAvatar
      renderAvatarOnTop
      renderUsernameOnMessage
      bottomOffset={26}
      onPressAvatar={console.log}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
   
      isCustomViewBottom
      messagesContainerStyle={{ backgroundColor: 'indigo' }}
      parsePatterns={(linkStyle) => [
        {
          pattern: /#(\w+)/,
          style: linkStyle,
          onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
        },
      ]}
      onSend={message}

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
