import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import type { Card } from "@/types/game.types";
import { useGameState } from "@/hooks/useGameState";

let drawCardMock = vi.fn();
let shuffleDeckMock = vi.fn();

const makeCard = (value: Card["value"], suit: Card["suit"] = "spade"): Card => ({
  value,
  suit,
});

vi.mock("@/hooks/useDeck", async () => {
  const actual = await vi.importActual<typeof import("@/hooks/useDeck")>("@/hooks/useDeck");
  return {
    ...actual,
    useDeck: () => ({
      drawCard: drawCardMock,
      shuffleDeck: shuffleDeckMock,
    }),
  };
});

const seedDeck = (cards: Card[]) => {
  const queue = [...cards];
  drawCardMock.mockImplementation(() => {
    const card = queue.shift();
    if (!card) throw new Error("Deck is empty");
    return card;
  });
};

describe("useGameState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    drawCardMock = vi.fn();
    shuffleDeckMock = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("enters player turn after dealing", () => {
    seedDeck([
      makeCard("five"),
      makeCard("six"),
      makeCard("ten"),
      makeCard("nine"),
      makeCard("two"),
      makeCard("three"),
      makeCard("four"),
      makeCard("seven"),
    ]);

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.newHand();
    });

    expect(result.current.state.phase).toBe("Dealing");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.state.phase).toBe("PlayerTurn");
  });

  it("settles to dealer when player busts on hit", () => {
    seedDeck([
      makeCard("two"),
      makeCard("three"),
      makeCard("ten"),
      makeCard("nine"),
      makeCard("four"),
      makeCard("seven"),
      makeCard("six"),
      makeCard("five"),
      makeCard("five"),
    ]);

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.newHand();
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.hit();
    });

    expect(result.current.state.phase).toBe("Settlement");
    expect(result.current.state.message).toBe("Busted! Dealer wins.");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.state.phase).toBe("Settlement");
  });
});
