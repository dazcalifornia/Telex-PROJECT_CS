import React,{
  useState,
  useEffect,
} from 'react';
import Chat from './screens/Chat';

import {
    createDrawerNavigator,
    DrawerContentScrollView,
} from '@react-navigation/drawer';

import {Entypo} from '@expo/vector-icons';

import {
    Icon,
    Text,
    HStack,
    VStack,
    Box,
    Pressable,
    HamburgerIcon,
    Button,
    Input,
    FormControl
  } from 'native-base';

global.__reanimatedWorkletInit = () => {};

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space={4} p={4} alignItems="center">
        <HStack space={2} alignItems="center">
          <Icon as={<Entypo name="user" />} size="sm" />
          <Text fontSize="lg" bold>
            John Doe
          </Text>
        </HStack>
        <FormControl>
          <FormControl.Label>Search</FormControl.Label>
          <Input />
        </FormControl>
      </VStack>
    </DrawerContentScrollView>
  );
};
const Home = () => {
  return (
    <VStack flex={1} alignItems="center" justifyContent="center">
      <Text>Home Screen</Text>
    </VStack>
  );
};
const MenuDrawer = () => {
  return(
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        >
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="Chat" component={Home} />
      </Drawer.Navigator>

  )
}
export default MenuDrawer
