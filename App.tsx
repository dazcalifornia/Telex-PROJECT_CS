import * as React from 'react';


import Loader from './src/Loader';
import AppContainer from './src/Container';
import {
  useFonts,
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_700Bold,
} from '@expo-google-fonts/prompt';
function App() {
  let [fontsLoaded] = useFonts({
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <AppContainer>
        <Loader />
      </AppContainer>
    );
  }
}

export default App;
