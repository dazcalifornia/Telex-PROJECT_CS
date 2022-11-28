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
} from 'native-base';

import {auth, db} from '../../firebase';
import firebase from 'firebase/compat/app';

// import { 
//   Search,
//   searchInSubCollection 
// } from "../components/eventHandle/search";


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
    <>
      <Center flex={1}>
        <Input
          placeholder="Search Message"
          onChangeText={(text) => setKeyword(text)}
        />
        <Button onPress={() => Search(keyword,chatId)}>Search</Button>
        <Button onPress={() => searchInSubCollection(keyword)}>Search in subChannel</Button>
        <Button
          onPress={() => setFriendMenu(true)}
          colorScheme="teal"
          variant="outline"
        >
          settings
        </Button>

        <Input
            placeholder="Enter chat name"
            onChangeText={(text) => setNewChat(text)}
            value={newChat}
          />
          <Select
            minWidth={200}
            accessibilityLabel="Select a category"
            placeholder="Select category"
            selectedValue={chatcategory}
            onValueChange={(itemValue) => setChatcategory(itemValue)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={4} />,
            }}
          >
            <Select.Item label="General" value="General" />
            <Select.Item label="Game" value="Game" />
            <Select.Item label="Study" value="Study" />
            <Select.Item label="Work" value="Work" />
          </Select>
          <Button onPress={createSubChannel}>Create newChat</Button>
        <VStack space={2} alignItems="center">
          <Text fontSize="lg" bold>
            Select a channel
          </Text>
            <Button 
              onPress={() => {
              dispatch(navigate('Chat',{
                userId: userId,
                name: name,
                email: email,
                photoURL: photoURL,
                navigation: props.navigation,
              }))
              
            }}>Back to regular chat</Button>
          <ThrowChannel />
          <Modal isOpen={friendMenu} onClose={() => setFriendMenu(false)}>
            <Modal.Content>
              <Modal.CloseButton/>
              <Modal.Header>Friend Menu</Modal.Header>
                <Modal.Body>
                <Button 
                  onPress={() => bloackUser(userId)}
                  colorScheme="red"
                >Block</Button>
                <Button
                  onPress={() => unFriend(userId)}
                >Remove</Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </VStack>
      </Center>
    </>
  )
}

export default ChatMenu
