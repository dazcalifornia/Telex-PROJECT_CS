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
  Button,
  Image
} from 'native-base';

import Chat from '../screens/chat';
import {auth,db} from '../../firebase'

function ChatList(props: { navigation: { navigate: any; }; }) {
  const [users, setUsers] = useState([])

  const { navigate } = props.navigation;
  
  {/*load all user form database*/}
  useEffect(() => {
    db.collection('users').onSnapshot(snapshot => (
      setUsers(snapshot.docs.map(doc => ({
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().imageURL,
      })))
    ))
  }, [])

  return (
    <View>
      <Box >
        <Heading>chat list</Heading>
        <ScrollView w="100%" h="60%" showVerticalScrollIndicator={false}>
          {users.map((userobj,i)=>{
            return(
              
              <Box 
                key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
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
                  <Button
                    onPress={() => navigate('Chat',
                    { name:userobj.name, 
                      email:userobj.email, 
                      photoURL:userobj.photoURL}
                  )}
                    title="Chat"
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
