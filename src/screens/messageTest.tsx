import React,{useRef,useState} from 'react'
import {
    View,
} from 'native-base'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


firebase.initializeApp({
  //config
  apiKey: "AIzaSyAYyT1TGU0mp3kq3U8E03JyB1_wQJ5o9K4",
  authDomain: "telex-64ba9.firebaseapp.com",
  projectId: "telex-64ba9",
  storageBucket: "telex-64ba9.appspot.com",
  messagingSenderId: "235296750085",
  appId: "1:235296750085:web:e409ac1c0de0314e927a6c",
  measurementId: "G-PJ3DGLKW52"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

const MessageTest = () => {
  const [user] = useAuthState(auth)

  return (
    <View>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </View>
  )
}
const SignIn = () => {
  return (
    <View>
      <button onClick={() => auth.signInAnonymously()}>Sign in</button>
    </View>
  )
}
const ChatRoom = () => {
  return (
    <View>
    </View>
  )
}
export default MessageTest
