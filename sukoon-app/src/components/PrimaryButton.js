import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function PrimaryButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 18, // increased from 12
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20, // increased from 16 or 18
    fontWeight: '700',
    color: '#FFF',
  },
});