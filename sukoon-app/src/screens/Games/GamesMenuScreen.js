// src/screens/Games/GamesMenuScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import typography from '../../theme/typography';

export default function GamesMenuScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>{t('games_title')}</Text>

      <Card>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('TicTacToe')}
        >
          <Text style={styles.itemText}>{t('games_ttt')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('OddOneOut')}
        >
          <Text style={styles.itemText}>{t('games_odd_one_out')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('CardMatch')}
        >
          <Text style={styles.itemText}>{t('games_card_match')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ShoppingListGame')}
        >
          <Text style={styles.itemText}>{t('games_shopping_list')}</Text>
        </TouchableOpacity>
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
    fontSize: typography.headingXL,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemText: {
    fontSize: typography.bodyL,
    color: colors.textDark,
    fontWeight: '600',
  },
});
