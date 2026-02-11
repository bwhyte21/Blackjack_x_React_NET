import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Card, GameAction, GameState } from '@/types/game.types';
import { getHandValue, useDeck } from './useDeck';

const DEALER_HITS_SOFT_17 = false;
const ROUND_START_DELAY_MS = 400;
const DEALER_DRAW_DELAY_MS = 500;

const initialState: GameState = {
  dealerCards: [],
  playerOneCards: [],
  playerTwoCards: [],
  playerThreeCards: [],
  dealerRoundsWon: 0,
  playerOneRoundsWon: 0,
  playerTwoRoundsWon: 0,
  playerThreeRoundsWon: 0,
  phase: 'Idle',
  message: null,
};

/**
 * Apply a game action to the current state.
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAYER_HIT':
      return {
        ...state,
        playerOneCards: [...state.playerOneCards, action.payload],
      };
    case 'DEALER_DRAW':
      return {
        ...state,
        dealerCards: [...state.dealerCards, action.payload],
      };
    case 'NEW_HAND':
      return {
        ...state,
        dealerCards: action.payload.dealerCards,
        playerOneCards: action.payload.playerCards[0],
        playerTwoCards: action.payload.playerCards[1],
        playerThreeCards: action.payload.playerCards[2],
        phase: 'Dealing',
        message: null,
      };
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.payload,
      };
    case 'INCREMENT_WIN':
      if (action.payload === 'dealer') {
        return {
          ...state,
          dealerRoundsWon: state.dealerRoundsWon + 1,
        };
      }
      return {
        ...state,
        playerOneRoundsWon: state.playerOneRoundsWon + 1,
      };
    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}

/**
 * Determine whether the dealer should take another card.
 */
function shouldDealerHit(dealerValue: ReturnType<typeof getHandValue>) {
  if (dealerValue.total < 17) return true;
  return DEALER_HITS_SOFT_17 && dealerValue.total === 17 && dealerValue.isSoft;
}

/**
 * Manage blackjack round state and player actions.
 */
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { drawCard, shuffleDeck } = useDeck();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stateRef = useRef(state);
  const startNewRoundRef = useRef<() => void>(() => undefined);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /**
   * Transition to settlement and record the winner and message.
   */
  const settleRound = useCallback((winner: 'dealer' | 'player' | 'push', message: string) => {
    dispatch({ type: 'SET_PHASE', payload: 'Settlement' });
    dispatch({ type: 'SET_MESSAGE', payload: message });

    if (winner === 'dealer') {
      dispatch({ type: 'INCREMENT_WIN', payload: 'dealer' });
    } else if (winner === 'player') {
      dispatch({ type: 'INCREMENT_WIN', payload: 'playerOne' });
    }
  }, []);

  /**
   * Initialize a new hand, deal cards, and start the player turn.
   */
  const startNewRound = useCallback(() => {
    clearTimers();
    shuffleDeck();

    const dealerCards = [drawCard(), drawCard()];
    const playerOneCards = [drawCard(), drawCard()];
    const playerTwoCards = [drawCard(), drawCard()];
    const playerThreeCards = [drawCard(), drawCard()];

    dispatch({
      type: 'NEW_HAND',
      payload: {
        dealerCards,
        playerCards: [playerOneCards, playerTwoCards, playerThreeCards],
      },
    });

    addTimer(() => {
      const playerValue = getHandValue(playerOneCards);
      const dealerValue = getHandValue(dealerCards);

      if (playerValue.isBlackjack || dealerValue.isBlackjack) {
        if (playerValue.isBlackjack && dealerValue.isBlackjack) {
          settleRound('push', 'Push! Both have blackjack.');
        } else if (playerValue.isBlackjack) {
          settleRound('player', 'Blackjack! Player wins (3:2).');
        } else {
          settleRound('dealer', 'Dealer has blackjack.');
        }
        return;
      }

      dispatch({ type: 'SET_PHASE', payload: 'PlayerTurn' });
    }, ROUND_START_DELAY_MS);
  }, [clearTimers, shuffleDeck, drawCard, addTimer, settleRound]);

  useEffect(() => {
    startNewRoundRef.current = startNewRound;
  }, [startNewRound]);

  /**
   * Deal one card to the player and settle on bust.
   */
  const hit = useCallback(() => {
    if (stateRef.current.phase !== 'PlayerTurn') return;

    const card = drawCard();
    const updatedCards = [...stateRef.current.playerOneCards, card];
    dispatch({ type: 'PLAYER_HIT', payload: card });

    const playerValue = getHandValue(updatedCards);
    if (playerValue.isBust) {
      settleRound('dealer', 'Busted! Dealer wins.');
    }
  }, [drawCard, settleRound]);

  /**
   * End the player turn and resolve dealer actions.
   */
  const stand = useCallback(() => {
    if (stateRef.current.phase !== 'PlayerTurn') return;

    dispatch({ type: 'SET_PHASE', payload: 'DealerTurn' });

    const dealerDraw = (currentDealerCards: Card[]) => {
      const dealerValue = getHandValue(currentDealerCards);
      const playerValue = getHandValue(stateRef.current.playerOneCards);

      if (shouldDealerHit(dealerValue)) {
        const newCard = drawCard();
        const updatedCards = [...currentDealerCards, newCard];
        dispatch({ type: 'DEALER_DRAW', payload: newCard });
        addTimer(() => dealerDraw(updatedCards), DEALER_DRAW_DELAY_MS);
        return;
      }

      if (dealerValue.isBust) {
        settleRound('player', 'Dealer busted! Player wins.');
      } else if (playerValue.total > dealerValue.total) {
        settleRound('player', 'Player wins!');
      } else if (playerValue.total < dealerValue.total) {
        settleRound('dealer', 'Dealer wins.');
      } else {
        settleRound('push', 'Push!');
      }
    };

    dealerDraw([...stateRef.current.dealerCards]);
  }, [addTimer, drawCard, settleRound]);

  /**
   * Start the next hand immediately.
   */
  const newHand = useCallback(() => {
    clearTimers();
    startNewRound();
  }, [clearTimers, startNewRound]);

  /**
   * Clear the current status message.
   */
  const clearMessage = useCallback(() => {
    dispatch({ type: 'SET_MESSAGE', payload: null });
  }, []);

  return { state, hit, stand, newHand, clearMessage };
}
