import React,{
  useEffect,
  useState,

} from "react";

import { auth, db } from '../../../firebase';


const Groupchat = (props:{userId:string}) => {
  const {userId} = props;
  const [groupchat, setGroupchat] = useState([]);
  db.collection('group').where('members', 'array-contains', userId).onSnapshot((snapshot) => {
    setGroupchat(snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data()
    })))
  })

  return groupchat
}


const CreateGroup = (props:{name:string,category:string}) => {
  const {name,category} = props;
  if(name){
    console.log(`createGroup Progress ${name}`)
    db.collection('group').add({
      name: name,
      category: category,
      members: [auth?.currentUser?.uid],
      createdAt: new Date(),
      groupOwner: auth?.currentUser?.uid,

    }).then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }else{
    console.log('no name')
  }
}
export {Groupchat,CreateGroup};
