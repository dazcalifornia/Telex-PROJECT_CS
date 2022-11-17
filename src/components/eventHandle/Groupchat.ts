import React,{
  useEffect,
  useState,

} from "react";

import { auth, db } from '../../../firebase';


const Groupchat = () => {
  const [groupchat, setGroupchat] = useState([]);
  useEffect(() => {
    db.collection('group').doc().get().then((doc) => {
      setGroupchat(doc.data()?.groupchat)
    })
      .catch((error) => {
      console.log("Error getting documents: ", error);
    })

  }, [])
  return groupchat
}


const CreateGroup = (props:{name:string}) => {
  const {name} = props;
  if(name){
    console.log(`createGroup Progress ${name}`)
    db.collection('group').add({
      name: name,
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
