import firebase from 'firebase/compat/app'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


import'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


firebase.initializeApp({

  apiKey: "AIzaSyCoV0riThLO1PY-9uMTaudpJUqKbRIwnbk",
  authDomain: "denji-b7f1f.firebaseapp.com",
  projectId: "denji-b7f1f",
  storageBucket: "denji-b7f1f.appspot.com",
  messagingSenderId: "646626369148",
  appId: "1:646626369148:web:642b3c0dc6d7f07e9533f9"


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

