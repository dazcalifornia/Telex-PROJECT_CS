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
    console.log('Data:',keyword,searchtype,chatId)
    db.collection('Chatroom').doc(chatId).collection('messages').where('text','==',keyword).get().then((querySnapshot) => {
      setSearchResult(querySnapshot.docs.map(doc => doc.data()))
    }).then(()=>{
      console.log('searchResult',searchResult);
    })
  }
  

  return(
    <View>
      <Text>Search Screen</Text>
      <Input 
        placeholder="Search" 
        value={keyword}
        onChangeText={setKeyword}
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
      <Button onPress={()=>{Search({
        keyword:keyword,
        prompt:searchtype,
        chatId:chatId,
      })}}>Search</Button>
    </View>
  )
}
export default SearchScreen
