import React,{
  useState,
  useEffect,
} from 'react';

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
  Pressable
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
            <Select
            minWidth={200}
            accessibilityLabel="Select a setService"
            placeholder="Select setService"
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
      )
    }
    if(channel?.length === 0){
      return(
        <Text>no channel</Text>
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
        colors={['#4c669f', '#3b5998', '#192f6a']}
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
          py={2}
          shadow={2}
          rounded="md"
          alignItems="center"
          justifyContent="flex-start"

        >
          <IconButton
          ml="34px"
          _icon={{
            as: Entypo,
            name: "chevron-left",
            size: 5,
            color: "subbase",
          }}
          onPress={() =>{ 
            console.log('go Back')
            props.navigation.goBack()
            }
          }
        />
          <Heading size="md" color="white">
            ChatOptions
          </Heading>
        </HStack>

      </Box> 
    </View>
  )
}

export default ChatMenu
