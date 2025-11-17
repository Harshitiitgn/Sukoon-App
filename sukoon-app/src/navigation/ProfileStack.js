import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import MedicalRecordsScreen from '../screens/Profile/MedicalRecordsScreen';
import MyProgressScreen from '../screens/Profile/MyProgressScreen';
import HelpScreen from '../screens/Profile/HelpScreen';
import SosScreen from '../screens/SOS/SosScreen';
const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
      <Stack.Screen name="MyProgress" component={MyProgressScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="SOS" component={SosScreen} />
    </Stack.Navigator>
  );
}