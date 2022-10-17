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


import { useNavigation } from '@react-navigation/native'
const Header = () => {
  return (
    <>
    <StatusBar barStyle="light-content" />
    <HStack safeAreaTop bg="base" px="1" py="3" 
        justifyContent="space-between" 
        alignItems="center" w="100%" h="165px">
        <Image source={{
          uri: 'https://source.unsplash.com/user/21plenka'
        }} alt="Profile image" ml="24px" size={65} rounded="full" />
        {/*/<HStack alignItems="center" ml="24px">
          //<Text color="white" fontSize="2xl" fontWeight="bold">Logo</Text>
        </HStack>/*/}
          <Text color="white" fontSize="2xl" fontWeight="bold">Hello "Franx"</Text>
        <IconButton
          mr="24px"
          borderRadius="15px"
          variant="solid"
          colorScheme="indigo"
          _icon={{
            as: Entypo,
            name: "dots-three-horizontal",
            size: 5,
            color: "subbase",
          }}
          onPress={() => console.log('Pressed')}
        />
    </HStack>
    </>
  )
}

export default Header


