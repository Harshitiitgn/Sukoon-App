import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';

export default function ConsentScreen({ navigation }) {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Before we begin...</Text>
      <Text style={styles.body}>
        Sukoon includes a few questions to understand how your mind works.
        This helps us tailor exercises just for you.
      </Text>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setChecked(!checked)}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxText}>
          I understand and agree to continue.
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title="Continue"
        disabled={!checked}
        onPress={() => navigation.navigate('CognitiveAssessment')}
      />
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 15,
    color: colors.textDark,
    flex: 1,
  },
});