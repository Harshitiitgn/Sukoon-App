import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import TopBar from '../../components/TopBar';

const CATEGORIES = ['Medicine', 'Events', 'Other activities', 'Food/Water'];
const REPEATS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const REMINDERS_KEY = 'sukoon_reminders_v1';

export default function CreateReminderScreen({ navigation, route }) {
  // Date for which we are creating the reminder (e.g. "2025-11-15")
  const dateKey = route?.params?.dateKey;

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('11:00 a.m.');
  const [category, setCategory] = useState('Medicine');
  const [repeat, setRepeat] = useState('Daily');

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Reminder', 'Please enter what you want to remember.');
      return;
    }

    if (!dateKey) {
      Alert.alert(
        'Reminder',
        'Something went wrong with the date. Please go back and open this screen from the calendar again.'
      );
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      title: title.trim(),
      time: time.trim(),
      category,
      repeat,
      dateKey, // "YYYY-MM-DD"
    };

    try {
      const existingJson = await AsyncStorage.getItem(REMINDERS_KEY);
      const existing = existingJson ? JSON.parse(existingJson) : [];
      const updated = [...existing, newReminder];

      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));

      navigation.goBack();
    } catch (err) {
      console.log('Error saving reminder', err);
      Alert.alert('Error', 'Could not save the reminder. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>Set a reminder</Text>

      <InputField
        label="Reminder"
        placeholder="e.g. B.P. medicine"
        value={title}
        onChangeText={setTitle}
      />
      <InputField
        label="Time"
        placeholder="11:00 a.m."
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.rowWrap}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[
              styles.chip,
              category === c && styles.chipSelected,
            ]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[
                styles.chipText,
                category === c && styles.chipTextSelected,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Repeat</Text>
      <View style={styles.rowWrap}>
        {REPEATS.map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.chip,
              repeat === r && styles.chipSelected,
            ]}
            onPress={() => setRepeat(r)}
          >
            <Text
              style={[
                styles.chipText,
                repeat === r && styles.chipTextSelected,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <PrimaryButton title="Save Reminder" onPress={onSave} />
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 8,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 16,
    color: colors.textDark,
  },
  chipTextSelected: {
    fontWeight: '600',
  },
});
