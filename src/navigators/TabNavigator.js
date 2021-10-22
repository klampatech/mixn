import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SearchStack, MixStack, RandomStack} from './StackNavigator.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: tabInfo => (
            <FontAwesome5 name="book-dead" size={25} color={'gray'} />
          ),
        }}
        name="Mix"
        component={MixStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: tabInfo => (
            <View
              style={{
                height: 75,
                width: 75,
                borderRadius: 75,
                backgroundColor: 'white',
                borderColor: 'lightgray',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
              }}>
              <FontAwesome5 name="search" size={35} color={'gray'} />
            </View>
          ),
        }}
        name="Search"
        component={SearchStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: tabInfo => (
            <FontAwesome5 name="dice" size={25} color={'gray'} />
          ),
        }}
        name="Random"
        component={RandomStack}
      />
    </Tab.Navigator>
  );
}
