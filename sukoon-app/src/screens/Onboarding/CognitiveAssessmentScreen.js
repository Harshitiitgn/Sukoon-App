import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import colors from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';

const QUESTIONS = [
  {
    id: 1,
    text: 'What is 30 minus 7?',
    options: ['21', '23', '27', '26'],
    correctIndex: 1,
  },
  {
    id: 2,
    text: 'Which day comes after Monday?',
    options: ['Sunday', 'Tuesday', 'Friday', 'Wednesday'],
    correctIndex: 1,
  },
];

export default function CognitiveAssessmentScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const { completeOnboarding } = useContext(AuthContext);

  const question = QUESTIONS[index];
  const progressLabel = `Question ${index + 1}/${QUESTIONS.length}`;

  const onNext = () => {
    if (index + 1 < QUESTIONS.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      navigation.replace('AssessmentComplete');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cognitive Wellness Check</Text>
      <Text style={styles.sub}>
        This short set of tasks will take around 10 minutes.
        Take your time to answer.
      </Text>

      <Text style={styles.progress}>{progressLabel}</Text>

      <Card>
        <Text style={styles.question}>{question.text}</Text>
        {question.options.map((opt, idx) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.option,
              selected === idx && styles.optionSelected,
            ]}
            onPress={() => setSelected(idx)}
          >
            <Text
              style={[
                styles.optionText,
                selected === idx && styles.optionTextSelected,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title={index + 1 === QUESTIONS.length ? 'Finish' : 'Next'}
        disabled={selected === null}
        onPress={onNext}
      />
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
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 16,
  },
  progress: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.textDark,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 8,
  },
  optionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionText: {
    fontSize: 16,
    color: colors.textDark,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});