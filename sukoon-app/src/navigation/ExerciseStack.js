import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoveAndBreatheScreen from '../screens/Exercise/MoveAndBreatheScreen';
import ExercisePlayerScreen from '../screens/Exercise/ExercisePlayerScreen';
const Stack = createNativeStackNavigator();

export default function ExerciseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoveMain" component={MoveAndBreatheScreen} />
      <Stack.Screen name="ExercisePlayer" component={ExercisePlayerScreen} />
    </Stack.Navigator>
  );
}