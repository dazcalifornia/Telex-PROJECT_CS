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
} from "native-base";
import {auth,db} from '../../firebase'

import {
  CreateGroup,
  addMember,
  removeMember,
  deleteGroup,
  leaveGroup,
} from "../components/eventHandle/Groupchat";

export default  function DEV () {
  const [service, setService] = useState('');
  const [category, setCategory] = useState('');

  //get datagrom Groupchat() component 
  const [groupchat, setGroupchat] = useState([]);

  const [adduser, setAdduser] = useState('');

  const [currentUsergroup, setCurrentUsergroup] = useState([]);
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
  }, [])

  const [chatroom, setChatroom] = useState([]);

  function loadChatData(){
    //load chatroom data from uid 
    db.collection('Chatroom').where('member', 'array-contains', auth.currentUser?.uid).get().then((snapshot) => {
      setChatroom(snapshot.docs.map((doc) => doc.data()))
    }).then(() => {
      console.log('chatroom:',chatroom)
      //get message collection from chatroom 
      chatroom.map((chatroom,index) => {
        db.collection('Chatroom').doc(chatroom.chatId).collection('messages').orderBy('createdAt', 'desc').get().then((snapshot) => {
          console.log('message:',snapshot.docs.map((doc) => doc.data()?.text))
        })
      })

    }) 
  }

  return (
    <Center flex={1}>
      <VStack space={2} alignItems="center">
        <Button onPress={() => loadChatData()}>Load Chatroom Data</Button>
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
        <ScrollView>
          <Box>
            <Text>your Group</Text>
            {currentUsergroup.map((item,index) => (
              <Box key={index}>
                <Text>Name:{item.name}</Text>
                <Text>Owner{item.groupOwner}</Text>
                <Text>ID:{item.groupId}</Text>
                <Text>Memeber{item.members}</Text>
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
                <Text>Memeber{item.members}</Text>
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
    </Center>
  );
};

