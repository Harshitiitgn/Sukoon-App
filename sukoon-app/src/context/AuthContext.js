import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  user: null,
  isOnboarded: false,
  setUser: () => {},
  completeOnboarding: () => {},
  login: () => {},
  logout: () => {},
  isRestoring: true,
});

const STORAGE_USER = '@sukoon_user';
const STORAGE_ONBOARDED = '@sukoon_isOnboarded';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // 1) On first load, restore from storage
  useEffect(() => {
    (async () => {
      try {
        const [userJson, onboardedFlag] = await Promise.all([
          AsyncStorage.getItem(STORAGE_USER),
          AsyncStorage.getItem(STORAGE_ONBOARDED),
        ]);

        if (userJson) {
          setUser(JSON.parse(userJson));
        }
        if (onboardedFlag === 'true') {
          setIsOnboarded(true);
        }
      } catch (err) {
        console.warn('Failed to restore auth state', err);
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  // 2) Whenever user or isOnboarded changes, save to storage
  useEffect(() => {
    if (isRestoring) return; // avoid writing while restoring

    (async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem(STORAGE_USER);
        }

        await AsyncStorage.setItem(
          STORAGE_ONBOARDED,
          isOnboarded ? 'true' : 'false'
        );
      } catch (err) {
        console.warn('Failed to persist auth state', err);
      }
    })();
  }, [user, isOnboarded, isRestoring]);

  // Called at the end of onboarding (AssessmentComplete)
  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  // Called when user logs in with existing account
  const login = (userData) => {
    setUser(userData);
    setIsOnboarded(true);
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOnboarded,
        setUser,
        completeOnboarding,
        login,
        logout,
        isRestoring,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
