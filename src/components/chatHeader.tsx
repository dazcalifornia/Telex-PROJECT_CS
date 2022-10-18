import * as React from 'react';
import {
  Text,
  View,
  Box,
  Heading,
  StatusBar,
  HStack,
  VStack,
  IconButton,
  Image,
} from 'native-base';
import { Entypo } from '@expo/vector-icons';
import {
  CommonActions,
} from '@react-navigation/native';

import {auth} from '../../firebase';

export default function ChatHeader(props:{navigation:{navigate:any};}) {
  //sign out
   const signOut = () => {
    auth.signOut().then(() => {
    // Sign-out successful.
        props.navigate.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
}  return (
    <View>
      <StatusBar barStyle="light-content"/>
      <HStack safeAreaTop bg="base" px="1" py="3" 
      justifyContent="space-between"
      alignItems="center" w="100%" h="134px"
      >
        <IconButton
          ml="34px"
          _icon={{
            as: Entypo,
            name: "chevron-left",
            size: 5,
            color: "subbase",
          }}
          onPress={() =>{ 
            console.log('go Back')
            goBack()
            }
          }
        />
        <Image source={{
          uri: 'https://source.unsplash.com/user/21plenka'
        }} alt="Profile image" ml="18px" size={54} rounded="full" />
          <VStack>
            <Heading color="white" fontSize="2xl" fontWeight="bold">Franx</Heading>
            <Text color="subbase" fontSize="sm" fontWeight="bold">Online</Text>
          </VStack>
        <IconButton
          mr="34px"
          _icon={{
            as: Entypo,
            name: "dots-three-horizontal",
            size: 5,
            color: "subbase",
          }}
          onPress={() =>{signOut()}}
          />
      </HStack>
    </View>
  );
}

