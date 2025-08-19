import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;