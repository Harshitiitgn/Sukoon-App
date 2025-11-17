// src/screens/Health/NotFeelingWellScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TopBar from '../../components/TopBar';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

const SYMPTOMS = [
  { id: 'headache', labelKey: 'health_symptom_headache' },
  { id: 'stomach', labelKey: 'health_symptom_stomach' },
  { id: 'fever', labelKey: 'health_symptom_fever' },
  { id: 'breathing', labelKey: 'health_symptom_breathing' },
  { id: 'chest', labelKey: 'health_symptom_chest_pain' },
  { id: 'low', labelKey: 'health_symptom_feeling_low' },
  { id: 'other', labelKey: 'health_symptom_other' },
];

const SEVERITIES = [
  { id: 'mild', labelKey: 'health_severity_mild' },
  { id: 'moderate', labelKey: 'health_severity_moderate' },
  { id: 'severe', labelKey: 'health_severity_severe' },
];

export default function NotFeelingWellScreen({ navigation }) {
  const { t } = useLanguage();

  const [selectedSymptom, setSelectedSymptom] = useState(SYMPTOMS[0].id);
  const [selectedSeverity, setSelectedSeverity] = useState('mild');
  const [resultLevel, setResultLevel] = useState(null); // 'mild' | 'moderate' | 'severe' | null

  const handleSeeSuggestions = () => {
    // For now, we directly map severity → suggestion level
    setResultLevel(selectedSeverity);
  };

  const DOCTOR_PHONE_E164 = '+911234567890'; // replace with real number

    const handleCallDoctor = async () => {
    try {
        await Linking.openURL(`tel:${DOCTOR_PHONE_E164}`);
    } catch (err) {
        console.log('Error opening phone dialer', err);
        Alert.alert(
        t('health_call_error_title'),
        t('health_call_error_message')
        );
    }
    };

    const handleOpenWhatsApp = async () => {
    try {
        // WhatsApp expects phone in international/E.164 format, without spaces
        const phone = DOCTOR_PHONE_E164.replace(/\s+/g, '');
        const message = encodeURIComponent(
        t('health_whatsapp_prefill') // e.g. “Namaste doctor, I am not feeling well.”
        );
        const url = `whatsapp://send?phone=${phone}&text=${message}`;

        await Linking.openURL(url);
    } catch (err) {
        console.log('Error opening WhatsApp', err);
        Alert.alert(
        t('health_whatsapp_error_title'),
        t('health_whatsapp_error_message')
        );
    }
    };

  const renderSuggestionText = () => {
    if (!resultLevel) return null;

    if (resultLevel === 'mild') return t('health_suggestion_mild');
    if (resultLevel === 'moderate') return t('health_suggestion_moderate');
    return t('health_suggestion_severe');
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('health_title')}</Text>

        {/* Symptom selection */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('health_question_symptom')}
          </Text>
          <View style={styles.chipsRow}>
            {SYMPTOMS.map(sym => (
              <TouchableOpacity
                key={sym.id}
                style={[
                  styles.chip,
                  selectedSymptom === sym.id && styles.chipSelected,
                ]}
                onPress={() => setSelectedSymptom(sym.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSymptom === sym.id && styles.chipTextSelected,
                  ]}
                >
                  {t(sym.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Severity selection */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('health_question_severity')}
          </Text>
          <View style={styles.chipsRow}>
            {SEVERITIES.map(sev => (
              <TouchableOpacity
                key={sev.id}
                style={[
                  styles.chip,
                  selectedSeverity === sev.id && styles.chipSelected,
                ]}
                onPress={() => setSelectedSeverity(sev.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSeverity === sev.id && styles.chipTextSelected,
                  ]}
                >
                  {t(sev.labelKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Button to see suggestions */}
        <PrimaryButton
          title={t('health_button_see_suggestions')}
          onPress={handleSeeSuggestions}
          style={{ marginBottom: 16 }}
        />

        {/* Suggestion area */}
        {resultLevel && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              {t('health_result_title')}
            </Text>
            <Text style={styles.resultText}>{renderSuggestionText()}</Text>

            {/* Only show doctor options for "severe" */}
            {resultLevel === 'severe' && (
                <View style={styles.actionsRow}>
                    <PrimaryButton
                    title={t('health_call_doctor')}
                    onPress={handleCallDoctor}
                    style={styles.actionButton}
                    />
                    <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleOpenWhatsApp}
                    >
                    <Ionicons
                        name="logo-whatsapp"
                        size={20}
                        color={colors.primary}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.secondaryButtonText}>
                        {t('health_open_whatsapp')}
                    </Text>
                    </TouchableOpacity>
                </View>
                )}
            <Text style={styles.disclaimer}>
              {t('health_disclaimer')}
            </Text>
          </Card>
        )}
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 16,
    color: colors.textDark,
  },
  chipTextSelected: {
    fontWeight: '700',
    color: '#fff',
  },
  resultCard: {
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    color: colors.textDark,
    lineHeight: 26,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
});
