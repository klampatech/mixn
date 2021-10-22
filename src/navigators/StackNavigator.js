import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Details from '../screens/Details';
import Home from '../screens/Home';
import Ingredients from '../screens/Ingredients';
import Types from '../screens/Types';
import Category from '../screens/Category';
import List from '../screens/List';
import Results from '../screens/Results';

const Stack = createNativeStackNavigator();

export function SearchStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Category" component={Category} />
    </Stack.Navigator>
  );
}

export function MixStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Ingredients" component={Ingredients} />
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="Results" component={Results} />
    </Stack.Navigator>
  );
}

export function RandomStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Types" component={Types} />
    </Stack.Navigator>
  );
}
