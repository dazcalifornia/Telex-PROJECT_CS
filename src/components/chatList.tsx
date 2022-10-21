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
  VStack,
  Button,
  Image
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
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().imageURL,
      })))
    ))
  }, [])

  return (
    <View>
      <Box>
      <ScrollView>
        <Heading>chat list</Heading>
        <VStack space={4} alignItems="center">
          {users.map((userobj,i)=>{
            return( 
              <Box 
                key={i} style={{ flex: 1, alignitems: 'center', justifycontent: 'center', }}>
              <Text>
                {userobj.name}
              </Text>
              <Text>
                {userobj.email}
              </Text>
              <Image
                  key={i}
                source={{uri: userobj.photoURL}}
                alt="alternate text"
                borderradius={100}
                size="md"
              />
                  <Button
                    onPress={() => navigate('Chat',
                    { name:userobj.name, 
                      email:userobj.email, 
                      photourl:userobj.photoURL}
                  )}
                    title="chat"
                  />
              </Box>
            )
            })
          }
        </VStack>
      </ScrollView> 
     </Box>
    </View>
  );
}

export default ChatList;
