import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardHand } from "../CardHand";
import type { Card } from "@/types/game.types";

const makeCard = (value: Card["value"], suit: Card["suit"]): Card => ({
  value,
  suit,
});

describe("CardHand", () => {
  it("hides the dealer hole card when not revealed", () => {
    render(
      <CardHand
        label="Dealer"
        isDealer={true}
        revealDealerHoleCard={false}
        cards={[makeCard("queen", "heart"), makeCard("five", "spade")]}
      />
    );

    expect(screen.getAllByAltText("Card back")).toHaveLength(1);
    expect(screen.getByAltText("five of spade")).toBeInTheDocument();
  });

  it("shows all cards when reveal is true", () => {
    render(
      <CardHand
        label="Dealer"
        isDealer={true}
        revealDealerHoleCard={true}
        cards={[makeCard("queen", "heart"), makeCard("five", "spade")]}
      />
    );

    expect(screen.queryByAltText("Card back")).toBeNull();
    expect(screen.getByAltText("queen of heart")).toBeInTheDocument();
  });
});
