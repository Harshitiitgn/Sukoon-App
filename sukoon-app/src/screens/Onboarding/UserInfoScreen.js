import React, { useState, useContext } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const genders = ['Female', 'Male', 'Other'];
const languages = ['English', 'Hindi'];

export default function UserInfoScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  const canContinue = fullName && mobile && age;

  const handleContinue = async () => {
    if (!canContinue) return;
    try {
      setLoading(true);
      const user = await apiPost('/auth/register', {
        fullName,
        mobile,
        age: Number(age),
        gender,
        preferredLanguage: language,
      });
      setUser(user);
      navigation.navigate('Consent');
    } catch (err) {
      alert(
        err.message ||
          'Could not sign up. Please try again or use a different mobile number.'
      );
    } finally {
      setLoading(false);
    }
  };

  // when the user finishes onboarding:
  const handleCompleteOnboarding = async () => {
    if (preferredLanguage === 'Hindi') {
      setLanguage('hi');
    } else {
      setLanguage('en');
    }

    // ... your existing registration / navigation logic
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
          <Text style={styles.heading}>Let&apos;s get to know you!</Text>

          <InputField
            label="Full Name"
            placeholder="Type your full name"
            value={fullName}
            onChangeText={setFullName}
          />
          <InputField
            label="Mobile Number"
            placeholder="Type your mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          <InputField
            label="Age"
            placeholder="Type your age here"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.row}>
            {genders.map(g => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.chip,
                  gender === g && styles.chipSelected,
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[
                    styles.chipText,
                    gender === g && styles.chipTextSelected,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Preferred Language</Text>
          <View style={styles.row}>
            {languages.map(l => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.chip,
                  language === l && styles.chipSelected,
                ]}
                onPress={() => setLanguage(l)}
              >
                <Text
                  style={[
                    styles.chipText,
                    language === l && styles.chipTextSelected,
                  ]}
                >
                  {l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          <PrimaryButton
            title={loading ? 'Saving...' : 'Continue'}
            disabled={!canContinue || loading}
            onPress={handleContinue}
          />
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
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 14,
    color: colors.textDark,
  },
  chipTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
});
