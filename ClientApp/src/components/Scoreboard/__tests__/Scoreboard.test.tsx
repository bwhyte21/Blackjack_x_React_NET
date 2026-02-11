import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Scoreboard } from "../Scoreboard";

describe("Scoreboard", () => {
  it("renders scores for each seat", () => {
    render(
      <Scoreboard
        dealerWins={2}
        playerOneWins={3}
        playerTwoWins={1}
        playerThreeWins={0}
      />
    );

    expect(screen.getByText("Dealer")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Player One")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Player Two")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Player Three")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
