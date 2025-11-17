import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import colors from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function SosScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();

  const emergencyNumber = user?.emergencyContact?.trim();

  const handleCall = () => {
    if (!emergencyNumber) {
      Alert.alert(
        t('sos_no_number_title'),
        t('sos_no_number_message')
      );
      return;
    }

    const url = `tel:${emergencyNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert(t('sos_error_title'), t('sos_error_message'));
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => {
        console.error('SOS call error', err);
        Alert.alert(t('sos_error_title'), t('sos_error_message'));
      });
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.title}>{t('sos_title')}</Text>

        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>{t('sos_call_button')}</Text>
        </TouchableOpacity>

        <Text style={styles.note}>{t('sos_note')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 40,
  },
  callButton: {
    backgroundColor: colors.danger,
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  note: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
});
