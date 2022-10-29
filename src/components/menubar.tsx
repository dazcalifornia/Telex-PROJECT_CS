import React from 'react';
import {
  Button,
  HStack,
  Text,
  Box,
  IconButton,
} from 'native-base';

import {Entypo} from '@expo/vector-icons';

export default function Menubar() {
  return (
    <>
      <Box
        space={4} 
        alignItems="center" 
        bg="#D9D9D9"
        mx="15px"
        my="10px"
        mt="11px"
        h="41px"
        w="100%"
        borderRadius="10px"
        >
      <HStack 
      >

      <IconButton
          mr="24px"
          borderRadius="15px"
          variant="solid"
          colorScheme="indigo"
          _icon={{
            as: Entypo,
            name: "home",
            size: 5,
            color: "subbase",
          }}
          onPress={console.log("HOME")}
        />
      </HStack>
      </Box>
    </>

  );
}

