import { 
  Box,
  View,
  Text,
  HStack,
  StatusBar,
  IconButton,
  Image,
  Modal,
  Button
} from 'native-base'
import React,{
  useState,
  useEffect,
} from 'react'
import { Entypo } from '@expo/vector-icons';

import {auth,db} from '../../firebase';


//modal import 
import {accMenus} from './accMenus';

const Header = (props:{navigation:{navigate:any;};}) => {
  
  const [modalVisible, setModalVisible] = React.useState(false);

  const {navigate} = props.navigation;

  //get user data from firebase
  const [profile, setProfile] = useState('')
  const [name, setName] = useState('')
  useEffect(() => {
    db.collection('users').doc(auth.currentUser?.uid).onSnapshot((doc) => {
      setProfile(doc.data()?.imageURL)
      setName(doc.data()?.name)
    })
  }, [profile, name])


  return (
    <>
    <StatusBar barStyle="light-content" />
    <HStack safeAreaTop px="1" py="3"
        bg="base"
        justifyContent="space-between" 
        alignItems="center" w="100%" h="165px">
        <Image source={{
          uri: auth?.currentUser?.photoURL
        }} alt="Profile image" ml="24px" size={65} rounded="full" />
        {/*/<HStack alignItems="center" ml="24px">
          //<Text color="white" fontSize="2xl" fontWeight="bold">Logo</Text>
        </HStack>/*/}
          <Text color="white" fontSize="2xl" fontWeight="bold">Hello "{auth?.currentUser?.displayName}"</Text>
        <IconButton
          mr="24px"
          borderRadius="15px"
          variant="solid"
          colorScheme="indigo"
          _icon={{
            as: Entypo,
            name: "dots-three-vertical",
            size: 5,
            color: "subbase",
          }}
          onPress={() => navigate('UserMenu')}
        />
    </HStack>
    </>
  )
}

export default Header


