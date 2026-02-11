import type { CSSProperties } from 'react';
import type { Card as CardType } from '@/types/game.types';
import classNames from 'classnames';
import styles from './Card.module.scss';

/**
 * Props for rendering a single playing card.
 */
interface CardProps {
  card: CardType;
  isFaceDown?: boolean;
  animateEntry?: boolean;
}

/**
 * Render a card sprite, optionally face down or animated.
 */
export function Card({ card, isFaceDown = false, animateEntry = false }: CardProps) {
  const cardOffsetX = 84;
  const cardOffsetY = 115;
  const suitRow: Record<CardType['suit'], number> = {
    spade: 0,
    heart: 1,
    diamond: 2,
    club: 3,
  };

  const valueColumn: Record<CardType['value'], number> = {
    ace: 0,
    two: 1,
    three: 2,
    four: 3,
    five: 4,
    six: 5,
    seven: 6,
    eight: 7,
    nine: 8,
    ten: 9,
    jack: 10,
    queen: 11,
    king: 12,
  };

  const cardStyle = !isFaceDown
    ? ({
        '--card-x': `-${valueColumn[card.value] * cardOffsetX}px`,
        '--card-y': `-${suitRow[card.suit] * cardOffsetY}px`,
      } as CSSProperties)
    : undefined;

  const cardClasses = classNames(styles.card, {
    [styles.rotateIn]: animateEntry,
  });

  return (
    <div className={styles.cardWrapper}>
      <div className={cardClasses} style={cardStyle}>
        {isFaceDown ? (
          <img className={styles.backImage} src="/images/back_of_card.png" alt="Card back" />
        ) : (
          <img
            className={styles.sprite}
            src="/images/full_deck.png"
            alt={`${card.value} of ${card.suit}`}
          />
        )}
      </div>
    </div>
  );
}
