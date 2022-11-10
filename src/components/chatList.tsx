import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Text,
  Box,
  Heading,
  ScrollView,
  VStack,
  Image,
  HStack,
  Pressable,
  Center,
  IconButton,
} from 'native-base';
import {auth,db} from '../../firebase'

import Menubar from '../components/menubar'
import { RefreshControl } from 'react-native';

import { Entypo } from '@expo/vector-icons';

function ChatList(props: { navigation: { navigate: any; }; }) {
  const {navigate} = props.navigation;

  //store User that retrieve from database
  const [users, setUsers] = useState([])
  const onloadUser = auth?.currentUser?.uid;

  //refresh the page
  const [refresh, setRefresh] = useState(false)
  
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefresh(true)
    wait(2000).then(() => {
      setRefresh(false)
      getUser()
    });
  }, []);

  const getUser = async () => {
        console.log('onloadUser',onloadUser)
    db.collection('users').where('uid','==',onloadUser).get('friends').then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const friendListed = doc.data().friends
        console.log('friendListed',friendListed)
        db.collection('users').where('username','in',friendListed).onSnapshot(snapshot => (
          //loadUser here! or code below 
          setUsers(snapshot.docs.map(doc => ({
            userId: doc.data().uid,
            name: doc.data().name,
            email: doc.data().email,
            photoURL: doc.data().imageURL,
          })))
        ))
      });
    }).catch((error) => {
      console.log("Error getting documents: ", error);
      })

  }

  useEffect(() => {
    getUser()
  }, [])
  function ListedUser () {
    console.log("Hello")
    if(users.length > 0){
    return(
      <VStack  space={4} px="14px" alignItems="center">
            {users.map((userobj, i) => {
              return (
                <Box
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
                  <HStack space={4} alignItems="center" w={100} justifyContent="space-between" >
                    <Image 
                      key={i}
                      source={{ uri: userobj.photoURL }}
                      alt="Friend picture"
                      borderRadius={100}
                      size="65px"
                    />
                      <Text> {userobj.name} </Text>
                      <IconButton
                        borderRadius="15px"
                        variant="solid"
                        colorScheme="indigo"
                        _icon={{
                          as: Entypo,
                          name:'chevron-right',
                          color: 'white',
                          size: 'md',
                        }}
                      />
                    </HStack>
                  </Pressable>
                </Box>
              )
            })
            }
          </VStack>

    )
    }else{
      return(
      <Center>
        <Text
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        > No friends yet let find someone 😆</Text>
      </Center>
      )
    }
  }
  return (
    <>
      <Menubar {...props}/>
      <Box shadow={2} mt="10px" flex={1} bg="white" roundedTop="30px" bg="#FCFBFC">
        <Heading size="xl" pt="7px" pl="14px" fontSize="40" color="black">Friend List</Heading>
        <ScrollView 
          pt="18px"
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }
        >
          <ListedUser />
        </ScrollView>
      </Box>
    </>
  )
}
export default ChatList
