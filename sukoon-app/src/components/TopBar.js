// src/components/TopBar.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../theme/colors';

// From MainTabNavigator
const PROFILE_TAB_NAME = 'Profile';
// From ProfileStack
const SOS_ROUTE_NAME = 'SOS';

export default function TopBar({ navigation, showClose = true }) {
  const handleClose = () => {
    if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSOS = () => {
    if (!navigation) return;

    const currentState = navigation.getState ? navigation.getState() : null;
    const currentRouteNames = currentState?.routeNames || [];

    // ✅ Case 1: we are inside ProfileStack (its routeNames include "SOS")
    // e.g. ProfileMain, EditProfile, Help, etc.
    if (currentRouteNames.includes(SOS_ROUTE_NAME)) {
      navigation.navigate(SOS_ROUTE_NAME);
      return;
    }

    // ✅ Case 2: we are in the bottom tab navigator (Home, Reminders, Games, Move, Profile)
    // routeNames include "Profile"
    if (currentRouteNames.includes(PROFILE_TAB_NAME)) {
      navigation.navigate(PROFILE_TAB_NAME, { screen: SOS_ROUTE_NAME });
      return;
    }

    // ✅ Case 3: walk up through parents (e.g. we’re inside RemindersStack, GamesStack, etc.)
    let nav = navigation;
    while (nav && nav.getParent) {
      const parent = nav.getParent();
      if (!parent) break;

      const state = parent.getState ? parent.getState() : null;
      const routeNames = state?.routeNames || [];

      // If this parent is the tab navigator with "Profile" tab
      if (routeNames.includes(PROFILE_TAB_NAME)) {
        parent.navigate(PROFILE_TAB_NAME, { screen: SOS_ROUTE_NAME });
        return;
      }

      // If this parent directly knows an SOS route (unlikely, but safe)
      if (routeNames.includes(SOS_ROUTE_NAME)) {
        parent.navigate(SOS_ROUTE_NAME);
        return;
      }

      nav = parent;
    }

    // 🚨 Fallback: nothing matched → avoid React Navigation warning, show a clean message
    try {
      navigation.navigate(SOS_ROUTE_NAME);
    } catch (e) {
      Alert.alert(
        'SOS',
        'SOS triggered (prototype). Navigation to SOS is not available on this screen.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Bigger SOS button on top-left */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* Bigger close / undo on top-right */}
      {showClose && (
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  sosButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sosText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
  closeText: {
    fontSize: 22,
    color: colors.textDark,
    fontWeight: '700',
  },
});
