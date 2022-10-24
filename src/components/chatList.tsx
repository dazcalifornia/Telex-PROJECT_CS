import React, {
  useState,
  useEffect,
} from 'react';
import {

  Text,
  Box,
  Heading,
  ScrollView,
  VStack,
  Button,
  Image,
  HStack,
  Pressable,
} from 'native-base';

import Chat from '../screens/chat';
import {auth,db} from '../../firebase'

function ChatList(props: { navigation: { navigate: any; }; }) {
  const [users, setUsers] = useState([])

  const { navigate } = props.navigation;
  
  {/*load all user form database*/}
  //load all user from database except current user

  useEffect(() => {
    db.collection('users').where('uid','!=',auth.currentUser?.uid).onSnapshot(snapshot => (
      setUsers(snapshot.docs.map(doc => ({
        userId: doc.data().uid,
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().imageURL,
      })))
    ))
  }, [])

  return (
    <>
      <Box shadow={2} mt="10px" flex={1} bg="white" roundedTop="30px">
        <Heading size="xl" pt="7px" pl="14px" fontSize="40" color="black">Friend List</Heading>
        <ScrollView pt="18px">
          <VStack space={4} px="14px" alignItems="center">
            {users.map((userobj, i) => {
              return (
                <Box
                  shadow={2}
                  bg="#FCFBFC"
                  py="4px"
                  w="100%"
                  key={i} style={{ 
                    flex: 1, 
                    alignitems: 'center', 
                    justifycontent: 'center',
                  }}
                >
                  <Pressable onPress={() => navigate('Chat',
                    {
                      userId: userobj.userId,
                      name: userobj.name,
                      email: userobj.email,
                      photoURL: userobj.photoURL
                    }
                  )}>
                  <HStack space={4} alignItems="center" w={100}>
                    <Image 
                      key={i}
                      source={{ uri: userobj.photoURL }}
                      alt="Friend picture"
                      borderRadius={100}
                      size="65px"
                    />
                    <Text> {userobj.name} </Text>
                    </HStack>
                  </Pressable>
                </Box>
              )
            })
            }
          </VStack>
        </ScrollView>
      </Box>
    </>
  )
}
export default ChatList;
