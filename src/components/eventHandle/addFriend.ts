import React from 'react';

import { auth, db } from '../../../firebase';


const addFriends = (props: { friendID: string }) => {
  //recieve friendID from props
  const { friendID } = props;
  console.log('friendID', friendID);
  console.log(friendID);
  if (friendID == '') {
    alert('Please enter friend ID')
  } else {
    auth?.currentUser?.updateProfile({
      friends: "",
    }).then(function () {
      const currentUser = auth?.currentUser?.uid; //get current user ID
      console.log('currentUser', currentUser)
      if (currentUser !== friendID) {
        db.collection('users').where('username', '==', friendID).get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            alert('User not found')
          } else {
            //if user add user it self then alert error
            querySnapshot.forEach((doc) => {
              if (doc.data().uid == currentUser) {
                alert('You cannot add yourself')
              } else {
                console.log("target", doc.data().uid)
                const friendUID = doc.data().uid;
                db.collection('users').doc(friendUID).get().then((doc) => {
                  //if current user is in friendRequest Object then alert error
                  let fetchRequestor = Object.keys(doc.data()?.friendRequest)
                  if (fetchRequestor?.includes(currentUser)) {
                    alert('You already send request')
                  } else {
                    db.collection('users').doc(friendUID).update({
                      ['friendRequest.' + currentUser]: false,
                    }).then(function () {
                      alert('Friend request sent')
                    }).catch(function (error) {
                      console.error('Error writing document: ', error);
                    })
                  }
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
