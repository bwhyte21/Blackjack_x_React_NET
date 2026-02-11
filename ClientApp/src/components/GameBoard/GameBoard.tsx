import { useEffect } from 'react';
import { getHandValue } from '@/hooks/useDeck';
import { useGameState } from '@/hooks/useGameState';
import type { Value } from '@/types/game.types';
import { Alert, AppBar, Container, Paper, Snackbar, Toolbar, Typography } from '@mui/material';
import { CardHand } from '../CardHand/CardHand';
import { GameControls } from '../GameControls/GameControls';
import { Scoreboard } from '../Scoreboard/Scoreboard';

/**
 * Render the main game layout and wire controls to game state.
 */
export function GameBoard() {
  const { state, hit, stand, newHand, clearMessage } = useGameState();
  const revealDealerHoleCard =
    state.phase === 'DealerTurn' || state.phase === 'Settlement' || state.phase === 'RoundEnd';
  const canContinue = state.phase === 'Settlement' || state.phase === 'RoundEnd';
  const playerHandValue = getHandValue(state.playerOneCards);

  /**
   * Convert a card value into a display-friendly label.
   */
  const formatCardValue = (value: Value) => {
    switch (value) {
      case 'ace':
        return 'Ace';
      case 'jack':
        return 'Jack';
      case 'queen':
        return 'Queen';
      case 'king':
        return 'King';
      case 'ten':
        return '10';
      case 'nine':
        return '9';
      case 'eight':
        return '8';
      case 'seven':
        return '7';
      case 'six':
        return '6';
      case 'five':
        return '5';
      case 'four':
        return '4';
      case 'three':
        return '3';
      case 'two':
        return '2';
      default:
        return value;
    }
  };

  const playerHandText =
    state.playerOneCards.length > 0
      ? `${state.playerOneCards.map((card) => formatCardValue(card.value)).join(' + ')} = ${playerHandValue.total}`
      : null;

  useEffect(() => {
    // Start first hand on mount
    newHand();
  }, [newHand]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h5" fontWeight="bold">
            BLACKJACK!
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Scoreboard
            dealerWins={state.dealerRoundsWon}
            playerOneWins={state.playerOneRoundsWon}
            playerTwoWins={state.playerTwoRoundsWon}
            playerThreeWins={state.playerThreeRoundsWon}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <CardHand
            label="Dealer"
            cards={state.dealerCards}
            isDealer={true}
            revealDealerHoleCard={revealDealerHoleCard}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <CardHand label="Player One (You)" cards={state.playerOneCards} />
          {playerHandText && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              {playerHandText}
            </Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <CardHand label="Player Two" cards={state.playerTwoCards} hideFirstCard={true} />
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <CardHand label="Player Three" cards={state.playerThreeCards} hideFirstCard={true} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <GameControls
            onHit={hit}
            onStand={stand}
            onContinue={newHand}
            hitStandDisabled={state.phase !== 'PlayerTurn'}
            continueDisabled={!canContinue}
          />
        </Paper>
      </Container>
      <Snackbar
        open={!!state.message}
        autoHideDuration={2000}
        onClose={clearMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={clearMessage}
          severity="info"
          variant="filled"
          sx={{ width: '100%', fontSize: '1.2rem' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </>
  );
}
