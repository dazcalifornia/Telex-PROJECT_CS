import React from 'react';
import {
  Button,
  HStack,
  Text,
  Box,
  IconButton,
} from 'native-base';

import {Entypo} from '@expo/vector-icons';
import {addFriends} from './accMenus';
export default function Menubar() {
  return (
    <>
      <Box
        space={4}
        justifyContent="center"
        alignItems="start"
        bg="#D9D9D9"
        borderRadius="10px"
        w="auto"
        h="45px"
        m="15px"
        >
        <HStack m="3px" pl="21px" space={4}>
          <IconButton
            borderRadius="15px"
            variant="solid"
            bg="altbase"
            _icon={{
              as: Entypo,
              name: "home",
              size: 5,
              color: "base",
              }}
            onPress={() => console.log('pressed Home')}
          />
            <Button
              borderRadius="15px"
              variant="solid"
              bg="#979797"
              _text={{
                color: 'black',
                fontSize: 'sm',
                fontWeight: 'bold',
              }}
              onPress={() => console.log('pressed Home')}
            >
            #home
            </Button>
            <Button
              borderRadius="15px"
              variant="solid"
              bg="#979797"
              _text={{
                color: 'black',
                fontSize: 'sm',
                fontWeight: 'bold',
              }}
              onPress={addFriends}
            >
            #addFriends
            </Button>
        </HStack>
      </Box>
    </>

  );
}

