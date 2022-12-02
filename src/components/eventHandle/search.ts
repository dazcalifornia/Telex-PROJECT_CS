import React,{
    useState,
    useEffect
} from 'react';
import { auth, db } from '../../../firebase';
  
import firebase from 'firebase/compat/app';
  

const Search = (keyword:string,chatId:string) => {
    const [messages, setMessages] = useState<any>([]);
    db.collection('Chatroom').doc(chatId).collection('messages').where('message','==',keyword).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        setMessages(doc.data());
      })
    })
    console.log(messages);
}

const searchInSubCollection = (keyword:string,chatId:string) => {
  db.collection('Chatroom').doc(chatId).collection('subChannel').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      db.collection('Chatroom').doc(chatId).collection('subChannel').doc(doc.id).collection('messages').where('message','==',keyword).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          setMessages(doc.data());
          console.log(doc.data());
        })
      })
    })
  })
  console.log(messages);
}
//rework this shit
//->get propmt to search in subchannel or main channel 
//->get prompt to search in all subchannel or specific subchannel 
//->get prompt to search in all chatroom or specific chatroom 




export {Search,searchInSubCollection};
