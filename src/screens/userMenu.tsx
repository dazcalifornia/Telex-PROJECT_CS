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
  Flex,
  FlatList,
} from 'native-base';
import firebase from 'firebase/compat/app';

import BottomSheet from '@gorhom/bottom-sheet';

import {storage,auth,db} from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import {Entypo} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

function UserMenu(props:{navigation:{navigate:any;};}) {
  //get name from props
  const {replace,navigate,goBack,dispatch} = props.navigation;
  const [name,setName] = useState('');

  const [displayname,setDisplayname] = useState('');
  
  const [currentUserUsername, setCurrentUserUsername] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [FriendRequest,setFriendRequest] = useState([]);

  useEffect(() =>{
    db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
      let data = doc.data();
      if(data?.username){
        console.log('username',data.username)
        setCurrentUserUsername(data.username)
        setUserPhoto(data.imageURL)
      }
    })
    console.log('userPhoto',userPhoto)

    //fix FriendRequest fix retrieve data from database >> then update to state >> then render to screen
  },[currentUserUsername,userPhoto])

  const bottomSheetRef = useRef<BottomSheet>(null);

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
//handle upload Image
  const uploadImage = async (uri) => {
    const imageUri  = uri;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      }
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      }
      xhr.responseType = 'blob';
      xhr.open('GET', imageUri, true);
      xhr.send(null);
    });
    const ref = storage.ref().child(`images/${auth.currentUser?.uid}`);
    const snapshot = await ref.put(blob);
    blob.close();
    const url = await snapshot.ref.getDownloadURL();
    console.log('url',url)
    return url;
  };


  //pick image from gallery
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

      const source = await uploadImage(result.uri);
      auth?.currentUser?.updateProfile({
        photoURL: source,
      }).then(function() {
        // Update successful.
          // Update photoURL in database
        db.collection('users').doc(auth.currentUser?.uid).update({
          imageURL: source,
        }).then(()=>{
          auth?.currentUser?.reload()
          alert('image updated')
        })
      }).catch(function(error) {
        console.log(error)
      });    
      console.log ('source',source)
    };
  }


{/*  const subscribeFriendRequest = () => {
    //if not have friend request then show no friend request 
    //if have friend request then show friend request 
    db.collection('users').where('uid','==',auth.currentUser?.uid).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc) => {
        let loadData = doc.data().friendRequest
        const keyData = Object.keys(loadData);//uid
        const valueData = Object.values(loadData);//state 
        db.collection('users').where('uid','in',keyData).get().then((querySnapshot)=>{
          querySnapshot.forEach((doc) => {
            let requestorData = doc.data()
            console.log('friendRequest',doc.data())
            setFriendRequest((prev) => [...prev,requestorData])
          })
        })
        })
      }) 
    } */}



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

  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      replace("Login");
    }).catch((error) => {
        // An error happened.
        console.log(error);
      });
  }

  const setDisplayNameHandle = (name:string) => {
    if(name !== ''){
      auth.currentUser?.updateProfile({
        displayName: name,
      }).then(function() {
        db.collection('users').doc(auth.currentUser?.uid).update({
          name: name,
        }).then(()=>{
          alert('display name updated')
          goBack();
        })
      }).catch(function(error) {
        console.log(error)
      });
    }else{
      alert('Please enter display name')
    }
  }

  //modal 
  const [modalVisible, setModalVisible] = useState(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
   <View>
      {/* header */}
      <Box height={165} px={4} py={2} shadow={1} >
        <LinearGradient
          colors={['#ACB6E5','#86FDE8']}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
          }}
        />
        <Flex>
          <HStack space={2} alignItems="flex-start" justifyContent="space-between">
            <Heading
              style={{
                color: 'white',
                marginTop: 20,
                marginLeft: 20
              }}
            >
              Setttings
            </Heading>
            <Modal
              isOpen={modalVisible}
              onClose={() => setModalVisible(false)}
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Sign-out</Modal.Header>
                <Modal.Body>
                  <Text>Are you sure you want to sign-out?</Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setModalVisible(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="secondary"
                      onPress={() => {
                        signOut()
                      }}
                    >
                      sure!
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Button
              leftIcon={<Icon as={Entypo} name="log-out" size="sm" />}
              style={{ marginTop: 20, marginRight: 20 }}
              colorScheme="secondary"
              onPress={() => setModalVisible(true)}
            >
              Sign Out
            </Button>
          </HStack>
          <Pressable onPress={pickImage} marginTop={10} h={100} w={100} alignSelf="center" justifyContent="center">
            <Image
              source={{ uri: auth?.currentUser?.photoURL }}
              rounded="full"
              alt="profile"
              size={100}
            />
          </Pressable>
        </Flex>
      </Box>
      {/* body */}
      <Box height={100} px={4} py={10} >
        <VStack
          space={2}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Heading
            style={{
              marginTop: 20,
              marginLeft: 20
            }}
          >
            Account Settings
          </Heading>
          <HStack
            space={2}
            alignItems="center"
            justifyContent={'space-between'}
          >
            {/*UserName */}
            { currentUserUsername ? (
              <Text style={{ marginLeft: 20, fontSize: 20 }}>
                {currentUserUsername}
              </Text>
            ):(
              <Text style={{ marginLeft: 20, fontSize: 20 }}>
                {auth?.currentUser?.displayName}
              </Text>
            )   
          }
           
          </HStack>
          <Heading>Set displayname</Heading>
          <HStack alignItems="center" space={4} w="100%">
                <Input
                  w={{
                    base: '75%',
                    md: '25%'
                  }}
                  onChangeText={(text) => setDisplayname(text)}
                  placeholder="set Display name"
                />
                <IconButton
                  icon={<Icon as={Entypo} name="edit" size="sm" />}
                  style={{ marginRight: 20 }}
                  colorScheme="success"
                  onPress={() => {
                    setDisplayNameHandle(displayname)
                  }}
                />
          </HStack>
          <Heading>
            Friend Request
          </Heading>
           <ScrollView style={{ width: '100%' }}>
           <Text>Friend Request</Text>
          </ScrollView>
        </VStack>
      </Box>
    </View>
  )
}


export default UserMenu

