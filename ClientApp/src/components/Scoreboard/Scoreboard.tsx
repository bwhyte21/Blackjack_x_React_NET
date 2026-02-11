import { Grid, Typography } from '@mui/material';

/**
 * Props for the round win totals.
 */
interface ScoreboardProps {
  dealerWins: number;
  playerOneWins: number;
  playerTwoWins: number;
  playerThreeWins: number;
}

/**
 * Render a single labeled score column.
 */
function ScoreColumn({ label, score }: { label: string; score: number }) {
  return (
    <Grid size={{ xs: 3 }} sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="h5" color="secondary">
        {score}
      </Typography>
    </Grid>
  );
}

/**
 * Render the scoreboard for dealer and players.
 */
export function Scoreboard({
  dealerWins,
  playerOneWins,
  playerTwoWins,
  playerThreeWins,
}: ScoreboardProps) {
  return (
    <Grid container spacing={2}>
      <ScoreColumn label="Dealer" score={dealerWins} />
      <ScoreColumn label="Player One" score={playerOneWins} />
      <ScoreColumn label="Player Two" score={playerTwoWins} />
      <ScoreColumn label="Player Three" score={playerThreeWins} />
    </Grid>
  );
}
