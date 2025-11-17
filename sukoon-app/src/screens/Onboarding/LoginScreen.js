import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { apiPost } from '../../utils/api';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const canLogin = mobile.trim().length > 0;

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await apiPost('/auth/login', { mobile: mobile.trim() });
      login(user);
    } catch (err) {
      alert(err.message || 'Login failed. Please check your mobile number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Welcome back to Sukoon</Text>
          <Text style={styles.sub}>
            Log in with your registered mobile number to continue with your
            saved profile.
          </Text>

          <InputField
            label="Mobile Number"
            placeholder="Type your mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />

          <View style={{ flex: 1 }} />

          <PrimaryButton
            title={loading ? 'Logging in...' : 'Log In'}
            disabled={!canLogin || loading}
            onPress={handleLogin}
          />

          <Text style={styles.switchText}>
            Don&apos;t have an account?{' '}
            <Text
              style={styles.switchLink}
              onPress={() => navigation.navigate('UserInfo')}
            >
              Sign up
            </Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  sub: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 24,
  },
  switchText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textDark,
  },
  switchLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
