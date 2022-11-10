import firebase from 'firebase/compat/app'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


import'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


firebase.initializeApp({
  apiKey: "AIzaSyAYyT1TGU0mp3kq3U8E03JyB1_wQJ5o9K4",
  authDomain: "telex-64ba9.firebaseapp.com",
  projectId: "telex-64ba9",
  storageBucket: "telex-64ba9.appspot.com",
  messagingSenderId: "235296750085",
  appId: "1:235296750085:web:e409ac1c0de0314e927a6c",
  measurementId: "G-PJ3DGLKW52"
})

let app ;
if( firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig)
}else{
  app = firebase.app()
}


const auth = app.auth()
const db = app.firestore()
const storage = app.storage()

export { storage, auth, db };

