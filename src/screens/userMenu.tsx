import React,{
  useState,
  useEffect,
} from 'react';
import{
  View,
  Text,
  Input,
  Button,
  VStack,
  ScrollView,
} from 'native-base';
import firebase from 'firebase/compat/app';

import {auth,db} from '../../firebase';

function UserMenu(props:{navigation:{navigate:any;};}) {
  const {replace} = props.navigation;
  const [name,setName] = useState('');
  const [friendID,setFriendID] = useState('');
  const [friendList,setFriendList] = useState([]);

  const [friendRequest,setFriendRequest] = useState([]);
  
  const setUsername = () => {
    if(name !== ''){
    auth.currentUser.updateProfile({
      username: "",
    }).then(function() {
      //if username is used by other user then alert error
        //if username is not used by other user then update username in database
        //then navigate to chatList
      db.collection('users').where('username','==',name).get().then((querySnapshot) => {
        if(querySnapshot.empty){
          db.collection('users').doc(auth?.currentUser?.uid).update({
            username: name,
          }).then(function() {
            replace('Home');
          })
        }else{
          alert('Username is already used by other user')
        }
      })
    }).catch(function(error) {
      console.log(error)
    });
    }else{
      alert('Please enter username')
    }
    console.log(name);
  }

 const addFriends = () => {
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
            querySnapshot.forEach((doc) => {
              console.log("bruh dang",doc.data().uid)
              const friendUID = doc.data().uid;
              db.collection('users').doc(friendUID).update({
                ['friendRequest.'+currentUser]:false,
              }).then(function() {
                alert('Friend request sent')
              })
            })
          }
        })
      }
      })
    .catch((error) => {
      // An error occurred
      alert(error.message);
    });
    }
  }
  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      props.navigation.replace("Login");
    }).catch((error) => {
        // An error happened.
        console.log(error);
        });
  }
  const subscribeFriendRequest = () => {
    //if not have friend request then show no friend request 
    //if have friend request then show friend request 
    //
    db.collection('users').where('uid','==',auth.currentUser?.uid).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc) => {
        console.log('friendRequest',doc.data().friendRequest)
        const friendRequest = doc.data().setFriendRequest
        setFriendRequest(friendRequest)
        console.log('localFriendRequest',friendRequest)
      })
    })
  }

useEffect(() =>{
  subscribeFriendRequest()
},[friendRequest])

  //return code
  return(
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}>
      <View style={{
        height:'50%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        }}>
        <Text>Settings</Text>
        <Button onPress={signOut}>Sign Out</Button>
        <Input 
          placeholder="Username" 
          variant="underlined"
          onChangeText={text => setName(text)}
          />
          <Text>{name}</Text>
        <Button onPress={setUsername}>Save</Button>
        <Input
          placeholder="Friend ID"
          variant="underlined"
          onChangeText={text => setFriendID(text)}
          />
          <Text>{friendID}</Text>
        <Button onPress={addFriends}>Add Friend</Button>
      </View>
    </View>
  )
}
export default UserMenu;
