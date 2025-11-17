// src/screens/Home/HomeScreen.js
import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import TopBar from '../../components/TopBar';
import Card from '../../components/Card';
import colors from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';

const REMINDERS_KEY = 'sukoon_reminders_v1';
const TODOS_KEY = 'sukoon_todos_v1';
const EVENTS_KEY = 'sukoon_connect_events_v1';

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomeScreen({ navigation }) {
  const { t, language } = useLanguage();
  const { user } = useContext(AuthContext);

  const [todayReminders, setTodayReminders] = useState([]);
  const [todayTodos, setTodayTodos] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);

  const loadDashboard = async () => {
    const key = todayKey();

    try {
      const rJson = await AsyncStorage.getItem(REMINDERS_KEY);
      const allReminders = rJson ? JSON.parse(rJson) : [];
      setTodayReminders(
        allReminders.filter(r => r.dateKey && r.dateKey === key)
      );
    } catch (err) {
      console.log('Error loading reminders for home', err);
      setTodayReminders([]);
    }

    try {
      const tJson = await AsyncStorage.getItem(TODOS_KEY);
      const allTodos = tJson ? JSON.parse(tJson) : [];
      setTodayTodos(allTodos.filter(t => !t.done));
    } catch (err) {
      console.log('Error loading todos for home', err);
      setTodayTodos([]);
    }

    try {
      const eJson = await AsyncStorage.getItem(EVENTS_KEY);
      const allEvents = eJson ? JSON.parse(eJson) : [];
      setTodayEvents(
        allEvents.filter(ev => ev.dateKey && ev.dateKey === key)
      );
    } catch (err) {
      console.log('Error loading events for home', err);
      setTodayEvents([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const displayName = user?.fullName?.trim();
  let greeting;
  if (displayName) {
    greeting =
      language === 'hi'
        ? `${displayName} जी, आपका स्वागत है`
        : `Welcome ${displayName} ji`;
  } else {
    greeting = t('home_greeting');
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} showClose={false} />

      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>{t('home_subtitle')}</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today at Sukoon */}
        <Card style={[styles.todayCard, styles.todayCardColored]}>
          <Text style={styles.todayTitle}>{t('home_today_title')}</Text>

          {/* Today’s reminders */}
          <Text style={styles.sectionLabel}>{t('home_today_reminders')}</Text>
          {todayReminders.length === 0 ? (
            <Text style={styles.sectionEmpty}>
              {t('home_today_no_reminders')}
            </Text>
          ) : (
            todayReminders.slice(0, 3).map(r => (
              <Text key={r.id} style={styles.sectionItem}>
                • {r.title}
                {r.time ? ` (${r.time})` : ''}
              </Text>
            ))
          )}

          {/* Today’s to-dos */}
          <Text style={styles.sectionLabel}>{t('home_today_todos')}</Text>
          {todayTodos.length === 0 ? (
            <Text style={styles.sectionEmpty}>
              {t('home_today_no_todos')}
            </Text>
          ) : (
            todayTodos.slice(0, 3).map(tItem => (
              <Text key={tItem.id} style={styles.sectionItem}>
                • {tItem.text}
              </Text>
            ))
          )}

          {/* Today’s Sukoon events */}
          <Text style={styles.sectionLabel}>{t('home_today_events')}</Text>
          {todayEvents.length === 0 ? (
            <Text style={styles.sectionEmpty}>
              {t('home_today_no_events')}
            </Text>
          ) : (
            todayEvents.slice(0, 3).map(ev => (
              <View key={ev.id} style={styles.eventBlock}>
                <Text style={styles.sectionItem}>
                  • {ev.title}
                  {ev.time ? ` (${ev.time})` : ''}
                </Text>
                {ev.location ? (
                  <Text style={styles.sectionSubItem}>
                    {t('home_today_event_venue')} {ev.location}
                  </Text>
                ) : null}
                {ev.contact ? (
                  <Text style={styles.sectionSubItem}>
                    {t('home_today_event_contact')} {ev.contact}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </Card>

        {/* NEW: Not feeling well card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NotFeelingWell')}
        >
          <Card style={[styles.card, styles.cardHealth]}>
            <View style={styles.cardIconWrapper}>
              <Ionicons
                name="medkit-outline"
                size={34}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>
                {t('home_card_health_title')}
              </Text>
              <Text style={styles.cardDescription}>
                {t('home_card_health_desc')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Sukoon Connect */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Connect')}
        >
          <Card style={[styles.card, styles.cardConnect]}>
            <View style={styles.cardIconWrapper}>
              <Ionicons
                name="chatbubbles-outline"
                size={34}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>
                {t('home_card_connect_title')}
              </Text>
              <Text style={styles.cardDescription}>
                {t('home_card_connect_desc')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Reminders */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Reminders')}
        >
          <Card style={[styles.card, styles.cardReminders]}>
            <View style={styles.cardIconWrapper}>
              <Ionicons
                name="alarm-outline"
                size={34}
                color={colors.accent}
              />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>
                {t('home_card_reminders_title')}
              </Text>
              <Text style={styles.cardDescription}>
                {t('home_card_reminders_desc')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Games */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Games')}
        >
          <Card style={[styles.card, styles.cardGames]}>
            <View style={styles.cardIconWrapper}>
              <Ionicons
                name="game-controller-outline"
                size={34}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>
                {t('home_card_games_title')}
              </Text>
              <Text style={styles.cardDescription}>
                {t('home_card_games_desc')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Move / Exercise */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Move')}
        >
          <Card style={[styles.card, styles.cardMove]}>
            <View style={styles.cardIconWrapper}>
              <Ionicons
                name="walk-outline"
                size={34}
                color={colors.accent}
              />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>
                {t('home_card_move_title')}
              </Text>
              <Text style={styles.cardDescription}>
                {t('home_card_move_desc')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Profile')}
        >
          <Card style={[styles.card, styles.cardProfile]}>
            <View style={styles.cardIconWrapper}>
              <Ionicons
                name="person-circle-outline"
                size={34}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>
                {t('home_card_profile_title')}
              </Text>
              <Text style={styles.cardDescription}>
                {t('home_card_profile_desc')}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
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
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // "Today at Sukoon" card
  todayCard: {
    marginBottom: 16,
  },
  todayCardColored: {
    backgroundColor: '#FFF8E7', // warm soft yellow/cream
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.textDark,
  },
  sectionLabel: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  sectionEmpty: {
    fontSize: 15,
    color: colors.textLight,
  },
  sectionItem: {
    fontSize: 15,
    color: colors.textDark,
  },
  sectionSubItem: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 18,
  },
  eventBlock: {
    marginBottom: 4,
  },

  // Feature cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 16,
  },
  // NEW: health card color
  cardHealth: {
    backgroundColor: '#FFEFF0', // soft health-ish pink
  },
  // Others already colored
  cardConnect: {
    backgroundColor: '#F2F4FF',
  },
  cardReminders: {
    backgroundColor: '#FFF1F2',
  },
  cardGames: {
    backgroundColor: '#F0FFF4',
  },
  cardMove: {
    backgroundColor: '#E6FBFF',
  },
  cardProfile: {
    backgroundColor: '#F9F5FF',
  },

  cardIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFAA',
    marginRight: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
});
