// src/screens/Games/CardMatchScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import typography from '../../theme/typography';

const SYMBOLS = ['😀', '🌸', '🎈', '☕'];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CardMatchScreen({ navigation }) {
  const { t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const allMatched = matched.length === cards.length && cards.length > 0;

  const resetGame = () => {
    const deck = shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, index) => ({
      id: index,
      symbol,
    }));
    setCards(deck);
    setOpenIndexes([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handlePress = (index) => {
    if (openIndexes.includes(index) || matched.includes(index)) return;
    if (openIndexes.length === 2) return;

    const newOpen = [...openIndexes, index];
    setOpenIndexes(newOpen);

    if (newOpen.length === 2) {
      setMoves(m => m + 1);
      const [i1, i2] = newOpen;
      if (cards[i1].symbol === cards[i2].symbol) {
        setMatched(prev => [...prev, i1, i2]);
        setOpenIndexes([]);
      } else {
        setTimeout(() => {
          setOpenIndexes([]);
        }, 800);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>{t('match_title')}</Text>
      <Text style={styles.subtitle}>
        {t('match_subtitle')} {moves}
      </Text>

      <Card style={styles.boardCard}>
        <View style={styles.board}>
          {cards.map((card, index) => {
            const isOpen =
              openIndexes.includes(index) || matched.includes(index);
            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardSquare,
                  isOpen && styles.cardSquareOpen,
                ]}
                onPress={() => handlePress(index)}
              >
                <Text style={styles.cardSymbol}>
                  {isOpen ? card.symbol : '?'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {allMatched && (
        <Text style={styles.successText}>{t('match_success')}</Text>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>{t('match_reset')}</Text>
      </TouchableOpacity>
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
    fontSize: typography.headingXL,
    fontWeight: '700',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: typography.bodyL,
    color: colors.textLight,
    marginBottom: 16,
  },
  boardCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 260,
  },
  cardSquare: {
    width: 60,
    height: 60,
    margin: 6,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSquareOpen: {
    backgroundColor: colors.accent,
  },
  cardSymbol: {
    fontSize: 28,
  },
  successText: {
    marginTop: 12,
    fontSize: typography.bodyL,
    color: colors.textDark,
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: typography.bodyL,
    fontWeight: '700',
    color: '#FFF',
  },
});
