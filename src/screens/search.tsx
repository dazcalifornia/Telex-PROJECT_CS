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
} from 'native-base'
const SearchScreen = () => {
  const [keyword, setKeyword] = useState('');
  
  //make function to search by group,category,messages 
  //and return the result
  const search = useCallback((keyword) => {
    //search by group
    //search by category
    //search by messages
    //return the result
  },[]);

  return(
    <View>
      <Text>Search Screen</Text>
      <Input placeholder="Search" />

    </View>
  )
}
export default SearchScreen
