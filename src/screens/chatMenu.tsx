import React,{
  useState,
  useEffect,
} from 'react';
import {
  Platform
} from 'react-native';

import {
  IconButton,
  Text,
  Select,
  Box,
  CheckIcon,
  Center,
  VStack,
  Button,
  Input,
  Modal,
  View,
  Icon,
  Heading,
  HStack,
  Pressable,
  Divider,
  FormControl,
  Actionsheet,
  useDisclose,
  KeyboardAvoidingView
} from 'native-base';

import {auth, db} from '../../firebase';
import firebase from 'firebase/compat/app';

import { Entypo } from '@expo/vector-icons';
// import { 
//   Search,
//   searchInSubCollection 
// } from "../components/eventHandle/search";

import {LinearGradient} from 'expo-linear-gradient';
const ChatMenu = (props:any) => {

  const {dispatch,navigate,replace} = props.navigation;

  const {userId, name, email, photoURL} = props.route.params;
    
  const [channel, setChannel] = useState([]) //load subroom from firebase

  const [chatName, setChatName] = useState('') //load chat name from firebase specific to userId
  
  const member = [auth.currentUser?.uid, userId];
  const chatId = member.sort().join('_');
  
  const [keyword, setKeyword] = useState('');

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  
  useEffect(() => {
    console.log('chatId',chatId)
    console.log('member',member)
    //load channel from firebase
    resloveChannel();
    if(channel?.length === 0){
      setChannel([])
    }
  }, [])

  const resloveChannel = () => {
	    db.collection('Chatroom').doc(chatId).collection('subChannel').get().then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
          let data = doc.data();
          setChannel(channel=>[...channel,data])
          console.log('channel',data)
        })
    })
  }

  const changeChannel = (itemValue:string) => {
    setChatName(itemValue);

    //log chat Name in channel[]
    let chName = channel.filter((item:any) => item.channelId === itemValue);
    console.log('chName',chName[0].chatName)
    dispatch(replace('SubChannel',{
      subId: itemValue,
      chatId: chatId,
      chatName: chName[0].chatName,
      userId: userId,
      name: name,
      photoURL: photoURL,
      navigation: props.navigation,
    }))
    console.log('channelID',itemValue)
  };
  
  const [chatcategory, setChatcategory] = useState('')
  const [newChat, setNewChat] = useState('') //create new chat 
  const createSubChannel =()=>{
    //subchannelID generate
    const subChannelId = Math.random().toString(36).substring(7);
    //subchannel is a collection of chatId
    //if subChannel exist no create subChannel
    const newChatname = newChat.replace(/\s/g, '');
    if(newChatname&&chatcategory){
      db.collection('Chatroom').doc(chatId).collection('subChannel').where('chatName','==',newChatname).get().then((querySnapshot) => {
        if(querySnapshot.empty){
          db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subChannelId).set({
            catagory: chatcategory,
            channelId: subChannelId,
            chatName: newChatname,
            createdAt: new Date(),
            member: member,
          }).then(() => {
              alert('subchannel created')
              //reload channel 
              setChannel([]);
              setChatcategory('');
              resloveChannel();
            }).catch((error) => {
              console.log("error getting documents: ", error);
            })
        }else{
          alert('subChannel exist')
        }}).catch((error) => {
          console.log("error getting documents: ", error);
        })
      }else{
        alert('invalid chant name or category')
      }
  }

  const ThrowChannel = () => {
    if(channel?.length !== 0){
      return(
        <Box>
          <HStack
            alignItems="center"
            justifyContent="start"
            px={4}
            py={2}
          >
            <Heading
              size="xl"
              color="white"
            >
              Your Channel List 
            </Heading>
              <Icon 
                ml="1"
                as={<Entypo name="list" />}
                size="md"
                color="white"
              />
          </HStack>
            <Divider
              bg="white"
              my={2}
              ml={4}
              w="60%"
            />
            <Select
            w="75%"
            my={5}
            ml="10%"
            alignSelf="start"
            accessibilityLabel="Select a chat"
            placeholder="SELECT YOUR CHAT CHANNEL"
            selectedValue={chatName}
            onValueChange={(itemValue) => changeChannel(itemValue)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={4} />,
            }}
          >
            {channel.map((item:any,key) => (
              <Select.Item label={item.chatName} value={item.channelId} key={key} />
            ))}
          </Select>
        </Box>
      )
    }
    if(channel?.length == 0){
      return (
        <Box>
          <HStack alignItems="center" justifyContent="flex-start" px={4} py={2}>
            <Heading size="lg" color="white">
              You didn't create any channel yet 🥲
            </Heading>
          </HStack>
          <Divider bg="white" my={1} ml={4} w="90%" />
          <Box>
            <Text color="white" ml="10%" my={2} size="md">
              Create your channel now
              <IconButton
                ml="1"
                icon={<Entypo name="plus" />}
                size="md"
                color="white"
                onPress={onOpen}
              />
            </Text>
            <KeyboardAvoidingView
                h={{
                  base: '400px',
                  lg: 'auto'
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                  <Actionsheet.Content>
                    <FormControl mb={5}>
                      <FormControl.Label>Channel-Name</FormControl.Label>
                      <Input
                        w="75%"
                        ml="10%"
                        placeholder="Enter your channel name"
                        onChangeText={text => setNewChat(text)}
                      />
                      <FormControl.Label>Channel-Category</FormControl.Label>
                      <Select
                        w="75%"
                        ml="10%"
                        placeholder="Select your channel category"
                        selectedValue={chatcategory}
                        onValueChange={itemValue => setChatcategory(itemValue)}
                        _selectedItem={{
                          bg: 'teal.600',
                          endIcon: <CheckIcon size={4} />
                        }}
                      >
                        <Select.Item label="Study" value="Study" />
                        <Select.Item label="Work" value="Work" />
                        <Select.Item label="Social" value="Social" />
                        <Select.Item label="Others" value="Others" />
                      </Select>
                      <Button
                        w="75%"
                        ml="10%"
                        mt={5}
                        colorScheme="teal"
                        onPress={createSubChannel}
                      >
                        Create Channel
                      </Button>
                    </FormControl>
                  </Actionsheet.Content>
                </Actionsheet>
              </KeyboardAvoidingView>
          </Box>
        </Box>
      )
    }
  }

  const [friendMenu, setFriendMenu] = useState(false)
  
  const bloackUser = (uid:string) => {
    console.log('block',uid)
    db.collection('users').doc(auth.currentUser?.uid).collection('block').doc(uid).get().then((doc) => {
      if(doc.exists){
        alert('user already block')
      }else{
        db.collection('users').doc(auth.currentUser?.uid).collection('block').doc(uid).set({
          blockId: uid,
          createdAt: new Date(),
        }).then(() => {
          alert('user block')
        }).catch((error) => {
          console.log("error getting documents: ", error);
        })
      }
    })
  }

  const unFriend = (uid:string) => {
    console.log('unFriend',uid)
    //convert uid to username
    db.collection('users').where('uid','==',uid).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let target = doc.data().username;
        console.log('target',target)
        db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
          console.log(doc.data())
          //get friend list
          let friendList = doc.data()?.friends;
          console.log('friend',friendList)
          //remove target from friend friendList
          let newFriendList = friendList.filter((item:any) => item !== target);
          console.log('newFriend',newFriendList)
          //if traget is in friendList Remove
          if(friendList.includes(target)){
            db.collection('users').doc(auth.currentUser?.uid).update({
              friends: firebase.firestore.FieldValue.arrayRemove(target)
              }).then(() => {
                replace('Home')
                alert('unfriend success')
              }).catch((error) => {
                console.log("error getting documents: ", error);
              })
          }else{
            alert('unfriend failed')
          }
        })
      })
    })
  }

const [messages, setMessages] = useState([])
const Search = (keyword: string, chatId: string) => {
  db.collection('Chatroom')
    .doc(chatId)
    .collection('messages')
    .where('text', '==', keyword)
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        setMessages(doc.data())
      })
    })
  console.log(messages)
}

const searchInSubCollection = (keyword: string, chatId: string) => {
  db.collection('Chatroom')
    .doc(chatId)
    .collection('subChannel')
    .get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        db.collection('Chatroom')
          .doc(chatId)
          .collection('subChannel')
          .doc(doc.id)
          .collection('messages')
          .where('text', '==', keyword)
          .get()
          .then(snapshot => {
            snapshot.docs.forEach(doc => {
              setMessages(doc.data())
              console.log(doc.data())
            })
          })
      })
    })
  console.log(messages)
} 
  return (
    <View
      flex={1}
    >
      <LinearGradient
        colors={['#BBD2C5', '#539576', '#292E49']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      />
        {/*header*/}
      <Box>
        <HStack
          px={2}
          py={4}
          shadow={2}
          rounded="md"
          alignItems="center"
          justifyContent="flex-start"

        >
          <IconButton
          ml="34px"
          variant="ghost"
          _icon={{
            as: Entypo,
            name: "chevron-left",
            size: 9,
            color: "subbase",
          }}
          onPress={() =>{ 
            console.log('go Back')
            props.navigation.goBack()
            }
          }
        />
          <Heading size="xl" color="white">
            ChatOptions
          </Heading>
            <Icon as={Entypo} name="chat" size={5} color="white" ml="2" mr="2" />
        </HStack>
          <Divider w="80%" alignSelf="center" />
      </Box>
      {/*body*/}
      <Box
          flex={1}
          mt={2}
          shadow={2}
          p={2}
          h="auto"
        >
        <ThrowChannel />
      </Box>
    </View>
  )
}

export default ChatMenu
