// src/screens/Profile/HelpScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';

const QUESTION_KEYS = [
  'help_q1',
  'help_q2',
  'help_q3',
  'help_q4',
  'help_q5',
];

export default function HelpScreen({ navigation }) {
  const { t } = useLanguage();

  const onQuestionPress = (key) => {
    Alert.alert(
      t('help_video_placeholder'),
      t(key)
    );
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <Text style={styles.title}>{t('help_simple_title')}</Text>

      <Card>
        {QUESTION_KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.item}
            onPress={() => onQuestionPress(key)}
          >
            <Text style={styles.itemText}>{t(key)}</Text>
          </TouchableOpacity>
        ))}
      </Card>
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
    fontSize: 26,                // was 22
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 20,
  },
  item: {
    paddingVertical: 14,        // was 10 – easier to tap
  },
  itemText: {
    fontSize: 18,               // was 16
    color: colors.textDark,
  },
});
