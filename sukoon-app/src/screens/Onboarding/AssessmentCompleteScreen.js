import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';

export default function AssessmentCompleteScreen({ navigation }) {
  const { completeOnboarding } = useContext(AuthContext);

  const onContinue = () => {
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Done</Text>
      <Text style={styles.body}>
        You did great! Thank you for completing your Sukoon check.
        Your results have been saved successfully.
      </Text>
      <Text style={styles.body}>
        We&apos;ll use this to create activities that keep your mind happy and active.
      </Text>

      <View style={{ flex: 1 }} />

      <PrimaryButton title="Continue" onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
    marginBottom: 8,
  },
});