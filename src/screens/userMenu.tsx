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
  HStack,
  Image,
  ScrollView,
  Heading,
  Icon,
  Box,
  IconButton,
  Modal,
} from 'native-base';
import firebase from 'firebase/compat/app';

import {auth,db} from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import {Entypo} from '@expo/vector-icons';

function UserMenu(props:{navigation:{navigate:any;};}) {
  const {replace,navigate} = props.navigation;
  const [name,setName] = useState('');
  const [friendID,setFriendID] = useState('');
  const [friendList,setFriendList] = useState([]);

  const [bio,setBio] = useState('');

  const [FriendRequest,setFriendRequest] = useState([]);
    useEffect(() =>{
    subscribeFriendRequest()
  },[])
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

  //pick image from gallery
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


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
        let loadData = doc.data().friendRequest
        const keyData = Object.keys(loadData);
        const valueData = Object.values(loadData);
        console.log("valueData",valueData)
        setFriendRequest(keyData)
        console.log('localFrienRequest',FriendRequest)
        })
      })
  }
  const acceptFriendHandle = (item:string) => {
    db.collection('users').doc(auth.currentUser?.uid).update({
      ['friendRequest.'+item]:true,
    }).then(function() {
        //get username of friends
        db.collection('users').where('uid','==',item).get().then((querySnapshot)=>{
          querySnapshot.forEach((doc)=>{
            const friendUsername = doc.data().username
            db.collection('users').doc(auth.currentUser?.uid).update({
              friends: firebase.firestore.FieldValue.arrayUnion(friendUsername),
            }).then(function() {
                db.collection('users').doc(auth?.currentUser?.uid).get().then((doc)=>{
                  const currentUserUsername = doc.data().username 
                  db.collection('users').doc(item).update({
                    friends: firebase.firestore.FieldValue.arrayUnion(currentUserUsername),
                  }).then(function() {
                      db.collection('users').doc(auth?.currentUser?.uid).update({
                        ['friendRequest.'+item]:firebase.firestore.FieldValue.delete(),
                      }).then(function() {
                          alert('Friend request accepted')
                          replace('Home')
                        })
                    })
                })
              })
          })
        })
      })
  }
  const rejectFriendHandle = (item:string) => {
     db.collection('users').doc(auth?.currentUser?.uid).update({
      ['friendRequest.'+item]:firebase.firestore.FieldValue.delete(),
    }).then(function() {
          alert('Friend request rejected')
          replace('Home')
      })
  }



  return(
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <Box
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
      <HStack space={2} alignItems="center" justifyContent="space-between">
        <Heading style={{marginTop: 20, marginLeft: 20}}>
          Setttings
        </Heading>
        <Button
          leftIcon={<Icon as={Entypo} name="log-out" size="sm" />}
          style={{marginTop: 20, marginRight: 20}}
          colorScheme="secondary"
          onPress={() => navigate('logout')}>
          Sign Out
        </Button>
      </HStack>
      <Image source={{ uri: auth?.currentUser?.photoURL }} 
          rounded="full"
          alt="profile"
          style={{ width: 100, height: 100 }}
          justifyContent="center"
          alignSelf="center"
          marginTop={10}
        />
        </Box>
        <VStack
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <Heading style={{marginTop: 20, marginLeft: 20}}>
          Edit Profile
        </Heading>
        <Box
          style={{
            width: '80%',
            flex: 2,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingLeft: 20,
          }}
        >
        <HStack space={2} alignItems="center" justifyContent="space-between" alignContent="center">
        <Input
          size="sm"
          style={{marginTop: 20, marginLeft: 20, marginRight: 20}}
          placeholder="Username"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <IconButton
          variant="solid"
          icon={<Icon as={Entypo} name="edit" size="sm"/>}
          style={{marginTop: 20, marginRight: 20}}
          colorScheme="success"
          onPress={() => setUsername()}/>
        </HStack>
        <HStack space={2} alignItems="center" justifyContent="space-between" alignContent="center">
        <Input
          size="sm"
          style={{marginTop: 20, marginLeft: 20, marginRight: 20}}
          placeholder="Bio"
          onChangeText={(text) => setBio(text)}
          value={bio}
        />
        <IconButton
          variant="solid"
          icon={<Icon as={Entypo} name="edit" size="sm"/>}
          style={{marginTop: 20, marginRight: 20}}
          colorScheme="success"
          onPress={() => console.log('setBio')}/>
        </HStack>
        </Box>
        </VStack>




        <View style={{
        height:'50%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        }}>
        <Text>Friend Request</Text>
        
        <ScrollView>
          {FriendRequest.map((item,index) => {
            return(
              <View key={index}>
              <HStack
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>{item}</Text>
                <Button 
                  colorScheme="success"
                  onPress={() => {acceptFriendHandle(item)}}
                >Accept</Button>
                <Button 
                  colorScheme="secondary"
                  onPress={() => { rejectFriendHandle(item)}}
                  >Decline</Button>
              </HStack>
              </View>
            )
          })}
        </ScrollView>
          <Button onPress={pickImage}>image Testing</Button>
        {image && <Image 
          source={{ uri: image }} 
          alt="just testing picture" 
          style={{ 
            width: 200, 
            height: 200 
          }} 
          />}
        </View>
    </View>
  )
}
export default UserMenu
