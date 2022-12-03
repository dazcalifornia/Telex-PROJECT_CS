import React,{
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import {
    View,
    Text,
    Input,
    Button,
    Select,
    CheckIcon,
    Box,
    VStack,
    HStack,
    Avatar,
    Heading,
    ScrollView,
} from 'native-base'

import {Search} from '../components/eventHandle/search';

import {auth,db} from '../../firebase';

const SearchScreen = (props:{chatId:string}) => {
  console.log('props',props)
  const {chatId} = props.route.params;
  const [keyword, setKeyword] = useState('');
  const [searchtype, setSearchtype] = useState('');

  const [searchResult, setSearchResult] = useState([]);

  const searchMsg =()=>{
    setSearchResult([]);
    if(searchtype ==='message'){
      db.collection('Chatroom').doc(chatId).collection('messages').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let msg = doc.data().text.toLowerCase();
          if(msg.includes(keyword)){
            setSearchResult((prev)=>[...prev,doc.data()])
          }
        });
      }).then(()=>{
          console.log('searching')
      }).finally(()=>{
          console.log('searched')

      }).catch((error) => {
          console.log("Error getting documents: ", error);
      })
    }else if(searchtype ==='channel'){
      console.log('searching channel')
      db.collection('Chatroom').doc(chatId).collection('subChannel').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          let subID = doc.data().channelId;
          db.collection('Chatroom').doc(chatId).collection('subChannel').doc(subID).collection('messages').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let msg = doc.data().text.toLowerCase();
              if(msg.includes(keyword)){
                setSearchResult((prev)=>[...prev,doc.data()])
              }
            });
          }).then(()=>{
              console.log('searching')
          }).catch((error) => {
              console.log("Error getting documents: ", error);
          })
        });
      })
    }else if (searchtype ==='user'){
      console.log('searching user')
    }else{
      console.log('searching all')
    }
  }

  useEffect(()=>{
    console.log('searchResult',searchResult);
  },[searchResult])

  return(
    <View>
      <Text>Search Screen</Text>
      <Input 
        placeholder="Search" 
        value={keyword}
        onChangeText={(text)=>setKeyword(text.toLowerCase())}
      />
      <Select
        selectedValue={searchtype}
        minWidth={200}
        accessibilityLabel="Select a search type"
        placeholder="Select a search type"
        onValueChange={(itemValue) => setSearchtype(itemValue)}
        _selectedItem={{
          bg: "cyan.600",
          endIcon: <CheckIcon size={4} />,
        }}
      >
        <Select.Item label="User" value="user" />
        <Select.Item label="Channel" value="channel" />
        <Select.Item label="Message" value="message" />
      </Select>
      <Button onPress={()=> {
        searchMsg()
      }}>Search</Button>
      
      <ScrollView>
      {searchResult ? searchResult.map((item, index) => (
        <Box
          alignSelf="center"
          key={index} 
          bg="base" 
          p={2} 
          my={2} 
          rounded="md"
          w="90%"
        >
          <HStack space={2}>
            <Avatar
              borderColor="altsub"
              borderWidth={1.5}
              source={{ uri: item.user.avatar }}
              size="md"
            /> 
            <VStack space={1}>
              <HStack space={1}>
                <Heading color="white" size="md" bold>{item.user.name}</Heading>
                <Text
                  key={index}
                  pl={1}
                  color="white" 
                  fontSize="md"   
                >
                   M/{item.address}
                </Text>
              </HStack>
              <Text 
                color="white"
                fontSize="xs"
              >
                {item.createdAt.toDate().toLocaleString()}
              </Text>
            </VStack>
          </HStack>
          <Text
            pl={10}
            pt={2}
            color="white"
            fontSize="md"
          >
            Said: {item.text}
          </Text>
        </Box>
      )) : null}

      </ScrollView>
    </View>
  )
}
export default SearchScreen
