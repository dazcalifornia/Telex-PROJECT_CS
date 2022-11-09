import React, {
  useEffect,
  useState,
} from 'react';

import {auth,db} from '../../../firebase';


const addFriends = (props:{friendID:string}) => {
  //recieve friendID from props
  const {friendID} = props;
  console.log (friendID);
    if(friendID == ''){
      alert('Please enter friend ID')
    }else{
      auth?.currentUser?.updateProfile({
      friends: "",
    }).then(function() {
      const currentUser = auth?.currentUser?.uid;
      console.log('currentUser',currentUser)
      if(currentUser !== friendID){ 
        db.collection('users').where('username','==',friendID).get().then((querySnapshot) => {
          if(querySnapshot.empty){
            alert('User not found')
          }else{
            //if user add user it self then alert error

            querySnapshot.forEach((doc) => {
              if(doc.data().uid == currentUser){
                alert('You cannot add yourself')
              }else{
                  console.log("bruh dang",doc.data().uid)
              const friendUID = doc.data().uid;
              db.collection('users').doc(friendUID).update({
                ['friendRequest.'+currentUser]:false,
              }).then(function() {
                alert('Friend request sent')
              })

              }
            })
          }
        })
      }
      })
    .catch((error) => {
      // An error occurred
      console.log(error)
      alert("Error adding document");
    });
    }
}
export default addFriends;
