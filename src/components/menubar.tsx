import React,{
  useState,
} from 'react';
import {
  Button,
  HStack,
  Text,
  Box,
  ScrollView,
  Modal,
  Input,
  Heading
} from 'native-base';
import {Entypo} from '@expo/vector-icons';

import addFriends from './eventHandle/addFriend';
import Bruh from './eventHandle/bruh';

export default function Menubar(props: { navigation: { navigate: any; }; }) {
  const {navigate} = props.navigation
  const [friendID,setFriendID] = useState('');

  const [friendModal, setFriendModal] = React.useState(false);
  return (
    <>
      <Box
        space={4}
        justifyContent="space-between"
        alignItems="flex-start"
        bg="#D9D9D9"
        borderRadius="10px"
        w="auto"
        h="45px"
        m="15px"
        >
        <ScrollView
          w="100%"
          horizontal={true}  
          showsHorizontalScrollIndicator={false}> 
          <HStack m="3px" px="21px" space={4}>
            <Button
              px = "10px"
              borderRadius="15px"
              variant="solid"
              bg="#06C755"
              _text={{
                color: 'black',
                fontSize: 'sm',
                fontWeight: 'bold',
              }}
              rightIcon={<Entypo name="code" size={18} color="black" />}
              onPress={() => props.navigation.navigate('DEV')}
            >
             開発者向けオプション
            </Button>
            <Button 
            px = "10px"
            justifyContent="center"
            alignContent="center"
            leftIcon={<Entypo name="plus" size={24} color="black" />}
              borderRadius="15px"
              variant="solid"
              bg="#06C755"
              _text={{
                color: 'black',
                fontSize: 'sm',
                fontWeight: 'bold',
              }}
              onPress={() => setFriendModal(true)}
            >
            AddFriends
            </Button>
            <Button
              px = "10px"
              borderRadius="15px"
              variant="solid"
              bg="#979797"
              _text={{
                color: 'black',
                fontSize: 'sm',
                fontWeight: 'bold',
              }}
              onPress={() => navigate('stations')}
            >
            Select Stations
            </Button>
            </HStack>
           
          </ScrollView>
          <Modal isOpen={friendModal} onClose={() => setFriendModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Add Friends</Modal.Header>
              <Modal.Body>
                <Heading py="3">Enter your friend's ID</Heading>
                
                <Input
                  placeholder="Enter friend username"
                  onChangeText={(text) => setFriendID(text)}
                  value={friendID}
                />
                <Button
                  my="3"
                  alignSelf="center"
                  width="50%"
                  size="lg"
                onPress={
                //add friend and reset friendID to empty string
                () => {
                  addFriends({friendID: friendID});
                  setFriendID('');
                  setFriendModal(false);
                  console.log('log',friendID);
                }}>Add Friend</Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>

      </Box>
    </>

  );
}

