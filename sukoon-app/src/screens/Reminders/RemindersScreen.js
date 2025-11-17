// src/screens/Reminders/RemindersScreen.js
import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

import colors from '../../theme/colors';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';

const TODOS_STORAGE_KEY = 'sukoon_todos_v1';
const REMINDERS_KEY = 'sukoon_reminders_v1';

// English month names
const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Hindi month names
const MONTH_NAMES_HI = [
  'जनवरी',
  'फ़रवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toHindiDigits(input) {
  return String(input).replace(/\d/g, d => DEVANAGARI_DIGITS[Number(d)]);
}

function formatDateKeyDisplay(dateKey, language, monthNames) {
  if (!dateKey) return '';
  const parts = dateKey.split('-');
  if (parts.length !== 3) return dateKey;
  const [yStr, mStr, dStr] = parts;
  const y = Number(yStr);
  const mIndex = Number(mStr) - 1;
  const d = Number(dStr);
  if (
    Number.isNaN(y) ||
    Number.isNaN(mIndex) ||
    Number.isNaN(d) ||
    mIndex < 0 ||
    mIndex > 11
  ) {
    return dateKey;
  }

  if (language === 'hi') {
    return `${toHindiDigits(d)} ${monthNames[mIndex]} ${toHindiDigits(y)}`;
  }
  return `${d} ${monthNames[mIndex]} ${y}`;
}

export default function RemindersScreen({ navigation }) {
  const { t, language } = useLanguage();
  const monthNames = language === 'hi' ? MONTH_NAMES_HI : MONTH_NAMES_EN;

  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0–11
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);

  const [monthYearModalVisible, setMonthYearModalVisible] = useState(false);
  const [reminders, setReminders] = useState([]);

  // Build a year range
  const years = [];
  for (let y = today.getFullYear() - 50; y <= today.getFullYear() + 20; y++) {
    years.push(y);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ===== To-do list load/save =====
  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (err) {
      console.log('Error loading tasks', err);
    }
  };

  const saveTasks = async updated => {
    try {
      setTasks(updated);
      await AsyncStorage.setItem(
        TODOS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.log('Error saving tasks', err);
    }
  };

  const addTask = () => {
    const text = taskText.trim();
    if (!text) return;

    const nowIso = new Date().toISOString();

    const newTask = {
      id: Date.now().toString(),
      text,
      done: false,
      createdAt: nowIso,   // ✅ track creation time
      completedAt: null,   // ✅ not completed yet
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setTaskText('');
  };

  const toggleTaskDone = id => {
    const nowIso = new Date().toISOString();

    const updated = tasks.map(t => {
      if (t.id !== id) return t;

      const newDone = !t.done;

      return {
        ...t,
        done: newDone,
        createdAt: t.createdAt || nowIso,           // ✅ ensure createdAt exists
        completedAt: newDone ? nowIso : null,       // ✅ set/clear completedAt
      };
    });

    saveTasks(updated);
  };

  const clearCompleted = () => {
    const updated = tasks.filter(t => !t.done);
    saveTasks(updated);
  };

  // ===== Reminders: load ALL reminders whenever screen is focused =====
  const loadReminders = async () => {
    try {
      const json = await AsyncStorage.getItem(REMINDERS_KEY);
      if (json) {
        setReminders(JSON.parse(json));
      } else {
        setReminders([]);
      }
    } catch (err) {
      console.log('Error loading reminders', err);
      setReminders([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const removeReminder = (id, title) => {
    Alert.alert(
      t('reminders_remove_title'),
      t('reminders_remove_message', { title }),
      [
        { text: t('common_cancel'), style: 'cancel' },
        {
          text: t('common_remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = reminders.filter(r => r.id !== id);
              setReminders(updated);
              await AsyncStorage.setItem(
                REMINDERS_KEY,
                JSON.stringify(updated)
              );
            } catch (err) {
              console.log('Error removing reminder', err);
            }
          },
        },
      ]
    );
  };

  // ===== Calendar helpers =====
  const daysInMonth = (year, monthIndex) =>
    new Date(year, monthIndex + 1, 0).getDate();

  const firstWeekdayOfMonth = (year, monthIndex) =>
    new Date(year, monthIndex, 1).getDay(); // 0=Sun..6=Sat

  const goToPrevMonth = () => {
    setCurrentMonth(prevMonth => {
      let newMonth = prevMonth - 1;
      let newYear = currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = currentYear - 1;
        setCurrentYear(newYear);
      }
      const dim = daysInMonth(newYear, newMonth);
      if (selectedDay > dim) {
        setSelectedDay(dim);
      }
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      let newMonth = prevMonth + 1;
      let newYear = currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = currentYear + 1;
        setCurrentYear(newYear);
      }
      const dim = daysInMonth(newYear, newMonth);
      if (selectedDay > dim) {
        setSelectedDay(dim);
      }
      return newMonth;
    });
  };

  const dim = daysInMonth(currentYear, currentMonth);
  const firstWeekday = firstWeekdayOfMonth(currentYear, currentMonth);

  const monthLabelRaw = `${monthNames[currentMonth]} ${currentYear}`;
  const monthLabel =
    language === 'hi'
      ? `${monthNames[currentMonth]} ${toHindiDigits(currentYear)}`
      : monthLabelRaw;

  // build calendar cells: leading blanks + days
  const calendarCells = [];
  for (let i = 0; i < firstWeekday; i++) {
    calendarCells.push({ key: `blank-${i}`, type: 'blank' });
  }
  for (let day = 1; day <= dim; day++) {
    calendarCells.push({ key: `day-${day}`, type: 'day', day });
  }

  const handleMonthYearDone = () => {
    const dimNew = daysInMonth(currentYear, currentMonth);
    if (selectedDay > dimNew) {
      setSelectedDay(dimNew);
    }
    setMonthYearModalVisible(false);
  };

  // For passing selected day to CreateReminderScreen
  const currentDateKey = `${currentYear}-${String(currentMonth + 1).padStart(
    2,
    '0'
  )}-${String(selectedDay).padStart(2, '0')}`;

  // Sort reminders by dateKey then time
  const sortedReminders = [...reminders].sort((a, b) => {
    const dA = a.dateKey || '';
    const dB = b.dateKey || '';
    if (dA !== dB) return dA.localeCompare(dB);
    return (a.time || '').localeCompare(b.time || '');
  });

  const displayDateLine =
    language === 'hi'
      ? `${toHindiDigits(selectedDay)} ${monthNames[currentMonth]} ${toHindiDigits(
          currentYear
        )}`
      : `${selectedDay} ${monthNames[currentMonth]} ${currentYear}`;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled"
      >
        <TopBar navigation={navigation} />

        <Text style={styles.title}>{t('reminders_title')}</Text>

        {/* Month header with navigation + picker trigger */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={goToPrevMonth}
            style={styles.monthNavButton}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.textDark}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.monthLabelWrapper}
            onPress={() => setMonthYearModalVisible(true)}
          >
            <Text style={styles.month}>{monthLabel}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.textDark}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextMonth}
            style={styles.monthNavButton}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textDark}
            />
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View style={styles.calendar}>
          {calendarCells.map(cell =>
            cell.type === 'blank' ? (
              <View key={cell.key} style={styles.dayPlaceholder} />
            ) : (
              <TouchableOpacity
                key={cell.key}
                style={[
                  styles.day,
                  selectedDay === cell.day && styles.daySelected,
                ]}
                onPress={() => setSelectedDay(cell.day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === cell.day && styles.dayTextSelected,
                  ]}
                >
                  {language === 'hi'
                    ? toHindiDigits(cell.day)
                    : String(cell.day)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* All reminders list */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={styles.subtitle}>{t('reminders_all_title')}</Text>
          {sortedReminders.length === 0 ? (
            <Text style={styles.emptyText}>
              {t('reminders_all_empty')}
            </Text>
          ) : (
            sortedReminders.map(rem => (
              <View key={rem.id} style={styles.reminderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskItem}>
                    • {rem.title} {rem.time ? `(${rem.time})` : ''}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDateKeyDisplay(
                      rem.dateKey,
                      language,
                      monthNames
                    )}{' '}
                    • {rem.category} • {rem.repeat}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeReminder(rem.id, rem.title)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </Card>

        {/* Things to do card with to-do list */}
        <Card>
          <Text style={styles.subtitle}>{t('reminders_todo_title')}</Text>
          <Text style={styles.dateText}>{displayDateLine}</Text>

          {/* Input row */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={t('reminders_todo_placeholder')}
              value={taskText}
              onChangeText={setTaskText}
              returnKeyType="done"
              onSubmitEditing={addTask}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addTask}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Tasks list */}
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>
              {t('reminders_todo_empty')}
            </Text>
          ) : (
            tasks.map(t => (
              <TouchableOpacity
                key={t.id}
                style={styles.taskRow}
                onPress={() => toggleTaskDone(t.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    t.done && styles.checkboxDone,
                  ]}
                >
                  {t.done && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#fff"
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.taskItem,
                    t.done && styles.taskItemDone,
                  ]}
                >
                  {t.text}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {tasks.some(t => t.done) && (
            <TouchableOpacity
              onPress={clearCompleted}
              style={styles.clearCompletedBtn}
            >
              <Text style={styles.clearCompletedText}>
                {t('reminders_todo_clear')}
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        <PrimaryButton
          title={t('reminders_add_button')}
          onPress={() =>
            navigation.navigate('CreateReminder', {
              dateKey: currentDateKey,
            })
          }
        />
      </ScrollView>

      {/* Month & Year picker modal */}
      <Modal
        transparent
        visible={monthYearModalVisible}
        animationType="fade"
        onRequestClose={() => setMonthYearModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('reminders_pick_month_year')}
            </Text>

            <View style={styles.pickerRow}>
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerLabel}>
                  {t('reminders_picker_month')}
                </Text>
                <Picker
                  selectedValue={currentMonth}
                  onValueChange={value => setCurrentMonth(value)}
                  style={styles.picker}
                >
                  {monthNames.map((m, index) => (
                    <Picker.Item
                      key={m}
                      label={m}
                      value={index}
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerLabel}>
                  {t('reminders_picker_year')}
                </Text>
                <Picker
                  selectedValue={currentYear}
                  onValueChange={value => setCurrentYear(value)}
                  style={styles.picker}
                >
                  {years.map(y => (
                    <Picker.Item
                      key={y}
                      label={
                        language === 'hi'
                          ? toHindiDigits(y)
                          : String(y)
                      }
                      value={y}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <PrimaryButton
              title={t('common_done')}
              onPress={handleMonthYearDone}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthNavButton: {
    padding: 6,
  },
  monthLabelWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    fontSize: 20,
    color: colors.textDark,
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayPlaceholder: {
    width: '14.28%',
    paddingVertical: 10,
  },
  day: {
    width: '14.28%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginVertical: 3,
  },
  daySelected: {
    backgroundColor: colors.accent,
  },
  dayText: {
    fontSize: 18,
    color: colors.textDark,
  },
  dayTextSelected: {
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  taskItem: {
    fontSize: 18,
    color: colors.textDark,
    flexShrink: 1,
  },
  taskItemDone: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 18,
    color: colors.textLight,
  },
  clearCompletedBtn: {
    marginTop: 10,
  },
  clearCompletedText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: colors.danger,
    borderRadius: 18,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
  },
  picker: {
    width: '100%',
  },
});
