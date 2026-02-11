export type Suit = 'spade' | 'diamond' | 'club' | 'heart';
export type Value =
  | 'two'
  | 'three'
  | 'four'
  | 'five'
  | 'six'
  | 'seven'
  | 'eight'
  | 'nine'
  | 'ten'
  | 'jack'
  | 'queen'
  | 'king'
  | 'ace';

export interface Card {
  suit: Suit;
  value: Value;
}

export type GamePhase =
  | 'Idle'
  | 'Dealing'
  | 'PlayerTurn'
  | 'DealerTurn'
  | 'Settlement'
  | 'RoundEnd';

export interface GameState {
  dealerCards: Card[];
  playerOneCards: Card[];
  playerTwoCards: Card[];
  playerThreeCards: Card[];
  dealerRoundsWon: number;
  playerOneRoundsWon: number;
  playerTwoRoundsWon: number;
  playerThreeRoundsWon: number;
  phase: GamePhase;
  message: string | null;
}

export type GameAction =
  | { type: 'PLAYER_HIT'; payload: Card }
  | {
      type: 'NEW_HAND';
      payload: { dealerCards: Card[]; playerCards: Card[][] };
    }
  | { type: 'DEALER_DRAW'; payload: Card }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'INCREMENT_WIN'; payload: 'dealer' | 'playerOne' }
  | { type: 'SET_MESSAGE'; payload: string | null };
