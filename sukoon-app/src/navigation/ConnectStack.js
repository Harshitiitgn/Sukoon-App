import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectScreen from '../screens/Connect/ConnectScreen';
import CreateEventScreen from '../screens/Connect/CreateEventScreen';
import EventDetailsScreen from '../screens/Connect/EventDetailsScreen';
const Stack = createNativeStackNavigator();

export default function ConnectStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConnectMain" component={ConnectScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
}