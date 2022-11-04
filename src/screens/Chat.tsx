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


function Chat (props:{userId:string,name:string, email:string, photoURL:string,navigation:any}) {
  const {userId, name, email, photoURL} = props.route.params;
  const [message, setMessage] = useState([])  //loadmessage from firebase specific to user 

  const [chatName, setChatName] = useState('') //load chat name from firebase specific to userId
  
  const [channel, setChannel] = useState([]) //load subroom from firebase

  const member = [auth.currentUser?.uid, userId];
  const chatId = member.sort().join('_');
 
  useEffect(() => {
        db.collection('Chatroom').doc(chatId).collection('subChannel').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setChannel(channel => [...channel, doc.data()])
        console.log('channel',channel)
      });
    }).catch((error) => {
      console.log("error getting documents: ", error);
    })
  }, [])
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

  const createSubChannel =()=>{
    //subchannelID generate
    const subChannelId = Math.random().toString(36).substring(7);
    //subchannel is a collection of chatId
    //if subChannel exist no create subChannel 
    if(chatName){
      db.collection('Chatroom').doc(chatId).collection('subChannel').where('chatName','==',chatName).get().then((querySnapshot) => {
        if(querySnapshot.empty){
          db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subChannelId).set({
            channelId: subChannelId,
            chatName: chatName,
            createdAt: new Date(),
            member: member,
          }).then(() => {
              alert('subchannel created')
            }).catch((error) => {
              console.log("error getting documents: ", error);
            })
        }else{
          alert('subChannel exist')
        }}).catch((error) => {
          console.log("error getting documents: ", error);
        })
      }else{
        alert('please enter chat name')
      }
  }

  const loadSubChannel =()=>{
    db.collection('Chatroom').doc(chatId).collection('subChannel').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().chatName);
        setChannel(channel => [...channel, doc.data().chatName])
        console.log('channel',channel)
      });
    }).catch((error) => {
      console.log("error getting documents: ", error);
    })
  }

  const onSend = useCallback((messages = []) => {
    setMessage(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt, 
      text, 
      user 
    } = messages[0]
    db.collection('Chatroom').doc(chatId).collection('messages').add({
      _id: _id,
      createdAt,
      text,
      user,
    })
  }, [])
  return (
    <>
      <ChatHeader {...props}/>
      <ScrollView>
        <VStack space={4} alignItems="center">
          {channel.map((item, index) => (
            <Button
              key={index}
              onPress={() => props.navigation.navigate('SubChannel', {
                subId:item.channelId ,
                chatId: chatId, 
                chatName: item.chatName,
                userId: userId,
                name: name,
                email: email,
                photoURL: photoURL,
                })}
              variant="outline"
              colorScheme="primary"
              size="lg"
              width="90%"
              my={2}
              >
              {item.chatName}
            </Button>
          ))}
          </VStack>
        </ScrollView>
      <Button onPress={loadSubChannel}>SubChannel Data</Button>
      <Input onChangeText={(text)=>setChatName(text)} placeholder="Enter Chat Name" />
      <Button onPress={createSubChannel}>Create SubChannel</Button>
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
export default Chat;
