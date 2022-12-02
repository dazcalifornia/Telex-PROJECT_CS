import React,{
    useState,
    useEffect
} from 'react';
import { auth, db } from '../../../firebase';
  
import firebase from 'firebase/compat/app';


//rework this shit
//->get propmt to search in subchannel or main channel 
//->get prompt to search in all subchannel or specific subchannel 
//->get prompt to search in all chatroom or specific chatroom 

const Search = (props:{keyword:string,chatId:string,prompt:string}) => {
  const {keyword,chatId,prompt} = props;
  const [searchResult, setSearchResult] = useState([]);
  console.log('Data:',keyword,prompt,chatId)
  db.collection('Chatroom').doc(chatId).collection('messages').where('text','==',keyword).get().then((querySnapshot) => {
    setSearchResult(querySnapshot.docs.map(doc => doc.data()))
  }).then(()=>{
    console.log('searchResult',searchResult);
  })
}
export {Search}








