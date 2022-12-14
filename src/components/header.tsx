import { 
  Box,
  View,
  Text,
  HStack,
  StatusBar,
  IconButton,
  Image,
  Modal,
  Button,
  VStack,
  Avatar
} from 'native-base'
import React,{
  useState,
  useEffect,
} from 'react'
import { Entypo } from '@expo/vector-icons';

import {auth,db} from '../../firebase';


//modal import 

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

  const [userStatus, setUserStatus] = useState('')
  useEffect(() => {
     db.collection('users').doc(auth.currentUser?.uid).onSnapshot((doc) => {
        setUserStatus(doc.data()?.status)
      })
  }, [userStatus])

  console.log(userStatus)
        


  return (
    <>
    <StatusBar barStyle="light-content" />
    <HStack
        roundedBottom="35px"
        safeAreaTop px="1" py="3"
        bg="base"
        justifyContent="space-between" 
        alignItems="center" w="100%" h="165px">
        <Avatar
          source={{
            uri: auth?.currentUser?.photoURL
          }}
          alt="Profile image"
          ml="24px"
          size={65}
          rounded="full"
        />
        {/* <Image source={{
          uri: auth?.currentUser?.photoURL
        }} alt="Profile image" ml="24px" size={65} rounded="full" /> */}
        {/*/<HStack alignItems="center" ml="24px">
          //<Text color="white" fontSize="2xl" fontWeight="bold">Logo</Text>
        </HStack>/*/}
        <VStack alignItems="center" >
          <Text isTruncated maxW={200} color="white" fontSize="2xl" fontFamily={"heading"} fontWeight="700" >Hello "{name}"</Text>
          <Text isTruncated color="altbase" maxW={230} fontWeight="700">{userStatus}</Text>
        </VStack>
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


