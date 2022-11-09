import React,{
  useState,
  useEffect,

  useRef,
  useMemo,
  useCallback,
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
  Pressable,
} from 'native-base';
import firebase from 'firebase/compat/app';

import BottomSheet from '@gorhom/bottom-sheet';

import {auth,db} from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import {Entypo} from '@expo/vector-icons';

function UserMenu(props:{navigation:{navigate:any;};}) {
  const {replace,navigate,goBack,dispatch} = props.navigation;
  const [name,setName] = useState('');

  const [bio,setBio] = useState('');
  
  const [currentUserUsername, setCurrentUserUsername] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [FriendRequest,setFriendRequest] = useState([]);

  useEffect(() =>{
    db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
      let data = doc.data();
      if(data?.username){
        console.log('username',data.username)
        setCurrentUserUsername(data.username)
      }
    })
    subscribeFriendRequest()
  },[])
  const setUsername = () => {
    if(name !== ''){
    auth?.currentUser?.updateProfile({
      username: "",
    }).then(function() {
      //if username is used by other user then alert error
        //if username is not used by other user then update username in database
        //then navigate to chatList
      db.collection('users').where('username','==',name).get().then((querySnapshot) => {
        if(querySnapshot.empty){
          db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
                //if username field is empty then update username 
                
                if(doc.data().username === ''){
                  db.collection('users').doc(auth.currentUser.uid).update({
                    username: name,
                  }).then(()=>{
                    goBack();
                    alert('username updated')
                  })
                }else{
                  alert('you already have username')
                }
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
      console.log('image',result.uri)

      uploadImage(result.uri)
    }
  };
const [isUploading, setIsUploading] = useState(false);
//handle upload Image
  const uploadImage = async (image) => {
    try{
      setIsUploading(true)
      console.log('status',isUploading)
      handleImage(image);

      //setImage({image: imgUrl});
    } catch(e){
      console.log(e);
    } finally{
      console.log('upload success')
      setIsUploading(false);
      
    }
  }

  const handleImage = async (image) => {
   //updateProfile photoURL in firebase
    const uploadUri = await uploadProfileImage(image.uri);
    console.log('uploadUri',uploadUri)
    auth.currentUser?.updateProfile({
      photoURL: uploadUri,
    }).then(function() {
      // Update successful.
        // update photoURL in database
        db.collection('users').doc(auth?.currentUser?.uid).update({
          imageURL: uploadUri,
        }).then(()=>{
          alert('image updated')
          setUserPhoto(uploadUri)
        }).catch((error) => {
          console.log(error)
        })
    }).catch(function(error) {
      // An error happened.
      console.log(error)

    });
  }

 async function uploadProfileImage(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = db.ref().child('images').child(auth.currentUser?.uid);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
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
  const resetPic = () => {
    auth.currentUser?.updateProfile({
      photoURL: 'https://cdn.discordapp.com/avatars/266199548093792256/565ebbf330d4da3dd0aeca783777052f.png?size=1024'
    })
  }

  

  //modal 
  const [modalVisible, setModalVisible] = useState(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return(
    <View
      style={{
        height: '90%',
        flex: 1,
        flexDirection: 'column',
      }}>
      <Button onPress={() => resetPic()} >reset</Button>
      <Box
       bg="base"
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          
        }}>
      <HStack space={2} alignItems="center" justifyContent="space-between">
        <Heading style={{
          color: 'white',
            marginTop: 20,
            marginLeft: 20
          }}>
          Setttings
        </Heading>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Sign-out</Modal.Header>
          <Modal.Body>
                <Text>Are you sure you want to sign-out?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button colorScheme="secondary" onPress={() => {
              signOut()
            }}>
                sure!
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
        <Button
          leftIcon={<Icon as={Entypo} name="log-out" size="sm" />}
          style={{marginTop: 20, marginRight: 20}}
          colorScheme="secondary"
          onPress={() => setModalVisible(true)}>
          Sign Out
        </Button>
      </HStack>
      <Pressable onPress={pickImage}>
        <Image
          source={{ uri: auth?.currentUser?.photoURL }} 
          rounded="full"
          alt="profile"
          style={{ width: 100, height: 100 }}
          justifyContent="center"
          alignSelf="center"
          marginTop={10}
        />
      </Pressable>
        </Box>
        <VStack
        style={{
          marginTop: 20,
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
        {
            currentUserUsername ? (
              <Text style={{marginTop: 20, marginLeft: 20}}>
                Username: {currentUserUsername}
              </Text>
            ):(
              <>
                <Input
                  style={{marginTop: 20, marginLeft: 20}}
                  placeholder="Username"
                  onChangeText={(text) => setName(text)}
                />
                <IconButton
                  icon={<Icon as={Entypo} name="edit" size="sm" />}
                  style={{marginTop: 20, marginRight: 20}}
                  colorScheme="success"
                  onPress={() => {
                    setUsername()
                  }}/>
              </>
            )
        }
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
        
        </View>
    </View>
  )
}


export default UserMenu
