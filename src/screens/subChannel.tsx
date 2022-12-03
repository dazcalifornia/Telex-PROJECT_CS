import React, { useState, useEffect, useLayoutEffect,useCallback } from 'react';
import {auth, db} from '../../firebase';

import {
    Button,
  Text,

} from 'native-base';

import { 
  GiftedChat,
  InputToolbar,
  RenderMessageImageProps,
  Actions,
} from 'react-native-gifted-chat';

import ChatHeader from '../components/chatHeader';


function SubChatrooms (props:any) {
  const {subId, chatId, chatName } = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 
  // const [chatData, setChatData] = useState("")
  

  // console.log('ChatNaME', chatName)

  // useEffect(() => {
  //   db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subId).get().then((doc) => {
  //     console.log('subChannel', doc.data()?.chatName)
  //     if (doc.exists) {
  //       setChatData(doc.data()?.chatName)
  //       console.log("1 Document data:", chatData);
  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("1 No such document!");
  //     }
  //   })
    
  // }, [chatData])

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
      address: chatName,
      text,
      user,
      delivered: false,
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

  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginBottom: 0,
        }}
        icon={() => (
          <Icon
            as={<Entypo name="plus" />}
            size="sm"
            color="muted.400"
          />
        )}
        options={{
          'Choose From Library': () => {
            console.log('Choose From Library')
          },
          'Take Picture': () => {
            console.log('Take Picture')
          },
          'Send Location': () => {
            console.log('Send Location')
          },

          Cancel: () => {
            console.log('Cancel')
          },
        }}
        optionTintColor="#222B45"
      />

    )
  }


  const customInputToolbar = (props:any) => {
    return(
      
      <InputToolbar
        {...props}
        renderActions={() => renderActions(props)}
        //renderComposer={() => renderComposer(props)}
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
    <>
      <ChatHeader chatId={chatId} subId={subId} navigation={props.navigation} route={props.route}/>
      <Button
        onPress={() => console.log('chatData', chatData)}
      >bruh</Button>
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
        //
      }
      />
    </>
  );
}
export default SubChatrooms;
