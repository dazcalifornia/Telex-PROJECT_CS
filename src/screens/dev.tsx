import React,{
    useState,
    useEffect,
  } from "react";
import { 
  Select,
  Box, 
  CheckIcon, 
  Center,
  Text,
  VStack,
  Input,
  Button,
  ScrollView,
  Avatar,
  HStack,
  Heading,
  View,
  IconButton,
  Icon,
  Divider,
} from "native-base";
import {auth,db} from '../../firebase'

import {Entypo} from '@expo/vector-icons'

import {
  CreateGroup,
  addMember,
  removeMember,
  deleteGroup,
  leaveGroup,
  AcceptInvite,
} from "../components/eventHandle/Groupchat";

export default  function DEV () {
  const [service, setService] = useState('');
  const [category, setCategory] = useState('');

  //get datagrom Groupchat() component 
  const [groupchat, setGroupchat] = useState([]);

  const [adduser, setAdduser] = useState('');

  const [currentUsergroup, setCurrentUsergroup] = useState([]);

  const [groupInvite, setGroupInvite] = useState([]);
  
  const [whereMessagefrom, setWhereMessagefrom] = useState([]);

  useEffect(() => {
      db.collection('group').where('groupOwner', '==', auth.currentUser?.uid).get().then((snapshot) => {
        setCurrentUsergroup(snapshot.docs.map((doc) => doc.data()))
      }).finally(() => {
        console.log('group that you are Owner:',currentUsergroup)
      })
      db.collection('group').where('members', 'array-contains', auth.currentUser?.uid).get().then((snapshot) => {
        setGroupchat(snapshot.docs.map((doc) => doc.data()))
      }).finally(() => {
        console.log('group that you are member:',groupchat)
      })
      //get group invite from user collection
      db.collection('users').doc(auth.currentUser?.uid).get().then((snapshot) => {
        //map user data
        const data = snapshot.data()?.groupInvite
        const inviteKey = Object.keys(data)
        db.collection('group').where('groupId', 'in', inviteKey).get().then((snapshot) => {
          snapshot.docs.map((doc) => {
            const data = doc.data()
            setGroupInvite((prev) => [...prev, data])
          })
        })
        console.log('group invite:',groupInvite)
      }).catch((error) => {
        console.log(error)
      })
      if(whereMessagefrom.length > 0){
        console.log('whereMessagefrom:',whereMessagefrom)
      }else{
        messageroom.forEach((item) => {
          if(item.groupId === groupchat[0].groupId){
            setWhereMessagefrom(item)
            console.log('whereMessagefrom:',whereMessagefrom)
          }
        })
      }

  }, [])


  const [chatroom, setChatroom] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [messageroom, setMessageroom] = useState([]);

  function loadChatData(){
    //load chatroom data from uid 
    db.collection('Chatroom').where('member', 'array-contains', auth.currentUser?.uid).get().then((snapshot) => {
      setChatroom(snapshot.docs.map((doc) => doc.data()))
    }).then(() => {
      console.log('chatroom:',chatroom)
      //get message collection from chatroom 
      chatroom.map((chatroom,index) => {
        db.collection('Chatroom').doc(chatroom.chatId).collection('messages').orderBy('createdAt', 'desc').get().then((snapshot) => {
          setMessageroom(snapshot.docs.map((doc) => doc.data()?.text))
          console.log('messageroom:',messageroom)
        })
      })
    }) 
  }

  const findMessage = (keyword:string) => {
    //find message from message in chatroom 
    db.collection('Chatroom').where('member', 'array-contains', auth.currentUser?.uid).get().then((snapshot) => {
      snapshot.docs.map((doc) => {
        console.log('message found in chatroom:',doc.data().chatId)

        db.collection('Chatroom').doc(doc.data().chatId).collection('messages').where('text', '==', keyword).get().then((snapshot) => {
          snapshot.docs.map((doc) => {
            setMessageroom(snapshot.docs.map((doc) => doc.data()))
            console.log('message:',doc.data())
          })
        })
      })
    })
  }
  const findInsubChannel = (keyword:string) => {
    db.collection('Chatroom').where('member', 'array-contains', auth.currentUser?.uid).get().then((snapshot) => {
      snapshot.docs.map((doc) => {
        console.log('message found in chatroom:',doc.data().chatId)
        //get message collection from subchatroom
        var mainchatId = doc.data().chatId
        db.collection('Chatroom').doc(doc.data().chatId).collection('subChannel').get().then((snapshot) => {
          console.log('mainchatId:',mainchatId)
          snapshot.docs.map((doc) => {
            var subchatId = doc.data().channelId
            console.log('subchatId:',subchatId)
            db.collection('Chatroom').doc(mainchatId).collection('subChannel').doc(subchatId).collection('messages').where('text', '==', keyword).get().then((snapshot) => {
              //if message found in subchatroom console log chatroom Name and message 
              //if not found console log chatroom Name and message not found
              if(snapshot.docs.length > 0){
                snapshot.docs.map((doc) => {
                  setMessageroom(next => [...next, doc.data()])
                  console.log('message:',doc.data())
                  //bring subchatroom name from subchatId
                  db.collection('Chatroom').doc(mainchatId).collection('subChannel').doc(subchatId).get().then((snapshot) => {
                    console.log('subchatroom Name:',snapshot.data()?.chatName)
                  })
                })
              }else{
                console.log('message not found in subchatroom')

              }
            })
          })
        })
      })
    })
  }
      

  return (
    <View style={{flex:1}} w="100%" h="100%">
      <VStack space={4} alignItems="center">
        <Heading>開発者向けオプション</Heading>
        <Text fontSize="xs" color="gray.500" >Kaihatsushamukike opushon</Text>

      </VStack>
      <ScrollView>
      <VStack space={2} alignItems="center" w="100%">
        <Button onPress={() => loadChatData()}>Load Chatroom Data</Button>
        <Input
          placeholder="Search Message"
          onChangeText={(text) => setKeyword(text)}
        />
        <Button onPress={() => findMessage(keyword)}>Search</Button>
        <Button onPress={() => findInsubChannel(keyword)}>Search in subChannel</Button>
        <Text>Message:</Text>
        <ScrollView>
          {messageroom.map((messageroom,index) => (
            <Box key={index} w="90%" p={2} my={2} bg="cyan.200">
              <HStack space={2}>
                <Avatar
                  size="sm"
                  source={{ uri: messageroom?.user?.avatar }}
                />
                <VStack space={1}>
                  <Text fontSize="sm" bold>
                    {messageroom?.user?.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {messageroom?.createdAt?.toDate().toUTCString()}
                  </Text>
                </VStack>
              </HStack>
              <Text fontSize="sm" mt={1}>
                {messageroom?.text}
              </Text>
            </Box>
          ))}
        </ScrollView>
       
        <Text fontSize="lg" bold>
          Select a setService
        </Text>
        <Input
          placeholder="Enter a setService"
          value={service}
          onChangeText={(nextValue) => setService(nextValue)}
        />
          <Select
            selectedValue={category}
            minWidth={200}
            accessibilityLabel="Select a setCategory"
            placeholder="Select a setCategory"
            onValueChange={(itemValue) => setCategory(itemValue)}
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

        <Text fontSize="lg" bold>
          {service}
        </Text>
        <Button
          onPress={() => {
            //send service to CreateGroup 
            console.log(service);
            CreateGroup({name: service, category: category});
          }}
        >Send Data</Button>
            {/*group in invite */}
          <Text fontSize="lg" bold>
            Group in invite 
          </Text>
          <ScrollView>
          {groupInvite.map((groupInvite,index) => (
            <Box key={index} w="90%" p={2} my={2} bg="cyan.200">
              <HStack space={2}>
                <Text fontSize="sm" bold>
                  {groupInvite.name}
                </Text>
              </HStack>
              <IconButton
                icon={<Icon as={<Entypo name="cross" />} size="sm" />}
                onPress={() => {
                  //delete groupInvite 
                  console.log(groupInvite);
                  db.collection('users').doc(auth.currentUser?.uid).update({
                    groupInvite: firebase.firestore.FieldValue.arrayRemove(groupInvite)
                  })
                }}
              />
              <IconButton
                icon={<Icon as={<Entypo name="check" />} size="sm" />}
                onPress={() => {
                  //add groupInvite to group
                  AcceptInvite({groupId: groupInvite.groupId})
                }}
              />
            </Box>
          ))}
        </ScrollView>
        <ScrollView>
          <Box>
            <Text>your Group</Text>
            {currentUsergroup.map((item,index) => (
              <Box key={index}>
                <Text>Name:{item.name}</Text>
                <Text>Owner{item.groupOwner}</Text>
                <Text>ID:{item.groupId}</Text>
                <VStack space={2} alignItems="center">
                  {item.members.map((member,index) => (
                    <Text key={index}>{member}</Text>
                  ))}
                </VStack>

                <Input 
                  placeholder="Enter username to add"
                  onChangeText={(text) => setAdduser(text)}
                />
                <Button
                  onPress={() => {
                    addMember({groupId: item.groupId, username: adduser})
                  }}
                >Add Member</Button>
                <Button
                  onPress={() => {
                    console.log('delete group')
                    deleteGroup({groupId: item.groupId})
                  }}
                >Delete Group</Button>
                <Button
                  onPress={() => {
                    console.log('leave group')
                    leaveGroup({groupId: item.groupId})
                  }}
                >Leave Group</Button>
                <Button
                  onPress={() => {
                    removeMember({groupId: item.groupId, username: adduser})
                  }}
                >Remove Member</Button>
              </Box>
            ))}
          </Box>
        </ScrollView>
        <ScrollView>
          <Box>
            <Text>Group that you are member</Text>
            {groupchat.map((item,index) => (
              <Box key={index}>
                <Text>Name:{item.name}</Text>
                <Text>Owner{item.groupOwner}</Text>
                <Text>ID:{item.groupId}</Text>
                <Text>Memeber: </Text>
                <VStack space={2} alignItems="center">
                  {item.members.map((member,index) => (
                    <Text key={index}>{member}</Text>
                  ))}
                </VStack>
                <Button
                  onPress={() => {
                    leaveGroup({groupId: item.groupId})
                  }}
                >Leave Group</Button>
              </Box>
            ))}
          </Box>
          </ScrollView>
      </VStack>
      </ScrollView>
    </View>
  );
};

