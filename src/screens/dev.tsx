import React,{
  useState,
} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { 
  NativeBaseProvider, 
  Button,
  Center, 
  Box, 
  Select, 
  CheckIcon, 
  Card,
  Container,
  FormControl,
  HStack,
  Menu,
  } from 'native-base';
import Constants from 'expo-constants';
export default function DEV(props: { navigation: { navigate: any; }; }) {
  const [value, setValue] = useState("");

  return (
  <>
   <Menu.Group title="Free">
          <Menu.Item>Arial</Menu.Item>
          <Menu.Item>Nunito Sans</Menu.Item>
          <Menu.Item>Roboto</Menu.Item>
        </Menu.Group>
        <Divider mt="3" w="100%" />
        <Menu.Group title="Paid">
          <Menu.Item>SF Pro</Menu.Item>
          <Menu.Item>Helvetica</Menu.Item>
        </Menu.Group>
      </Menu>
      </>
    );
}


