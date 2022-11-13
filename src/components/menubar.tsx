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
} from 'native-base';
import {Entypo} from '@expo/vector-icons';

import addFriends from './eventHandle/addFriend';

export default function Menubar(props: { navigation: { navigate: any; }; }) {
  const [friendID,setFriendID] = useState('');

  const [friendModal, setFriendModal] = React.useState(false);
  return (
    <>
      <Box
        space={4}
        justifyContent="center"
        alignItems="start"
        bg="#D9D9D9"
        borderRadius="10px"
        w="auto"
        h="45px"
        m="15px"
        >
        <HStack m="3px" px="21px" space={4}>
        <ScrollView 
          horizontal={true}  
          showsHorizontalScrollIndicator={false}> 
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
              onPress={() => props.navigation.navigate('DEV')}
            >
            Create Group
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
              onPress={() => props.navigation.navigate('DEV')}
            >
            Stations Section
            </Button>
            </ScrollView>
        </HStack>
          <Modal isOpen={friendModal} onClose={() => setFriendModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Add Friends</Modal.Header>
              <Modal.Body>
                <Input
                  placeholder="Enter friend username"
                  onChangeText={(text) => setFriendID(text)}
                  value={friendID}
                />
                <Button onPress={
                //setFriendID to addFriend
                () => addFriends({friendID: friendID})
              }>Add Friend</Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>

      </Box>
    </>

  );
}

