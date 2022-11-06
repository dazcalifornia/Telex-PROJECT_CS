import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/homepage';
import LoginScreen from './screens/login';
import MessageTest from './screens/messageTest';
import Register from './screens/Register';
import Chat from './screens/Chat';
import UserMenu from './screens/userMenu';
import SubChatrooms from './screens/subChannel';

import DEV from './screens/dev';

import ChatMenu from './screens/chatMenu';
const Stack = createNativeStackNavigator();

import {auth} from '../../firebase';

const Loader = () => {
    
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
          mode: 'modal',
          headerMode: 'none',
            cardStyle:{
              backgroundColor:"transparent",
              opacity:0.99
            },
        headerShown: false,
      }}
    >  
        <Stack.Screen name="DEV" component={DEV} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MessageTest" component={MessageTest} />


        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="ChatMenu" component={ChatMenu} />
        <Stack.Screen name="SubChannel" component={SubChatrooms} />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="UserMenu" component={UserMenu} />
      </Stack.Group>
    </Stack.Navigator>  
  )
}

export default Loader
