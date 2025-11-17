import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStartedScreen from '../screens/Onboarding/GetStartedScreen';
import LoginScreen from '../screens/Onboarding/LoginScreen';
import UserInfoScreen from '../screens/Onboarding/UserInfoScreen';
import ConsentScreen from '../screens/Onboarding/ConsentScreen';
import CognitiveAssessmentScreen from '../screens/Onboarding/CognitiveAssessmentScreen';
import AssessmentCompleteScreen from '../screens/Onboarding/AssessmentCompleteScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="Consent" component={ConsentScreen} />
      <Stack.Screen name="CognitiveAssessment" component={CognitiveAssessmentScreen} />
      <Stack.Screen name="AssessmentComplete" component={AssessmentCompleteScreen} />
    </Stack.Navigator>
  );
}
