import { NativeBaseProvider } from 'native-base'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import theme from '../theme'


type Props = {
    children: React.ReactNode;
}
const AppContainer = (props: Props) => {
  return (
    <NavigationContainer>
        <NativeBaseProvider theme={theme}>{props.children}</NativeBaseProvider>
    </NavigationContainer>

  )
}

export default AppContainer