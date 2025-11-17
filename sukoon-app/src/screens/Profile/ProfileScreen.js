import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import PrimaryButton from '../../components/PrimaryButton';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { toHindiDigits } from '../../utils/numberUtils';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { language, setLanguage, t } = useLanguage();

  const convert = val => (language === 'hi' ? toHindiDigits(val) : val);

  const name = user?.fullName?.trim() || t('profile_name_not_set');
  const ageText = user?.age
    ? `${convert(user.age)} ${t('profile_years')}`
    : t('profile_age_not_set');
  const mobile = user?.mobile?.trim()
    ? convert(user.mobile)
    : t('profile_contact_not_set');
  const gender = user?.gender?.trim() || t('profile_gender_not_specified');
  const emergencyContact = user?.emergencyContact?.trim()
    ? convert(user.emergencyContact)
    : t('profile_emergency_contact_not_set');

  const handleLogout = () => {
    const confirmMsg = t('profile_logout_message');
    const confirmTitle = t('profile_logout_title');
    const logoutText = t('profile_logout');

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(confirmMsg);
      if (confirmed) logout();
      return;
    }

    Alert.alert(confirmTitle, confirmMsg, [
      { text: t('common_cancel'), style: 'cancel' },
      { text: logoutText, style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>{t('profile_title')}</Text>

      <Card>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.line}>{ageText}</Text>
        <Text style={styles.line}>{gender}</Text>
        <Text style={styles.line}>
          {t('profile_contact')}: {mobile}
        </Text>
        <Text style={styles.line}>
          {t('profile_emergency_contact')}: {emergencyContact}
        </Text>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.linkText}>{t('profile_edit')}</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.languageCard}>
        <Text style={styles.languageLabel}>
          {t('profile_language_label')}
        </Text>
        <View style={styles.languageButtonsRow}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'en' && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text
              style={[
                styles.languageButtonText,
                language === 'en' && styles.languageButtonTextActive,
              ]}
            >
              {t('profile_language_english')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'hi' && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage('hi')}
          >
            <Text
              style={[
                styles.languageButtonText,
                language === 'hi' && styles.languageButtonTextActive,
              ]}
            >
              {t('profile_language_hindi')}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('MyProgress')}
      >
        <Text style={styles.menuText}>{t('profile_progress')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('MedicalRecords')}
      >
        <Text style={styles.menuText}>{t('profile_medical')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Help')}
      >
        <Text style={styles.menuText}>{t('profile_help')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={[styles.menuText, { color: colors.danger }]}>
          {t('profile_sos')}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title={t('profile_logout')}
        onPress={handleLogout}
        style={styles.logoutButton}
      />
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  line: {
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 2,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 18,
  },
  menuItem: {
    marginTop: 18,
  },
  menuText: {
    fontSize: 18,
    color: colors.textDark,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 20,
  },
  languageCard: {
    marginTop: 14,
  },
  languageLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.textDark,
  },
  languageButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageButtonText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#FFF',
  },
});
