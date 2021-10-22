import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {TabNavigator} from './src/navigators/TabNavigator';
import RNBootSplash from 'react-native-bootsplash';

export default function App() {
  return (
    <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
      <TabNavigator />
    </NavigationContainer>
  );
}
