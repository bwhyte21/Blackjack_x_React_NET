import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getHandValue, useDeck } from "@/hooks/useDeck";
import type { Card } from "@/types/game.types";

const makeCard = (value: Card["value"], suit: Card["suit"] = "spade"): Card => ({
  value,
  suit,
});

describe("getHandValue", () => {
  it("calculates blackjack", () => {
    const hand = [makeCard("ace"), makeCard("king")];
    const result = getHandValue(hand);

    expect(result.total).toBe(21);
    expect(result.isBlackjack).toBe(true);
    expect(result.isBust).toBe(false);
  });

  it("calculates soft totals with ace", () => {
    const hand = [makeCard("ace"), makeCard("five"), makeCard("five")];
    const result = getHandValue(hand);

    expect(result.total).toBe(21);
    expect(result.isSoft).toBe(true);
  });

  it("detects busts", () => {
    const hand = [makeCard("king"), makeCard("queen"), makeCard("two")];
    const result = getHandValue(hand);

    expect(result.total).toBeGreaterThan(21);
    expect(result.isBust).toBe(true);
  });
});

describe("useDeck", () => {
  it("draws a full deck and then throws", () => {
    const { result } = renderHook(() => useDeck());

    result.current.shuffleDeck();

    const drawn = new Set<string>();
    for (let i = 0; i < 52; i += 1) {
      const card = result.current.drawCard();
      drawn.add(`${card.value}-${card.suit}`);
    }

    expect(drawn.size).toBe(52);
    expect(() => result.current.drawCard()).toThrow("Deck is empty");
  });
});
