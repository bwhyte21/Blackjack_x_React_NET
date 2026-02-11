import { useCallback, useRef } from 'react';
import type { Card, Suit, Value } from '@/types/game.types';

const suits: Suit[] = ['spade', 'diamond', 'club', 'heart'];
const values: Value[] = [
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'jack',
  'queen',
  'king',
  'ace',
];

const valueMap: Record<Value, number> = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  jack: 10,
  queen: 10,
  king: 10,
  ace: 1,
};

/**
 * Shuffle a deck using the Fisher-Yates algorithm.
 */
function shuffle(array: Card[]): Card[] {
  const shuffled = [...array];
  let counter = shuffled.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = shuffled[counter];
    shuffled[counter] = shuffled[index];
    shuffled[index] = temp;
  }
  return shuffled;
}

/**
 * Represents a blackjack hand evaluation.
 */
export interface HandValue {
  total: number;
  isSoft: boolean;
  isBlackjack: boolean;
  isBust: boolean;
}

/**
 * Evaluate a hand total using flexible Ace handling.
 */
export function getHandValue(cards: Card[]): HandValue {
  let total = 0;
  let aceCount = 0;

  for (const card of cards) {
    if (card.value === 'ace') {
      aceCount += 1;
      total += 1;
    } else {
      total += valueMap[card.value];
    }
  }

  let isSoft = false;
  if (aceCount > 0 && total + 10 <= 21) {
    total += 10;
    isSoft = true;
  }

  return {
    total,
    isSoft,
    isBlackjack: cards.length === 2 && total === 21,
    isBust: total > 21,
  };
}

/**
 * Manage a single in-memory deck for the current session.
 */
export function useDeck() {
  const deckRef = useRef<Card[]>([]);

  /**
   * Create and shuffle a new 52-card deck.
   */
  const shuffleDeck = useCallback(() => {
    const newDeck: Card[] = [];
    for (const value of values) {
      for (const suit of suits) {
        newDeck.push({ value, suit });
      }
    }
    deckRef.current = shuffle(newDeck);
  }, []);

  /**
   * Draw the next card from the deck.
   */
  const drawCard = useCallback((): Card => {
    const card = deckRef.current.pop();
    if (!card) throw new Error('Deck is empty');
    return card;
  }, []);

  return { drawCard, shuffleDeck };
}
