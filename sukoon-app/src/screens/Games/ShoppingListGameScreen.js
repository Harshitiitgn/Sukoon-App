// src/screens/Games/ShoppingListGameScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import typography from '../../theme/typography';

const MEM_ITEMS = ['Milk', 'Bread', 'Apples', 'Tea'];
const DISTRACTORS = ['Soap', 'Sugar', 'Rice', 'Tomatoes'];

const SHOPPING_SESSIONS_KEY = 'sukoon_shopping_game_sessions_v1';

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function logShoppingGameSession(score) {
  try {
    const todayKey = getTodayKey();
    const json = await AsyncStorage.getItem(SHOPPING_SESSIONS_KEY);
    const list = json ? JSON.parse(json) : [];

    const newEntry = {
      id: Date.now().toString(),
      dateKey: todayKey,
      score: Number(score) || 0,
    };

    const updated = [...list, newEntry];
    await AsyncStorage.setItem(
      SHOPPING_SESSIONS_KEY,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.log('Error logging shopping game session', e);
  }
}

export default function ShoppingListGameScreen({ navigation }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('memorise'); // 'memorise' | 'quiz'
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('');

  const allOptions = [...MEM_ITEMS, ...DISTRACTORS];

  const toggleSelect = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleStartQuiz = () => {
    setPhase('quiz');
    setSelected([]);
    setFeedback('');
  };

  const handleCheck = async () => {
    let correct = 0;
    selected.forEach(item => {
      if (MEM_ITEMS.includes(item)) correct += 1;
    });
    const missed = MEM_ITEMS.filter(item => !selected.includes(item));

    // 🔹 Save this attempt for My Progress (score = number correct)
    await logShoppingGameSession(correct);

    if (correct === MEM_ITEMS.length && missed.length === 0) {
      setFeedback(t('shop_all_correct'));
    } else {
      setFeedback(
        t('shop_feedback_prefix') +
          ` ${correct}/${MEM_ITEMS.length} ` +
          t('shop_feedback_suffix')
      );
    }
  };

  const handleRestart = () => {
    setPhase('memorise');
    setSelected([]);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>{t('shop_title')}</Text>
      <Text style={styles.subtitle}>
        {phase === 'memorise'
          ? t('shop_subtitle_memorise')
          : t('shop_subtitle_quiz')}
      </Text>

      <Card>
        {phase === 'memorise' ? (
          <>
            {MEM_ITEMS.map(item => (
              <Text key={item} style={styles.memItem}>
                • {item}
              </Text>
            ))}
          </>
        ) : (
          allOptions.map(item => {
            const isSelected = selected.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => toggleSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </Card>

      {phase === 'memorise' ? (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartQuiz}
        >
          <Text style={styles.primaryButtonText}>
            {t('shop_ready')}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCheck}
          >
            <Text style={styles.primaryButtonText}>
              {t('shop_check')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRestart}
          >
            <Text style={styles.secondaryButtonText}>
              {t('shop_restart')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.feedback}>{feedback}</Text>
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
  title: {
    fontSize: typography.headingXL,
    fontWeight: '700',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: typography.bodyL,
    color: colors.textLight,
    marginBottom: 16,
  },
  memItem: {
    fontSize: typography.bodyL,
    color: colors.textDark,
    marginBottom: 4,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  optionSelected: {
    backgroundColor: colors.accent,
  },
  optionText: {
    fontSize: typography.bodyL,
    color: colors.textDark,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.bodyL,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.bodyL,
    color: colors.primary,
    fontWeight: '600',
  },
  feedback: {
    marginTop: 12,
    fontSize: typography.bodyL,
    color: colors.textDark,
  },
});
