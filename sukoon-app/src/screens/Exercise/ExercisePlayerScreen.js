// src/screens/Exercise/ExercisePlayerScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import PrimaryButton from '../../components/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

const EXERCISE_SESSIONS_KEY = 'sukoon_exercise_sessions_v1';

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function logExerciseSession(routineKey) {
  try {
    const todayKey = getTodayKey();
    const json = await AsyncStorage.getItem(EXERCISE_SESSIONS_KEY);
    const list = json ? JSON.parse(json) : [];

    const newEntry = {
      id: Date.now().toString(),
      dateKey: todayKey,
      routineKey,
    };

    const updated = [...list, newEntry];
    await AsyncStorage.setItem(
      EXERCISE_SESSIONS_KEY,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.log('Error logging exercise session', e);
  }
}

export default function ExercisePlayerScreen({ route, navigation }) {
  const { t, language } = useLanguage();

  // Passed from MoveAndBreatheScreen
  const { labelKey, youtubeId } = route.params || {};
  const routineTitle = labelKey ? t(labelKey) : t('move_routine_fallback');
  const routineKey = labelKey || 'unknown_routine';

  const videoUrl = youtubeId
    ? `https://www.youtube.com/watch?v=${youtubeId}`
    : null;

  const handleOpenYouTube = async () => {
    if (!videoUrl) return;

    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert(
          t('exercise_open_error_title'),
          t('exercise_open_error_message')
        );
      }
    } catch (e) {
      console.log('Error opening YouTube:', e);
      Alert.alert(
        t('exercise_open_error_title'),
        t('exercise_open_error_message')
      );
    }
  };

  const handleMarkDone = async () => {
    await logExerciseSession(routineKey);

    if (language === 'hi') {
      Alert.alert('शाबाश!', 'आज का व्यायाम सत्र दर्ज कर लिया गया है।');
    } else {
      Alert.alert('Well done!', 'Today’s exercise session has been recorded.');
    }
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{routineTitle}</Text>

        {/* Card area that used to show the embedded video */}
        <Card style={styles.videoCard}>
          {videoUrl ? (
            <>
              <Text style={styles.videoText}>
                {t('exercise_open_on_youtube_info')}
              </Text>
              <TouchableOpacity
                style={styles.youtubeButton}
                onPress={handleOpenYouTube}
              >
                <Text style={styles.youtubeButtonText}>
                  {t('exercise_open_on_youtube')}
                </Text>
              </TouchableOpacity>

              {/* New button: log that user did the exercise today */}
              <PrimaryButton
                title={
                  language === 'hi'
                    ? 'आज यह व्यायाम किया'
                    : 'I did this exercise today'
                }
                onPress={handleMarkDone}
                style={{ marginTop: 12 }}
              />
            </>
          ) : (
            <Text style={styles.noVideoText}>
              {t('exercise_no_video')}
            </Text>
          )}
        </Card>

        <Card>
          <Text style={styles.body}>
            {t('exercise_instruction')}
          </Text>
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
    fontSize: 26,       // bigger for elderly
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  videoCard: {
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  videoText: {
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  youtubeButton: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  noVideoText: {
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
  },
  body: {
    fontSize: 18,       // bigger body text
    color: colors.textDark,
    lineHeight: 26,
  },
});
