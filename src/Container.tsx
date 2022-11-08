import { NativeBaseProvider } from 'native-base'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import theme from './theme'
import {LinearGradient} from 'expo-linear-gradient';

type Props = {
    children: React.ReactNode;
}


const AppContainer = (props: Props) => {
  return (
    <NavigationContainer>
        <NativeBaseProvider 
        theme={theme}
      
        >{props.children}
      </NativeBaseProvider>
    </NavigationContainer>

  )
}

export default AppContainer
