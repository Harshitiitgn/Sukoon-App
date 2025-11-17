// src/screens/Onboarding/GetStartedScreen.js (path as in your project)
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

export default function GetStartedScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.logo}>{t('app_name')}</Text>

        <Image
          style={styles.heartImage}
          source={require('../../../assets/heart_image-removebg-preview.png')}
        />

        <Text style={styles.motto}>{t('app_tagline')}</Text>

        <Text style={styles.title}>
          {t('get_started_title')}
        </Text>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          title={t('auth_login')}
          onPress={() => navigation.navigate('Login')}
        />
        <PrimaryButton
          title={t('auth_signup')}
          onPress={() => navigation.navigate('UserInfo')}
          style={{ marginTop: 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  top: {
    marginTop: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 50,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  heartImage: {
    width: 250,
    height: 200,
    borderRadius: 70,
    marginBottom: 12,
  },
  motto: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
  },
  bottom: {
    marginBottom: 40,
    
  },
});
