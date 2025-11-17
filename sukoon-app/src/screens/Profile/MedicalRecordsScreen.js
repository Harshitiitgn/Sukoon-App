import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,              // ⬅️ import Linking from react-native
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import colors from '../../theme/colors';
import TopBar from '../../components/TopBar';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import InputField from '../../components/InputField';
import { useLanguage } from '../../context/LanguageContext';

const STORAGE_KEY = 'sukoon_medical_records_v1';

export default function MedicalRecordsScreen({ navigation }) {
  const { t } = useLanguage();

  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // { uri, name, size, mimeType }

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        setRecords(JSON.parse(json));
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.log('Error loading medical records', err);
      setRecords([]);
    }
  };

  const saveRecords = async updated => {
    try {
      setRecords(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.log('Error saving medical records', err);
    }
  };

  const onAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/*',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets?.[0];
      if (file) {
        setAttachedFile({
          uri: file.uri,
          name: file.name || t('medical_file_default_name'),
          size: file.size ?? null,
          mimeType: file.mimeType ?? null,
        });
      }
    } catch (err) {
      console.log('Error picking document', err);
    }
  };

  const onAddRecord = () => {
    const trimmedTitle = title.trim();
    const trimmedDate = date.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedTitle && !trimmedDate && !trimmedNotes && !attachedFile) {
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      title: trimmedTitle || t('medical_default_title'),
      date: trimmedDate,
      notes: trimmedNotes,
      file: attachedFile || null, // store file info if present
    };

    const updated = [newRecord, ...records];
    saveRecords(updated);

    setTitle('');
    setDate('');
    setNotes('');
    setAttachedFile(null);
  };

  const confirmDeleteRecord = id => {
    const record = records.find(r => r.id === id);

    Alert.alert(
      t('medical_delete_title'),
      record
        ? t('medical_delete_message', { title: record.title })
        : t('medical_delete_message_simple'),
      [
        { text: t('common_cancel'), style: 'cancel' },
        {
          text: t('common_remove'),
          style: 'destructive',
          onPress: () => deleteRecord(id),
        },
      ]
    );
  };

  const deleteRecord = async id => {
    try {
      const updated = records.filter(r => r.id !== id);
      await saveRecords(updated);
    } catch (err) {
      console.log('Error deleting medical record', err);
    }
  };

  const openFile = async file => {
    if (!file?.uri) return;

    try {
      // In many cases Linking can open file:// or http(s):// URIs.
      await Linking.openURL(file.uri);
    } catch (err) {
      console.log('Error opening file', err);
      Alert.alert(
        t('medical_open_error_title'),
        t('medical_open_error_message')
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* SOS + close/back like other screens */}
      <TopBar navigation={navigation} />

      <Text style={styles.title}>{t('medical_title')}</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add new record */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('medical_add_section_title')}
          </Text>

          <InputField
            label={t('medical_field_title')}
            placeholder={t('medical_field_title_placeholder')}
            value={title}
            onChangeText={setTitle}
          />

          <InputField
            label={t('medical_field_date')}
            placeholder={t('medical_field_date_placeholder')}
            value={date}
            onChangeText={setDate}
          />

          <InputField
            label={t('medical_field_notes')}
            placeholder={t('medical_field_notes_placeholder')}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {/* Attach file button */}
          <TouchableOpacity
            style={styles.attachButton}
            onPress={onAttachFile}
          >
            <Ionicons
              name="attach"
              size={22}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.attachButtonText}>
              {attachedFile
                ? attachedFile.name
                : t('medical_attach_button')}
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title={t('medical_add_button')}
            onPress={onAddRecord}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* Existing records */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t('medical_existing_section_title')}
          </Text>

          {records.length === 0 ? (
            <Text style={styles.emptyText}>
              {t('medical_empty_text')}
            </Text>
          ) : (
            records.map(record => (
              <View key={record.id} style={styles.recordRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recordTitle}>
                    {record.title}
                  </Text>
                  {!!record.date && (
                    <Text style={styles.recordLine}>
                      {t('medical_label_date')} {record.date}
                    </Text>
                  )}
                  {!!record.notes && (
                    <Text style={styles.recordLine}>
                      {t('medical_label_notes')} {record.notes}
                    </Text>
                  )}
                  {!!record.file?.name && (
                    <Text style={styles.recordFileName}>
                      {t('medical_label_file')} {record.file.name}
                    </Text>
                  )}
                </View>

                {/* View file button if file attached */}
                {record.file?.uri && (
                  <TouchableOpacity
                    style={styles.viewFileButton}
                    onPress={() => openFile(record.file)}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDeleteRecord(record.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
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
    fontSize: 26,           // bigger for elderly
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
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  recordLine: {
    fontSize: 16,
    color: colors.textLight,
  },
  recordFileName: {
    fontSize: 15,
    color: colors.textDark,
    marginTop: 2,
  },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: colors.danger,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFileButton: {
    marginLeft: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#F7F7F7',
  },
  attachButtonText: {
    fontSize: 16,
    color: colors.textDark,
  },
});
