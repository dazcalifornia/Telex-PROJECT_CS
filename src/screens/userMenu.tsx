import React,{
  useState,
  useEffect,
} from 'react';
import{
  View,
  Text,
  Input,
  Button,
} from 'native-base';
//import firebase from 'firebase/compat/app';

import {auth,db} from '../../firebase';

function UserMenu(props:{navigation:{navigate:any;};}) {
  const {replace} = props.navigation;
  const [name,setName] = useState('');
  const [friendID,setFriendID] = useState('');
  const [friendList,setFriendList] = useState([]);
  const setUsername = () => {
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
    console.log(name);
  }

  const addFriends = () => {
    if(friendID == ''){
      alert('Please enter friend ID')
    }else{
      db.collection('users').where('uid','==',auth?.currentUser?.uid).get('friends').then((doc) => {
        const friendListed = doc.data().friendListed
        console.log('friendListed',friendListed)
        if(friendListed.includes(friendID)){
          alert('This user is already your friend')
        }else{
      auth?.currentUser?.updateProfile({
      friends: {'friendID':friendID},
    }).then(function() {
      db.collection('users').doc(auth?.currentUser?.uid).update({
        ['friends.'+friendID]: false,
        //friends: firebase.firestore.FieldValue.arrayUnion(friendID),
      })
      replace('Home');
    })
    .catch((error) => {
      // An error occurred
      alert(error.message);
    });
      alert('Friend added')
    console.log(friendID);
  
        
        }
      })
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
