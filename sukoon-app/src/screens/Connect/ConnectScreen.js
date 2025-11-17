// src/screens/Connect/ConnectScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import colors from '../../theme/colors';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import TopBar from '../../components/TopBar';

const EVENTS_KEY = 'sukoon_connect_events_v1';

export default function ConnectScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const json = await AsyncStorage.getItem(EVENTS_KEY);
      if (json) {
        const arr = JSON.parse(json);
        arr.sort((a, b) => {
          const dA = a.dateKey || '';
          const dB = b.dateKey || '';
          if (dA !== dB) return dA.localeCompare(dB);
          return (a.dateTime || '').localeCompare(b.dateTime || '');
        });
        setEvents(arr);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.log('Error loading connect events', err);
      setEvents([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const removeEvent = (id) => {
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
              const updated = events.filter(ev => ev.id !== id);
              setEvents(updated);
              await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
            } catch (err) {
              console.log('Error removing event', err);
              Alert.alert('Error', 'Could not remove the event.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>Sukoon Connect</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {events.length === 0 ? (
          <Text style={styles.emptyText}>
            You don’t have any Sukoon events yet. Tap “Create a Sukoon Event” to
            get started.
          </Text>
        ) : (
          events.map(ev => (
            <Card key={ev.id} style={{ marginBottom: 12 }}>
              <Text style={styles.eventTitle}>Event: {ev.title}</Text>
              <Text style={styles.eventLine}>
                Date & time: {ev.dateTime || ev.date}
              </Text>
              <Text style={styles.eventLine}>
                Location: {ev.location || 'Not set'}
              </Text>
              <Text style={styles.eventLine}>
                Contact number: {ev.contact || 'Not set'}
              </Text>

              <TouchableOpacity
                style={styles.link}
                onPress={() =>
                  navigation.navigate('EventDetails', { event: ev })
                }
              >
                <Text style={styles.linkText}>View details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteLink}
                onPress={() => removeEvent(ev.id)}
              >
                <Text style={styles.deleteText}>Remove this event</Text>
              </TouchableOpacity>
            </Card>
          ))
        )}

        <PrimaryButton
          title="Create a Sukoon Event"
          onPress={() => navigation.navigate('CreateEvent')}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
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
  eventTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventLine: {
    fontSize: 16,
    color: colors.textDark,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  deleteLink: {
    marginTop: 4,
  },
  deleteText: {
    color: colors.danger || '#D9534F',
    fontWeight: '600',
    fontSize: 15,
  },
});
