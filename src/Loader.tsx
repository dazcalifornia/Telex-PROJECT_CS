import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/homepage';
import LoginScreen from './screens/login';
import MessageTest from './screens/messageTest';
import Register from './screens/Register';
import Chat from './screens/Chat';
const Stack = createNativeStackNavigator();


const Loader = () => {
    
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MessageTest" component={MessageTest} />
        <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>  
  )
}

export default Loader
