import * as React from 'react';
import {
  View,
  Text,
  Box,
  Heading,
  ScrollView,
  SwipeListView,
  Hstack
} from 'native-base';

export default function ChatList() {
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

