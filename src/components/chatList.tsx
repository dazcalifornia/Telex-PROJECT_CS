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
  Hstack
} from 'native-base';

import {auth,db} from '../../firebase'

export default function ChatList(props: { navigation: { navigate: any; }; }) {
  const [users, setUsers] = useState([])
 
  const findUsers = () => {
    db.collection('users').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }
  useEffect(() => {
    findUsers()
  }, [])
  return (
    <View style={{flex:1}}>
      <ScrollView>
        {users.map((user: { id: any; data: { email: any; }; }) => (
          <Hstack key={user.id} onPress={() => props.navigation.navigate('Chat', {email: user.data.email})}>
            <Text>{user.data.email}</Text>
          </Hstack>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View>
      <Box>
        <Heading>chat list</Heading>
        <ScrollView w="100%" h="60%" showVerticalScrollIndicator={false}>
          <ChatItem />
        </ScrollView>
      </Box>
    </View>
  );
}


const ChatItem = () => {
  const data = [{
    key: '1',
    title: 'Title 1',
    description: 'Description 1',
  }, {
    key: '2',
    title: 'Title 2',
    description: 'Description 2',
  }, {
    key: '3',
    title: 'Title 3',
    description: 'Description 3',
  }, {
    key: '4',
    title: 'Title 4',
    description: 'Description 4',
  }, {
    key: '5',
    title: 'Title 5',
    description: 'Description 5',
  }, {
  }]
  return (
    <View>
      <Box>
        {data.map((item) => {
          return (
            <Box pl="4" pr="5" py="2" key={item.key}>
               <Text>{item.title}</Text>
               <Text>{item.description}</Text>
            </Box>
          );
        })}
      </Box>
    </View>
  );
}

