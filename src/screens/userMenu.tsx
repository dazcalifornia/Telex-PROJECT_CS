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
  Container,
} from 'native-base';
import firebase from 'firebase/compat/app';

import BottomSheet from '@gorhom/bottom-sheet';

import {storage,auth,db} from '../../firebase';
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
          db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
                //if username field is empty then update username 
                
                if(doc.data()?.username === ''){
                  db.collection('users').doc(auth.currentUser?.uid).update({
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
  const [image,setImage] = useState('');
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log('image',result.uri)
      console.log('imageName',result.uri.split('/').pop())

      const source = {uri: result.uri};
      setImage(source);
      uploadImage()
    }
  };

//handle upload Image
  const uploadImage = async () => {
    //upload image to firebase storage
    //get download photoURL from firebase storage
    //update user profile with photoURL from firebase storage
    //update user profile in database with photoURL from firebase storage
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`images/${auth.currentUser?.uid}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log('downloadURL',downloadURL)
    auth?.currentUser?.updateProfile({
      photoURL: downloadURL,
    }).then(function() {
      db.collection('users').doc(auth.currentUser.uid).update({
        imageURL: downloadURL,
        }).then(()=>{
          alert('image updated')
           setImage('');
            console.log('image value:',image)
        })
    }).catch(function(error) {
      console.log(error)
    });
  };

let requestor ;

  const subscribeFriendRequest = () => {
    //if not have friend request then show no friend request 
    //if have friend request then show friend request 
    //
    db.collection('users').where('uid','==',auth.currentUser?.uid).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc) => {
        console.log('friendRequest',doc.data().friendRequest)
        let loadData = doc.data().friendRequest
        const keyData = Object.keys(loadData);//uid
        const valueData = Object.values(loadData);//state 
        requestor = keyData
        room(keyData)
        console.log('localFrienRequest',FriendRequest)
        })
      }).then(function() {
        db.collection('users').where('uid','==',requestor).get().then((querySnapshot)=>{ 
          querySnapshot.forEach((doc) => {
            console.log('Requestor:', doc.data().username)
            setFriendRequest(doc.data().username)
            })
          })
      }).catch(function(error) {
        console.log("Error getting documents: ", error);
      })
  }

  const room = (senderId) => {
    db.collection('users').where('uid','==',senderId).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc) => {
        console.log('senderName',doc.data().username)
        alert('you have friend request from '+doc.data().username)
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
                  const currentUserUsername = doc.data()?.username 
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

  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      props.navigation.replace("Login");
    }).catch((error) => {
        // An error happened.
        console.log(error);
      });
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
          <Container style={{marginTop: 20, marginLeft: 20}}>
          <Heading style={{marginTop: 20, marginLeft: 20}}>
            Friend Requests
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
            <ScrollView>
              {FriendRequest.map((item, index) => {
                return (
                  <HStack space={2} alignItems="center" justifyContent="space-between" alignContent="center">
                    <Text style={{marginTop: 20, marginLeft: 20}}>
                      {item}
                    </Text>
                    <IconButton
                      icon={<Icon as={Entypo} name="check" size="sm" />}
                      style={{marginTop: 20, marginRight: 20}}
                      colorScheme="success"
                      onPress={() => {
                        acceptFriendHandle(item)
                      }}/>
                    <IconButton
                      icon={<Icon as={Entypo} name="cross" size="sm" />}
                      style={{marginTop: 20, marginRight: 20}}
                      colorScheme="danger"
                      onPress={() => {
                        rejectFriendHandle(item)
                      }}/>
                  </HStack>
                )
              })}
            </ScrollView>
        </Box>
        </Container>
        </VStack>



        <View style={{
        height:'50%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        }}>
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
        </View>
    </View>
  )
}


export default UserMenu
