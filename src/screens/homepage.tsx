import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import {
  View,
  ScrollView,
  Button,
  VStack,
  Input
} from 'native-base'
import { GiftedChat } from 'react-native-gifted-chat'
import { auth,db } from '../../firebase';
;
import Header from '../components/header'

const HomeScreen = (props: { navigation: { navigate: any; }; }) => {
  const { navigate } = props.navigation;
  const [message, setMessage] = useState([])
  const [friendList, setFriendList] = useState([])

  //search user in user Firestore
  const searchUser = (text: string) => {
    db.collection('users').where('name', '==', text).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setFriendList(doc.data().name)
          console.log(doc.data().name)
      })
    })
  }

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
      <Input 
        placeholder="Add Friend"
        onChangeText={(text) => searchUser(text)}
      />
      {/* <ScrollView>
        <VStack space={4} alignItems="center">
          {friendList.map((friend: any) => (
            <Button
              key={friend}
              onPress={() => navigate('Chat', { name: friend })}
            >
              {friend}
            </Button>
          ))}
        </VStack>
      </ScrollView> */}
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
