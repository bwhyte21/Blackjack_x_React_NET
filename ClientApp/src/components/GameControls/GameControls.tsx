import { Button, Stack } from '@mui/material';

/**
 * Props for the game control buttons.
 */
interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
  onContinue: () => void;
  hitStandDisabled?: boolean;
  continueDisabled?: boolean;
}

/**
 * Render the primary action buttons for the round.
 */
export function GameControls({
  onHit,
  onStand,
  onContinue,
  hitStandDisabled = false,
  continueDisabled = false,
}: GameControlsProps) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button variant="contained" color="warning" onClick={onHit} disabled={hitStandDisabled}>
        Hit
      </Button>
      <Button variant="contained" color="success" onClick={onStand} disabled={hitStandDisabled}>
        Stand
      </Button>
      <Button variant="contained" color="primary" onClick={onContinue} disabled={continueDisabled}>
        Continue
      </Button>
    </Stack>
  );
}
