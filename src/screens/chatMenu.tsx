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
} from 'native-base';

import {auth, db} from '../../firebase';
const ChatMenu = (props:any) => {

  const {dispatch,navigate,replace} = props.navigation;

  const {userId, name, email, photoURL} = props.route.params;
    
  const [channel, setChannel] = useState([]) //load subroom from firebase

  const [chatName, setChatName] = useState('') //load chat name from firebase specific to userId
  
  const member = [auth.currentUser?.uid, userId];
  const chatId = member.sort().join('_');

  
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

  const [newChat, setNewChat] = useState('') //create new chat 
  const createSubChannel =()=>{
    //subchannelID generate
    const subChannelId = Math.random().toString(36).substring(7);
    //subchannel is a collection of chatId
    //if subChannel exist no create subChannel
    const newChatname = newChat.replace(/\s/g, '');
    if(newChatname){
      db.collection('Chatroom').doc(chatId).collection('subChannel').where('chatName','==',newChatname).get().then((querySnapshot) => {
        if(querySnapshot.empty){
          db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subChannelId).set({
            channelId: subChannelId,
            chatName: newChatname,
            createdAt: new Date(),
            member: member,
          }).then(() => {
              alert('subchannel created')
              //reload channel 
              setChannel([]);
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
        alert('please enter chat name')
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
              <Select.Item label={item.chatName} value={item.channelId}/>
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

  return (
    <>
      <Center flex={1}>
        <Input
            placeholder="Enter chat name"
            onChangeText={(text) => setNewChat(text)}
            value={newChat}
          />
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
                navigation: props.replace,
              }))
              
            }}>Back to regular chat</Button>
          <ThrowChannel />
        </VStack>
      </Center>
    </>
  )
}

export default ChatMenu
