import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RemindersScreen from '../screens/Reminders/RemindersScreen';
import CreateReminderScreen from '../screens/Reminders/CreateReminderScreen';
const Stack = createNativeStackNavigator();

export default function RemindersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RemindersMain" component={RemindersScreen} />
      <Stack.Screen name="CreateReminder" component={CreateReminderScreen} />
    </Stack.Navigator>
  );
}