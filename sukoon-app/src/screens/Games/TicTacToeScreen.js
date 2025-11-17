// src/screens/Games/TicTacToeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import TopBar from '../../components/TopBar';
import PrimaryButton from '../../components/PrimaryButton';
import { useLanguage } from '../../context/LanguageContext';
import typography from '../../theme/typography';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  if (board.every(cell => cell)) return 'draw';
  return null;
}

function computerMove(board) {
  // Simple AI: try to win, then block, otherwise first empty
  const tryMark = (symbol) => {
    for (const [a, b, c] of LINES) {
      const line = [board[a], board[b], board[c]];
      const countSymbol = line.filter(x => x === symbol).length;
      const countEmpty = line.filter(x => x === null).length;
      if (countSymbol === 2 && countEmpty === 1) {
        const idxLine = [a, b, c];
        const emptyIndexInLine = line.findIndex(x => x === null);
        return idxLine[emptyIndexInLine];
      }
    }
    return null;
  };

  // 1) win if possible
  let idx = tryMark('O');
  if (idx != null) return idx;

  // 2) block user
  idx = tryMark('X');
  if (idx != null) return idx;

  // 3) take center if free
  if (!board[4]) return 4;

  // 4) first empty
  return board.findIndex(cell => cell === null);
}

export default function TicTacToeScreen({ navigation }) {
  const { t } = useLanguage();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [statusText, setStatusText] = useState(t('ttt_your_turn'));
  const [winner, setWinner] = useState(null);

  const handleSquarePress = (index) => {
    if (!isUserTurn || winner) return;
    if (board[index]) return;
    setSelectedIndex(index);
  };

  const handleConfirmMove = () => {
    if (selectedIndex == null || !isUserTurn || winner) return;

    const newBoard = [...board];
    newBoard[selectedIndex] = 'X';
    setBoard(newBoard);
    setSelectedIndex(null);

    let result = checkWinner(newBoard);
    if (result === 'X') {
      setWinner('X');
      setStatusText(t('ttt_you_win'));
      Alert.alert('🎉', t('ttt_you_win'));
      return;
    }
    if (result === 'draw') {
      setWinner('draw');
      setStatusText(t('ttt_draw'));
      return;
    }

    // Computer turn
    setIsUserTurn(false);
    const compIndex = computerMove(newBoard);
    if (compIndex !== -1 && compIndex != null) {
      newBoard[compIndex] = 'O';
    }
    setBoard([...newBoard]);

    result = checkWinner(newBoard);
    if (result === 'O') {
      setWinner('O');
      setStatusText(t('ttt_computer_wins'));
      Alert.alert('🙂', t('ttt_computer_wins'));
      return;
    }
    if (result === 'draw') {
      setWinner('draw');
      setStatusText(t('ttt_draw'));
      return;
    }

    setIsUserTurn(true);
    setStatusText(t('ttt_your_turn'));
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setSelectedIndex(null);
    setIsUserTurn(true);
    setWinner(null);
    setStatusText(t('ttt_your_turn'));
  };

  const renderSquare = (index) => {
    const value = board[index];
    const isSelected = selectedIndex === index;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.square,
          isSelected && !value && styles.squareSelected,
        ]}
        onPress={() => handleSquarePress(index)}
      >
        <Text style={styles.squareText}>{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title}>{t('ttt_title')}</Text>

      <Card style={styles.boardCard}>
        <View style={styles.boardRow}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.boardRow}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.boardRow}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </Card>

      <Text style={styles.status}>{statusText}</Text>

      <PrimaryButton
        title={t('ttt_confirm_move')}
        onPress={handleConfirmMove}
        style={{ marginTop: 8 }}
      />

      <PrimaryButton
        title={t('ttt_reset')}
        onPress={handleReset}
        style={{ marginTop: 8 }}
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
    fontSize: typography.headingXL,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
  boardCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareSelected: {
    backgroundColor: colors.accent,
  },
  squareText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textDark,
  },
  status: {
    marginTop: 12,
    fontSize: typography.bodyL,
    color: colors.textDark,
  },
});
