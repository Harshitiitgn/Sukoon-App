// src/screens/Exercise/MoveAndBreatheScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';

// Put your own YouTube VIDEO IDs here later
const ROUTINES = [
  {
    id: 'stretch_flow',
    labelKey: 'move_routine_stretch_flow',
    youtubeId: 'zVCqkiqsz4I', // placeholder – replace with your video
  },
  {
    id: 'balance_posture',
    labelKey: 'move_routine_balance_posture',
    youtubeId: 'zVCqkiqsz4I', // placeholder
  },
  {
    id: 'stretch_relax',
    labelKey: 'move_routine_stretch_relax',
    youtubeId: 'zVCqkiqsz4I', // placeholder
  },
  {
    id: 'mini_yoga',
    labelKey: 'move_routine_mini_yoga',
    youtubeId: 'zVCqkiqsz4I', // placeholder
  },
];

export default function MoveAndBreatheScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <Text style={styles.title}>{t('move_title')}</Text>
      <Text style={styles.subtitle}>{t('move_subtitle')}</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          {ROUTINES.map(r => (
            <TouchableOpacity
              key={r.id}
              style={styles.item}
              onPress={() =>
                navigation.navigate('ExercisePlayer', {
                  labelKey: r.labelKey,
                  youtubeId: r.youtubeId,
                })
              }
            >
              <Text style={styles.itemText}>{t(r.labelKey)}</Text>
            </TouchableOpacity>
          ))}
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
  title: {
    fontSize: 26,            // bigger for elderly
    fontWeight: '700',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemText: {
    fontSize: 18,
    color: colors.textDark,
    fontWeight: '500',
  },
});
