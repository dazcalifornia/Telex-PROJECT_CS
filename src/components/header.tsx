import { 
  Box,
  View,
  Text,
  HStack,
  StatusBar,
  IconButton,
  Image,
} from 'native-base'
import React from 'react'
import { Entypo } from '@expo/vector-icons';

import {auth} from '../../firebase';

const Header = (props:{navigation:{navigate:any;};}) => {
  const {replace} = props.navigation;

  const signOut = () => {
auth.signOut().then(() => {
// Sign-out successful.
replace("Login");
}).catch((error) => {
// An error happened.
});
}
  return (
    <>
    <StatusBar barStyle="light-content" />
    <HStack safeAreaTop bg="base" px="1" py="3" 
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
            name: "log-out",
            size: 5,
            color: "subbase",
          }}
          onPress={signOut}
        />
    </HStack>
    </>
  )
}

export default Header


