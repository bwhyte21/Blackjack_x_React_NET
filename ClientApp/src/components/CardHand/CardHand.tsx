import type { Card as CardType } from '@/types/game.types';
import { Box, Typography } from '@mui/material';
import { Card } from '../Card/Card';

/**
 * Props for displaying a labeled hand of cards.
 */
interface CardHandProps {
  label: string;
  cards: CardType[];
  isDealer?: boolean;
  revealDealerHoleCard?: boolean;
  hideFirstCard?: boolean;
}

/**
 * Render a player's or dealer's hand.
 */
export function CardHand({
  label,
  cards,
  isDealer = false,
  revealDealerHoleCard = false,
  hideFirstCard = false,
}: CardHandProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 0,
          flexWrap: 'wrap',
          '& > *:not(:first-of-type)': {
            marginLeft: '-12px',
          },
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.value}-${index}`}
            card={card}
            isFaceDown={
              (isDealer && index === 0 && !revealDealerHoleCard) || (hideFirstCard && index === 0)
            }
            animateEntry={index === cards.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
}
