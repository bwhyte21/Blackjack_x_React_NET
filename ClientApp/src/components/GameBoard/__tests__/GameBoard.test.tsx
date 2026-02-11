import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { GameState } from "@/types/game.types";
import { GameBoard } from "../GameBoard";

const hitMock = vi.fn();
const standMock = vi.fn();
const newHandMock = vi.fn();
const clearMessageMock = vi.fn();

let mockState: GameState;

vi.mock("@/hooks/useGameState", () => ({
  useGameState: () => ({
    state: mockState,
    hit: hitMock,
    stand: standMock,
    newHand: newHandMock,
    clearMessage: clearMessageMock,
  }),
}));

const baseState: GameState = {
  dealerCards: [],
  playerOneCards: [],
  playerTwoCards: [],
  playerThreeCards: [],
  dealerRoundsWon: 0,
  playerOneRoundsWon: 0,
  playerTwoRoundsWon: 0,
  playerThreeRoundsWon: 0,
  phase: "Idle",
  message: null,
};

describe("GameBoard", () => {
  beforeEach(() => {
    hitMock.mockClear();
    standMock.mockClear();
    newHandMock.mockClear();
    clearMessageMock.mockClear();
  });

  it("shows the player hand total", () => {
    mockState = {
      ...baseState,
      phase: "PlayerTurn",
      playerOneCards: [
        { value: "queen", suit: "heart" },
        { value: "ten", suit: "spade" },
      ],
    };

    render(<GameBoard />);

    expect(screen.getByText("Queen + 10 = 20")).toBeInTheDocument();
  });

  it("enables continue during settlement", async () => {
    const user = userEvent.setup();
    mockState = {
      ...baseState,
      phase: "Settlement",
      playerOneCards: [{ value: "queen", suit: "heart" }],
    };

    render(<GameBoard />);
    newHandMock.mockClear();

    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(continueButton).toBeEnabled();

    await user.click(continueButton);

    expect(newHandMock).toHaveBeenCalledTimes(1);
  });
});
