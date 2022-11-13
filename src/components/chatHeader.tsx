import React,{
  useEffect,
  useState,
} from 'react';
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

import {auth} from '../../firebase';

export default function ChatHeader(props:any) {
  const {userId, name, email, photoURL} = props.route.params;
  const { navigate,replace,dispatch } = props.navigation;
  const {chatName} = props.route.params;

  console.log ('chatName',chatName)
  const chatState = chatName ? chatName : 'Regular'
   return (
    <View>
      <StatusBar barStyle="light-content"/>
      <VStack safeAreaTop bg="base" px="1" py="7" 
      roundedBottom="3xl" shadow={2} 
      justifyContent="space-between"
      alignItems="center" w="100%" h="auto">
        <HStack space={4} alignItems="center" w="100%" justifyContent="space-between">
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
            dispatch(navigate('Home'))
            }
          }
        />
        <HStack space={4} alignItems="center">
        <Image source={{
          uri: photoURL
        }} alt="Profile image" ml="24px" size={54} rounded="full" />
            <Heading color="white" fontSize="2xl" fontWeight="bold">{name}</Heading>
          </HStack>
            
          <IconButton
          mr="34px"
          _icon={{
            as: Entypo,
            name: "dots-three-horizontal",
            size: 5,
            color: "subbase",
          }}
          onPress={() => navigate('ChatMenu',{
            userId: userId,
            name: name,
            email: email,
            photoURL: photoURL,
            navigation: props.navigation,
          })}
          />
        </HStack>
          <Text color="altbase" fontSize="sm" fontWeight="bold" py="1.5">You're chat on #{chatState} Channel</Text>
      </VStack>
    </View>
  );
}

