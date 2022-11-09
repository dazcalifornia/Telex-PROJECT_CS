import * as React from 'react'
{/*import { 
  createNativeStackNavigator,
  } from '@react-navigation/native-stack'; */}
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import 'react-native-gesture-handler';



import HomeScreen from './screens/homepage';
import LoginScreen from './screens/login';
import MessageTest from './screens/messageTest';
import Register from './screens/Register';
import Chat from './screens/Chat';
import UserMenu from './screens/userMenu';
import SubChatrooms from './screens/subChannel';
import Logout from './screens/logout';
import DEV from './screens/dev';

import ChatMenu from './screens/chatMenu';


const Stack = createStackNavigator();

import {auth} from '../../firebase';

const Loader = () => {
    
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        mode: 'modal',
        headerMode: 'none',
        gestureEnabled: true,
        headerShown: false,
      }}
    >  
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MessageTest" component={MessageTest} />


        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="ChatMenu" component={ChatMenu} />
        <Stack.Screen name="SubChannel" component={SubChatrooms} />

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="logout" component={Logout} />
        <Stack.Screen name="DEV" component={DEV} />
        <Stack.Screen name="UserMenu" 
          screenOptions={{
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalSlideFromBottomIOS,
            ...TransitionPresets.RevealFromBottomAndroid
          }} 
          component={UserMenu} />
      </Stack.Group>
    </Stack.Navigator>  
  )
}

export default Loader
