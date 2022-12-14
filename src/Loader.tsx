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
import Register from './screens/Register';
import Chat from './screens/Chat';
import UserMenu from './screens/userMenu';
import SubChatrooms from './screens/subChannel';
import Logout from './screens/logout';
import DEV from './screens/dev';

import ChatMenu from './screens/chatMenu';
import SubChListed from './screens/subChListed';
import GroupChat from './screens/groupchat';
import SearchScreen from './screens/search';


import Stations from './screens/stations';


const Stack = createStackNavigator();


const Loader = () => {
    
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        mode: 'modal',
        headerMode: 'none',
        gestureEnabled: true,
        headerShown: false,
        modalPresentationStyle: 'formSheet',
        cardStyle:{
          },
      }}
    >  
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={LoginScreen} />


        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Group screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}>
          <Stack.Screen name="ChatMenu" component={ChatMenu} />
            <Stack.Screen name="subChListed" component={SubChListed}  />
            <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Group>

        <Stack.Screen name="stations" component={Stations} />
          
        <Stack.Screen name="SubChannel" component={SubChatrooms} />
        <Stack.Screen name="GroupChat" component={GroupChat} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="logout" component={Logout} />
        <Stack.Screen name="DEV" component={DEV} />
        <Stack.Screen name="UserMenu" 
          screenOptions={{
            //make it half the screens
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
