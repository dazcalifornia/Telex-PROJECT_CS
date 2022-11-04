import React,{
  useState,
} from 'react';
import {
  View,
  Text,
  Select,
  CheckIcon,
  Box,
  Center,
  VStack,
} from 'native-base';

export default function DEV(props: { navigation: { navigate: any; }; }) {
  const [service, setService] = useState("");

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      bg="#D9D9D9"
      borderRadius="10px"
      w="auto"
      h="45px"
      m="15px"
    >
     <VStack alignItems="center" space={4}>

    </VStack>
      <Text>DEV</Text>
    </View>
  );
}
