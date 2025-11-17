// src/navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens / stacks
import HomeScreen from '../screens/Home/HomeScreen';
import ConnectStack from './ConnectStack';
import GamesStack from './GamesStack';
import ExerciseStack from './ExerciseStack';

const Stack = createNativeStackNavigator();

/**
 * Home stack:
 * - HomeMain = dashboard with cards
 * - Connect / Games / Move = existing stacks you already have
 */
export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Your main home screen with the cards */}
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* These names match what you're using in HomeScreen: */}
      <Stack.Screen name="Connect" component={ConnectStack} />
      <Stack.Screen name="Games" component={GamesStack} />
      <Stack.Screen name="Move" component={ExerciseStack} />
    </Stack.Navigator>
  );
}
