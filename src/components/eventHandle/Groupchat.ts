import React,{
  useEffect,
  useState,

} from "react";

import { auth, db } from '../../../firebase';

import firebase from 'firebase/compat/app';

const Groupchat = () => {

}


const CreateGroup = (props:{name:string,category:string}) => {
  const {name,category} = props;
  
  //groupId generated
  const groupId =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
  if(name){
    console.log(`createGroup Progress ${name}`)
    db.collection('group').doc(groupId).set({
      groupId: groupId,
      name: name,
      category: category,
      members: [auth?.currentUser?.uid],
      createdAt: new Date(),
      groupOwner: auth?.currentUser?.uid,

    }).then(function () {
      console.log('Document written with ID: ', groupId);
    }).catch(function (error) {
      console.error('Error adding document: ', error);
    });
  }else{
    console.log('no name')
  }
}

const addMember = (props:{groupId:string,username:string}) => {
  const {groupId,username} = props;
  db.collection('users').where('username', '==', username).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      db.collection('users').doc(doc.id).update({
        ['groupInvitation.' + groupId]: false,
      })
    })
  })
}
const removeMember = (props:{groupId:string,username:string}) => {
  const {groupId,username} = props;
  db.collection('users').where('username', '==', username).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      db.collection('group').doc(groupId).update({
        members: firebase.firestore.FieldValue.arrayRemove(doc.id)
      })
    })
  })
}

const deleteGroup = (props:{groupId:string}) => {
  const {groupId} = props;
  db.collection('group').doc(groupId).delete().then(function () {
    console.log('Document successfully deleted!');
  }).catch(function (error) {
    console.error('Error removing document: ', error);
  });
}

const leaveGroup = (props:{groupId:string}) => {
  const {groupId} = props;
  if(auth?.currentUser?.uid){
    db.collection('group').doc(groupId).get().then((doc) => {
      if(doc.exists){
        if(doc.data()?.groupOwner === auth?.currentUser?.uid){
          console.log('group owner cannot leave')
        }else{
          db.collection('group').doc(groupId).update({
            members: firebase.firestore.FieldValue.arrayRemove(auth?.currentUser?.uid)
          })
        }
      }
    })
  }
}


export {Groupchat,CreateGroup,addMember,removeMember,deleteGroup,leaveGroup}
