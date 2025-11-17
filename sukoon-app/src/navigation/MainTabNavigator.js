// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStack from './HomeStack';              // ⬅️ use stack instead of HomeScreen
import RemindersStack from './RemindersStack';
import ProfileStack from './ProfileStack';
import HelpScreen from '../screens/Profile/HelpScreen';
import colors from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        let labelKey;
        switch (route.name) {
          case 'Home':
            labelKey = 'tab_home';
            break;
          case 'Reminders':
            labelKey = 'tab_reminders';
            break;
          case 'Help':
            labelKey = 'tab_help';
            break;
          case 'Profile':
            labelKey = 'tab_profile';
            break;
          default:
            labelKey = 'tab_home';
        }

        return {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarLabel: t(labelKey),
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E5E5E5',
            borderTopWidth: 1,
            paddingTop: 4,
            paddingBottom: insets.bottom || 8,
            height: 52 + (insets.bottom || 0),
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Reminders':
                iconName = focused ? 'alarm' : 'alarm-outline';
                break;
              case 'Help':
                iconName = focused
                  ? 'help-circle'
                  : 'help-circle-outline';
                break;
              case 'Profile':
                iconName = focused
                  ? 'person-circle'
                  : 'person-circle-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        };
      }}
    >
      {/* Home tab now uses the HomeStack */}
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Reminders" component={RemindersStack} />
      <Tab.Screen name="Help" component={HelpScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
