import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ContactScreen from '../screens/ContactScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: '#4CAF50',  // Green active icon
    tabBarInactiveTintColor: '#888',
    tabBarStyle: {
      backgroundColor: '#ffffff',
      borderTopColor: '#ddd',
    },
  }}
>

      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
