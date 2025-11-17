// src/screens/Profile/MyProgressScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart } from 'react-native-chart-kit';

import colors from '../../theme/colors';
import TopBar from '../../components/TopBar';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

const TODOS_KEY = 'sukoon_todos_v1';
const SHOPPING_SESSIONS_KEY = 'sukoon_shopping_game_sessions_v1';
const EXERCISE_SESSIONS_KEY = 'sukoon_exercise_sessions_v1';
const NOTES_KEY = 'sukoon_monthly_notes_v1';

const MONTH_NAMES_EN = [
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

const MONTH_NAMES_HI = [
  'जनवरी',
  'फ़रवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

const DEV_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const toDevanagariDigits = value =>
  String(value).replace(/[0-9]/g, d => DEV_DIGITS[Number(d)]);

function getMonthKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`; // e.g. "2025-11"
}

export default function MyProgressScreen({ navigation }) {
  const { language } = useLanguage();

  const now = new Date();
  const monthKey = getMonthKey(now);
  const monthIndex = now.getMonth();
  const year = now.getFullYear();
  const monthLabel =
    language === 'hi'
      ? `${MONTH_NAMES_HI[monthIndex]} ${toDevanagariDigits(year)}`
      : `${MONTH_NAMES_EN[monthIndex]} ${year}`;

  const [todoStats, setTodoStats] = useState({
    created: 0,
    completed: 0,
  });

  const [shoppingDaily, setShoppingDaily] = useState([]); // [{day, bestScore}]
  const [exerciseDaily, setExerciseDaily] = useState([]); // [{day, count}]

  const [allNotes, setAllNotes] = useState({});
  const [doctorNote, setDoctorNote] = useState('');
  const currentNoteEntry = allNotes[monthKey] || null;

  // ===== Load all stats (memoised so it can be used in effects) =====
  const loadAll = useCallback(async () => {
    const mk = monthKey;

    // 1) To-do stats for this month
    try {
      const tJson = await AsyncStorage.getItem(TODOS_KEY);
      const todos = tJson ? JSON.parse(tJson) : [];
      let created = 0;
      let completed = 0;

      todos.forEach(todo => {
        if (todo.createdAt && todo.createdAt.slice(0, 7) === mk) {
          created += 1;
        }
        if (todo.completedAt && todo.completedAt.slice(0, 7) === mk) {
          completed += 1;
        }
      });

      setTodoStats({ created, completed });
    } catch (err) {
      console.log('Error loading todos for progress', err);
      setTodoStats({ created: 0, completed: 0 });
    }

    // 2) Shopping / match game daily scores
    try {
      const sJson = await AsyncStorage.getItem(SHOPPING_SESSIONS_KEY);
      const sessions = sJson ? JSON.parse(sJson) : [];

      const byDay = {}; // { '1': bestScore }
      sessions.forEach(s => {
        if (!s.dateKey || typeof s.score !== 'number') return;
        if (s.dateKey.slice(0, 7) !== mk) return;

        const dayStr = s.dateKey.slice(8, 10); // '01'..'31'
        const dayNum = Number(dayStr);
        if (!byDay[dayNum] || s.score > byDay[dayNum]) {
          byDay[dayNum] = s.score;
        }
      });

      const dailyArr = Object.keys(byDay)
        .map(d => ({ day: Number(d), bestScore: byDay[Number(d)] }))
        .sort((a, b) => a.day - b.day);

      setShoppingDaily(dailyArr);
    } catch (err) {
      console.log('Error loading shopping sessions', err);
      setShoppingDaily([]);
    }

    // 3) Exercise sessions per day
    try {
      const eJson = await AsyncStorage.getItem(EXERCISE_SESSIONS_KEY);
      const sessions = eJson ? JSON.parse(eJson) : [];

      const countByDay = {}; // { '1': count }
      sessions.forEach(s => {
        if (!s.dateKey) return;
        if (s.dateKey.slice(0, 7) !== mk) return;

        const dayStr = s.dateKey.slice(8, 10);
        const dayNum = Number(dayStr);
        countByDay[dayNum] = (countByDay[dayNum] || 0) + 1;
      });

      const dailyArr = Object.keys(countByDay)
        .map(d => ({ day: Number(d), count: countByDay[Number(d)] }))
        .sort((a, b) => a.day - b.day);

      setExerciseDaily(dailyArr);
    } catch (err) {
      console.log('Error loading exercise sessions', err);
      setExerciseDaily([]);
    }

    // 4) Doctor / family note
    try {
      const nJson = await AsyncStorage.getItem(NOTES_KEY);
      const notesObj = nJson ? JSON.parse(nJson) : {};
      setAllNotes(notesObj);
      const entry = notesObj[mk];
      setDoctorNote(entry?.note || '');
    } catch (err) {
      console.log('Error loading monthly notes', err);
      setAllNotes({});
      setDoctorNote('');
    }
  }, [monthKey]);

  // Initial load when component mounts
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Reload whenever MyProgress screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  const handleSaveNote = async () => {
    const mk = monthKey;
    const trimmed = doctorNote.trim();

    const updated = {
      ...allNotes,
      [mk]: {
        note: trimmed,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      setAllNotes(updated);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));

      if (language === 'hi') {
        Alert.alert(
          'नोट सेव हो गया',
          'इस महीने का नोट सुरक्षित कर लिया गया है।'
        );
      } else {
        Alert.alert('Note saved', 'Your monthly note has been saved.');
      }
    } catch (err) {
      console.log('Error saving monthly note', err);
    }
  };

  // ===== Feedback text (uses todos + activity in both graphs) =====
  const buildFeedbackText = () => {
    const { created, completed } = todoStats;
    const todoRate = created > 0 ? completed / created : 0;

    const daysWithShopping = shoppingDaily.length;
    const daysWithExercise = exerciseDaily.length;

    let level = 'low';

    if (
      created >= 5 &&
      todoRate >= 0.7 &&
      daysWithShopping + daysWithExercise >= 8
    ) {
      level = 'high';
    } else if (
      created > 0 ||
      daysWithShopping > 0 ||
      daysWithExercise > 0
    ) {
      level = 'ok';
    }

    if (language === 'hi') {
      if (level === 'high') {
        return 'बहुत बढ़िया! इस महीने आपने ज़्यादातर काम पूरे किए, दिमाग़ी खेल खेले और शरीर को भी चलाया। इसी तरह जारी रखें 😊';
      } else if (level === 'ok') {
        return 'आप अच्छा कर रहे हैं। अगर हो सके तो कुछ और काम पूरे करें और हल्की कसरत या खेल को रोज़ की आदत बनाएं।';
      }
      return 'यह महीना थोड़ा शांत लग रहा है। अगर ऊर्जा कम महसूस हो रही हो तो हल्की स्ट्रेचिंग, टहलना या किसी अपने से बात करना मदद कर सकता है।';
    } else {
      if (level === 'high') {
        return 'Wonderful! This month you completed many tasks, played brain games, and kept your body moving. Keep it up 😊';
      } else if (level === 'ok') {
        return 'You are doing alright. Try to complete a few more tasks and make gentle movement or games part of your routine.';
      }
      return 'This month looks a bit quiet. If you feel low on energy, some light stretching, walking, or talking to someone you trust may help.';
    }
  };

  const renderTodoSummaryLine = () => {
    const { created, completed } = todoStats;
    if (created === 0 && completed === 0) {
      return language === 'hi'
        ? 'इस महीने अभी तक कोई काम ट्रैक नहीं हुआ है।'
        : 'No tracked to-dos for this month yet.';
    }

    if (language === 'hi') {
      return `इस महीने आपने ${toDevanagariDigits(
        created
      )} काम जोड़े और ${toDevanagariDigits(completed)} पूरे किए।`;
    }
    return `This month you added ${created} to-dos and completed ${completed}.`;
  };

  const shoppingSummaryLine = () => {
    if (shoppingDaily.length === 0) {
      return language === 'hi'
        ? 'इस महीने अभी तक शॉपिंग / मैच गेम नहीं खेला गया है।'
        : 'No shopping/match games played this month.';
    }
    const days = shoppingDaily.length;
    const bestOverall = Math.max(...shoppingDaily.map(d => d.bestScore));

    if (language === 'hi') {
      return `आपने इस महीने ${toDevanagariDigits(
        days
      )} दिन यह खेल खेला। सबसे अच्छा स्कोर: ${toDevanagariDigits(
        bestOverall
      )}।`;
    }
    return `You played this game on ${days} day(s) this month. Best score: ${bestOverall}.`;
  };

  const exerciseSummaryLine = () => {
    if (exerciseDaily.length === 0) {
      return language === 'hi'
        ? 'इस महीने अभी तक कोई व्यायाम सत्र दर्ज नहीं हुआ है।'
        : 'No exercise sessions recorded this month.';
    }
    const days = exerciseDaily.length;
    const totalSessions = exerciseDaily.reduce(
      (sum, d) => sum + d.count,
      0
    );

    if (language === 'hi') {
      return `आपने इस महीने ${toDevanagariDigits(
        days
      )} दिन व्यायाम किया (कुल ${toDevanagariDigits(
        totalSessions
      )} सत्र)।`;
    }
    return `You exercised on ${days} day(s) this month (total ${totalSessions} session(s)).`;
  };

  const doctorTitle =
    language === 'hi'
      ? 'डॉक्टर / परिवार की मासिक टिप्पणी'
      : 'Doctor / family monthly note';

  const doctorPlaceholder =
    language === 'hi'
      ? 'इस महीने के बारे में छोटा नोट लिखें — स्वास्थ्य, मूड, नींद…'
      : 'Write a short note about this month — health, mood, sleep…';

  const saveButtonLabel =
    language === 'hi' ? 'नोट सेव करें' : 'Save note';

  const myProgressTitle =
    language === 'hi' ? 'मेरी प्रगति' : 'My Progress';

  const thisMonthLabel =
    language === 'hi' ? 'यह महीना' : 'This month';

  const todosLabel =
    language === 'hi' ? 'काम / To-Dos' : 'To-dos';

  const shoppingLabel =
    language === 'hi'
      ? 'शॉपिंग / मैच गेम'
      : 'Shopping / match game';

  const exerciseLabel =
    language === 'hi'
      ? 'व्यायाम / Move with Sukoon'
      : 'Exercise / Move with Sukoon';

  const feedbackLabel =
    language === 'hi' ? 'सुकून से सुझाव' : 'Sukoon feedback';

  const lastUpdatedText = currentNoteEntry?.updatedAt
    ? (() => {
        const d = new Date(currentNoteEntry.updatedAt);
        if (language === 'hi') {
          return `आख़िरी बार अपडेट: ${d.toLocaleDateString(
            'hi-IN'
          )} ${d.toLocaleTimeString('hi-IN')}`;
        }
        return `Last updated: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
      })()
    : null;

  // ===== Chart data helpers =====
  const chartWidth = Dimensions.get('window').width - 48; // paddingHorizontal * 2

  const shoppingChartData = (() => {
    if (shoppingDaily.length === 0) return null;
    const labels = shoppingDaily.map(d =>
      language === 'hi'
        ? toDevanagariDigits(d.day)
        : String(d.day)
    );
    const data = shoppingDaily.map(d => d.bestScore);
    return { labels, data };
  })();

  const exerciseChartData = (() => {
    if (exerciseDaily.length === 0) return null;
    const labels = exerciseDaily.map(d =>
      language === 'hi'
        ? toDevanagariDigits(d.day)
        : String(d.day)
    );
    const data = exerciseDaily.map(d => d.count);
    return { labels, data };
  })();

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) =>
      `rgba(63, 81, 181, ${opacity})`, // indigo-ish
    labelColor: (opacity = 1) =>
      `rgba(90, 90, 90, ${opacity})`,
    propsForDots: {
      r: '4',
    },
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <Text style={styles.title}>{myProgressTitle}</Text>
      <Text style={styles.monthTitle}>
        {thisMonthLabel}: {monthLabel}
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* To-dos summary */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{todosLabel}</Text>
          <Text style={styles.sectionBody}>
            {renderTodoSummaryLine()}
          </Text>
        </Card>

        {/* Shopping / match game */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{shoppingLabel}</Text>
          <Text style={styles.sectionBody}>
            {shoppingSummaryLine()}
          </Text>

          {shoppingChartData && (
            <LineChart
              data={{
                labels: shoppingChartData.labels,
                datasets: [{ data: shoppingChartData.data }],
              }}
              width={chartWidth}
              height={220}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Card>

        {/* Exercise / Move with Sukoon */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{exerciseLabel}</Text>
          <Text style={styles.sectionBody}>
            {exerciseSummaryLine()}
          </Text>

          {exerciseChartData && (
            <BarChart
              data={{
                labels: exerciseChartData.labels,
                datasets: [{ data: exerciseChartData.data }],
              }}
              width={chartWidth}
              height={220}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
        </Card>

        {/* Auto feedback */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{feedbackLabel}</Text>
          <Text style={styles.sectionBody}>
            {buildFeedbackText()}
          </Text>
        </Card>

        {/* Doctor / family note */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{doctorTitle}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={doctorPlaceholder}
            value={doctorNote}
            onChangeText={setDoctorNote}
            multiline
          />
          {lastUpdatedText ? (
            <Text style={styles.noteUpdatedText}>
              {lastUpdatedText}
            </Text>
          ) : null}
          <PrimaryButton
            title={saveButtonLabel}
            onPress={handleSaveNote}
            style={{ marginTop: 12 }}
          />
        </Card>
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
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
  },
  monthTitle: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 12,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 18,
    color: colors.textDark,
    lineHeight: 26,
  },
  chart: {
    marginTop: 10,
    borderRadius: 12,
  },
  noteInput: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 80,
    fontSize: 18,
    color: colors.textDark,
    textAlignVertical: 'top',
    backgroundColor: '#F8F8F8',
  },
  noteUpdatedText: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textLight,
  },
});
