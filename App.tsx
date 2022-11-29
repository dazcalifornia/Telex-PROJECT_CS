import * as React from 'react';


import Loader from './src/Loader';
import AppContainer from './src/Container';
import MenuDrawer from './src/components/drawer';
function App() {
  return (
    <AppContainer>
      <Loader />
    </AppContainer>
  );
}

export default App;
