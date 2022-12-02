import React,{
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Platform,
  Keyboard
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
  TextField,
  FlatList,
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
  console.log('chatmenu props', props)

  const {dispatch,navigate,replace} = props.navigation;

  const {chatId, userId, name, email, photoURL} = props.route.params;
    
  const [channel, setChannel] = useState([]) //load subroom from firebase

  const [chatName, setChatName] = useState('') //load chat name from firebase specific to userId
  
  const member = [auth.currentUser?.uid, userId];

  
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
  }
  

  const createSubChannel =()=>{
    //subchannelID generate
    const subChannelId = Math.random().toString(36).substring(7);
    //subchannel is a collection of chatId
    //if subChannel exist no create subChannel
    const newChatname = channelName.replace(/\s/g, '');
    if(channelName && channelCategory){
      db.collection('Chatroom').doc(chatId).collection('subChannel').where('chatName','==',newChatname).get().then((querySnapshot) => {
        if(querySnapshot.empty){
          db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subChannelId).set({
            catagory: channelCategory,
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
  const ActSheet = () => {
    const [channelCategory, setChannelCategory] = useState('')
    const [channelName, setChannelName] = useState('')
    const createSubChannel =()=>{
      //subchannelID generate
      const subChannelId = Math.random().toString(36).substring(7);
      //subchannel is a collection of chatId
      //if subChannel exist no create subChannel
      const newChatname = channelName.replace(/\s/g, '');
      if(channelName && channelCategory){
        db.collection('Chatroom').doc(chatId).collection('subChannel').where('chatName','==',newChatname).get().then((querySnapshot) => {
          if(querySnapshot.empty){
            db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subChannelId).set({
              catagory: channelCategory,
              channelId: subChannelId,
              chatName: newChatname,
              createdAt: new Date(),
              member: member,
            }).then(() => {
                alert('subchannel created')
                //reload channel 
                setChannel([]);
                setChannelCategory('');
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
      const bottomInset = useKeyboardBottomInset();
      return (
          <Center flex={1}>
                   <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content bottom={bottomInset}>
                      <FormControl mb={5}>
                        <FormControl.Label>Channel-Name</FormControl.Label>
                        <Input
                          w="75%"
                          ml="10%"
                          placeholder="Enter your channel name"
                          onChangeText={text => setChannelName(text)}
                        />
                        <FormControl.Label>Channel-Category</FormControl.Label>
                        <Select
                          w="75%"
                          ml="10%"
                          placeholder="Select your channel category"
                          selectedValue={channelCategory}
                          onValueChange={itemValue => setChannelCategory(itemValue)}
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
                          onPress={() => {
                            createSubChannel();
                            onClose();
                            setChannelName('');
                          }}
                        >
                          Create Channel
                        </Button>
                      </FormControl>
                    </Actionsheet.Content>
                  </Actionsheet>
  
          </Center>
      );
  };
  const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = useState(0);
  const subscriptions = useRef([]);

  useEffect(() => {
    function onKeyboardChange(e) {
      if (
        e.startCoordinates &&
        e.endCoordinates.screenY < e.startCoordinates.screenY
      )
        setBottom(e.endCoordinates.height);
      else setBottom(0);
    }

    if (Platform.OS === 'ios') {
      subscriptions.current = [
        Keyboard.addListener('keyboardWillChangeFrame', onKeyboardChange),
      ];
    } else {
      subscriptions.current = [
        Keyboard.addListener('keyboardDidHide', onKeyboardChange),
        Keyboard.addListener('keyboardDidShow', onKeyboardChange),
      ];
    }
    return () => {
      subscriptions.current.forEach((subscription) => {
        subscription.remove();
      });
    };
  }, [setBottom, subscriptions]);

  return bottom;
  };

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
            placeholder="SELECT YOUR CHAT-CHANNEL"
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
          <Button
            w="75%"
            ml="10%"
            mt={5}
            colorScheme="teal"
            onPress={onOpen}
            endIcon={<Icon as={<Entypo name="plus" />} size="md" />}
            rounded="full"
          >
            Create Another Channel
          </Button>
          <ActSheet />
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
          <Box>
            <Button 
              onPress={onOpen}
              w="75%"
              my={5}
              ml="10%"
              alignSelf="start"
              colorScheme="white"
              variant="outline"
              endIcon={<Icon as={<Entypo name="plus" />} size="md" />}
            >
              Create Channel Now 
            </Button>
              {/*Actionsheet*/}
              <ActSheet/>
            </Box>
        </Box>
      )
    }
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
        <Button
          w="75%"
          my={5}
          alignSelf="center"
          variant="outline"
          colorScheme="white"
          onPress={() => {
            console.log('go subchannel')
            navigate('subChListed')
            }
          }
          endIcon={<Icon as={<Entypo name="chevron-right" />} size="md" />}
        >
          More Options
        </Button>
         <Button
          w="75%"
          my={5}
          alignSelf="center"
          variant="outline"
          colorScheme="white"
          onPress={() => {
            console.log('go search')
            navigate('Search', {chatId: chatId})
            }
          }
          endIcon={<Icon as={<Entypo name="magnifying-glass" />} size="md" />}
        >
          Search Message
        </Button>

      </Box>
    </View>
  )
}

export default ChatMenu
