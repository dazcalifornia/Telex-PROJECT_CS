import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/homepage';
import LoginScreen from './screens/login';
import MessageTest from './screens/messageTest';

const Stack = createNativeStackNavigator();


const Loader = () => {
    
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MessageTest" component={MessageTest} />
    </Stack.Navigator>  
  )
}

export default Loader
