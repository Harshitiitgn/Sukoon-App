// src/screens/Connect/CreateEventScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import TopBar from '../../components/TopBar';

const EVENTS_KEY = 'sukoon_connect_events_v1';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CreateEventScreen({ navigation }) {
  const now = new Date();

  // basic text fields
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  // date picks
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth()); // 0–11
  const [year, setYear] = useState(now.getFullYear());

  // time picks (simple, elder-friendly)
  const [hour, setHour] = useState(5);    // 1–12
  const [minute, setMinute] = useState(0); // 0, 15, 30, 45
  const [ampm, setAmpm] = useState('pm'); // 'am' | 'pm'

  const years = [];
  for (let y = now.getFullYear(); y <= now.getFullYear() + 5; y++) {
    years.push(y);
  }

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const maxDay = daysInMonth(year, month);
  const days = [];
  for (let d = 1; d <= maxDay; d++) {
    days.push(d);
  }

  const minuteOptions = [0, 15, 30, 45];

  const buildDateKey = () => {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const buildDateTimeLabel = () => {
    const dayLabel = `${day}`;
    const monthLabel = MONTH_NAMES[month];
    const yearLabel = `${year}`;

    const mm = String(minute).padStart(2, '0');
    return `${dayLabel} ${monthLabel} ${yearLabel}, ${hour}:${mm} ${ampm.toUpperCase()}`;
  };

  const buildTimeLabel = () => {
    const mm = String(minute).padStart(2, '0');
    return `${hour}:${mm} ${ampm.toUpperCase()}`;
  };

  const onSave = async () => {
    const titleTrim = title.trim();
    if (!titleTrim) {
      Alert.alert('Missing event name', 'Please enter the event name.');
      return;
    }

    const dateKey = buildDateKey();
    const dateTimeLabel = buildDateTimeLabel();
    const timeLabel = buildTimeLabel();

    const newEvent = {
      id: Date.now().toString(),
      title: titleTrim,
      location: location.trim(),
      contact: contact.trim(),
      dateKey,         // for "today" matching on Home
      dateTime: dateTimeLabel,
      time: timeLabel, // easier for reminders
    };

    try {
      const json = await AsyncStorage.getItem(EVENTS_KEY);
      const arr = json ? JSON.parse(json) : [];
      arr.push(newEvent);
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(arr));
      navigation.goBack();
    } catch (err) {
      console.log('Error saving event', err);
      Alert.alert(
        'Could not save',
        'Something went wrong while saving your event.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>Create a Sukoon Event</Text>

      <InputField
        label="Event"
        placeholder="e.g. Kirtan"
        value={title}
        onChangeText={setTitle}
      />

      {/* DATE PICKERS */}
      <Text style={styles.label}>Date</Text>
      <View style={styles.pickerRow}>
        {/* Day */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Day</Text>
          <Picker
            selectedValue={day}
            onValueChange={setDay}
            style={styles.picker}
          >
            {days.map(d => (
              <Picker.Item key={d} label={String(d)} value={d} />
            ))}
          </Picker>
        </View>

        {/* Month */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Month</Text>
          <Picker
            selectedValue={month}
            onValueChange={value => {
              setMonth(value);
              // clamp day to new max
              const newMax = daysInMonth(year, value);
              if (day > newMax) setDay(newMax);
            }}
            style={styles.picker}
          >
            {MONTH_NAMES.map((m, index) => (
              <Picker.Item key={m} label={m} value={index} />
            ))}
          </Picker>
        </View>

        {/* Year */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Year</Text>
          <Picker
            selectedValue={year}
            onValueChange={value => {
              setYear(value);
              const newMax = daysInMonth(value, month);
              if (day > newMax) setDay(newMax);
            }}
            style={styles.picker}
          >
            {years.map(y => (
              <Picker.Item key={y} label={String(y)} value={y} />
            ))}
          </Picker>
        </View>
      </View>

      {/* TIME PICKERS */}
      <Text style={styles.label}>Time</Text>
      <View style={styles.pickerRow}>
        {/* Hour */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Hour</Text>
          <Picker
            selectedValue={hour}
            onValueChange={setHour}
            style={styles.picker}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <Picker.Item key={h} label={String(h)} value={h} />
            ))}
          </Picker>
        </View>

        {/* Minute */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Minute</Text>
          <Picker
            selectedValue={minute}
            onValueChange={setMinute}
            style={styles.picker}
          >
            {minuteOptions.map(m => (
              <Picker.Item
                key={m}
                label={String(m).padStart(2, '0')}
                value={m}
              />
            ))}
          </Picker>
        </View>

        {/* AM/PM */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>AM / PM</Text>
          <Picker
            selectedValue={ampm}
            onValueChange={setAmpm}
            style={styles.picker}
          >
            <Picker.Item label="AM" value="am" />
            <Picker.Item label="PM" value="pm" />
          </Picker>
        </View>
      </View>

      <InputField
        label="Location"
        placeholder="Kudasan Park"
        value={location}
        onChangeText={setLocation}
      />
      <InputField
        label="Contact Number"
        placeholder="7565143643"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />

      <View style={{ flex: 1 }} />

      <PrimaryButton title="Save Event" onPress={onSave} />
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
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  picker: {
    width: '100%',
  },
});
