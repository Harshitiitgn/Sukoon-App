// src/screens/Games/OddOneOutScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import typography from '../../theme/typography';

const QUESTIONS = [
  {
    items: ['Apple', 'Banana', 'Orange', 'Bus'],
    oddIndex: 3,
  },
  {
    items: ['Dog', 'Cat', 'Cow', 'Rose'],
    oddIndex: 3,
  },
  {
    items: ['Chair', 'Table', 'Sofa', 'Mango'],
    oddIndex: 3,
  },
  {
    items: ['Car', 'Bus', 'Train', 'Shirt'],
    oddIndex: 3,
  },
];

export default function OddOneOutScreen({ navigation }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');

  const q = QUESTIONS[index];

  const handleSelect = (i) => {
    setSelected(i);
    if (i === q.oddIndex) {
      setFeedback(t('odd_correct'));
    } else {
      setFeedback(t('odd_try_again'));
    }
  };

  const handleNext = () => {
    const next = (index + 1) % QUESTIONS.length;
    setIndex(next);
    setSelected(null);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>{t('odd_title')}</Text>
      <Text style={styles.subtitle}>{t('odd_subtitle')}</Text>

      <Card>
        {q.items.map((item, i) => (
          <TouchableOpacity
            key={item + i}
            style={[
              styles.option,
              selected === i && styles.optionSelected,
            ]}
            onPress={() => handleSelect(i)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </Card>

      <Text style={styles.feedback}>{feedback}</Text>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('odd_next')}</Text>
      </TouchableOpacity>
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
  option: {
    paddingVertical: 12,
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
  feedback: {
    marginTop: 12,
    fontSize: typography.bodyL,
    color: colors.textDark,
  },
  nextButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: typography.bodyL,
    fontWeight: '700',
    color: '#FFF',
  },
});
