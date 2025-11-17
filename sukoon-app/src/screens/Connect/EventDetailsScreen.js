// src/screens/Connect/EventDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';

const REMINDERS_KEY = 'sukoon_reminders_v1';
const EVENTS_KEY = 'sukoon_connect_events_v1';

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;

  const onAddToReminders = async () => {
    try {
      const json = await AsyncStorage.getItem(REMINDERS_KEY);
      const reminders = json ? JSON.parse(json) : [];

      const newReminder = {
        id: `event_${event.id}`,
        title: event.title,
        time: event.time || '',
        category: 'Event',
        repeat: 'Once',
        dateKey: event.dateKey || null,
      };

      reminders.push(newReminder);
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));

      Alert.alert('Added', 'This event has been added to your reminders.');
    } catch (err) {
      console.log('Error adding event to reminders', err);
      Alert.alert('Error', 'Could not add event to reminders.');
    }
  };

  const onCallHost = () => {
    Alert.alert('Call host', `Calling ${event.contact} (placeholder)`);
  };

  const onDeleteEvent = () => {
    Alert.alert(
      'Remove event',
      'Are you sure you want to remove this Sukoon event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const json = await AsyncStorage.getItem(EVENTS_KEY);
              const arr = json ? JSON.parse(json) : [];
              const updated = arr.filter(e => e.id !== event.id);
              await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
              navigation.goBack(); // back to Connect list, which reloads
            } catch (err) {
              console.log('Error deleting event', err);
              Alert.alert('Error', 'Could not delete this event.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>Event Details</Text>

      <Card>
        <Text style={styles.line}>Event: {event.title}</Text>
        <Text style={styles.line}>
          Date & time: {event.dateTime || event.date}
        </Text>
        <Text style={styles.line}>Location: {event.location}</Text>
        <Text style={styles.line}>Contact number: {event.contact}</Text>
      </Card>

      <PrimaryButton title="Call the host" onPress={onCallHost} />
      <PrimaryButton title="Add to my Reminders" onPress={onAddToReminders} />
      <PrimaryButton
        title="Delete this Event"
        onPress={onDeleteEvent}
        style={{ marginTop: 8, backgroundColor: colors.danger || '#D9534F' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  line: {
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 4,
  },
});
