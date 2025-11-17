// src/navigation/GamesStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GamesMenuScreen from '../screens/Games/GamesMenuScreen';
import TicTacToeScreen from '../screens/Games/TicTacToeScreen';
import OddOneOutScreen from '../screens/Games/OddOneOutScreen';
import CardMatchScreen from '../screens/Games/CardMatchScreen';
import ShoppingListGameScreen from '../screens/Games/ShoppingListGameScreen';

const Stack = createNativeStackNavigator();

export default function GamesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GamesMenu" component={GamesMenuScreen} />
      <Stack.Screen name="TicTacToe" component={TicTacToeScreen} />
      <Stack.Screen name="OddOneOut" component={OddOneOutScreen} />
      <Stack.Screen name="CardMatch" component={CardMatchScreen} />
      <Stack.Screen
        name="ShoppingListGame"
        component={ShoppingListGameScreen}
      />
    </Stack.Navigator>
  );
}
