import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingStack from './OnboardingStack';
import MainTabNavigator from './MainTabNavigator';
import { AuthContext } from '../context/AuthContext';
import NotFeelingWellScreen from '../screens/Health/NotFeelingWellScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isOnboarded, isRestoring } = useContext(AuthContext);

  // While we are restoring from AsyncStorage, show a simple loading screen
  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboarded ? (
        <Stack.Screen name="OnboardingStack" component={OnboardingStack} />
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      )}
      <Stack.Screen
        name="NotFeelingWell"
        component={NotFeelingWellScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
