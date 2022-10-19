import React, {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Box,
  Heading,
  ScrollView,
  SwipeListView,
  Hstack,
  Image
} from 'native-base';

import Chat from '../screens/chat';
import {auth,db} from '../../firebase'

function ChatList(props: { navigation: { navigate: any; }; }) {
  const [users, setUsers] = useState([])
  {/*load all user form database*/}
  useEffect(() => {
    db.collection('users').onSnapshot(snapshot => (
      setUsers(snapshot.docs.map(doc => ({
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().imageURL,
      })))
    ))
    console.log(`users`, users)
  }, [])
  const goChat = (item: { name: any; }) => {
    navigate('Chat', {name: item.name})
  }
  return (
    <View>
      <Box >
        <Heading>chat list</Heading>
        <ScrollView w="100%" h="60%" showVerticalScrollIndicator={false}>
          {users.map((userobj,i)=>{
            return(
              
              <Box 
                onPress={()=>goChat(userobj.name)}
                key={i} flex={1} alignItems="center" justifyContent="center" w="80%" h="20%" bg="white" p={2} my={2} borderRadius={10}>
              <Text>
                {userobj.name}
              </Text>
              <Text>
                {userobj.email}
              </Text>
              <Image
                  key={i}
                source={{uri: userobj.photoURL}}
                alt="Alternate Text"
                borderRadius={100}
                size="md"
              />
              </Box>
            )
            })
          }
        </ScrollView>
      </Box>
    </View>
  );
}

export default ChatList;
