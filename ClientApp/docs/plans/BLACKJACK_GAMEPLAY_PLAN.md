# Blackjack Gameplay Update Plan

Date: 2026-02-10

## Goals

- Align gameplay with standard blackjack rules: S17, 3:2 payout, no split/double/surrender/insurance.
- Keep logic simple, centralized, and type-safe.
- Follow frontend and C# guidelines (KISS/DRY/YAGNI, explicit types, minimal changes).
- Let players review the result until they click Continue.
- Show the player's current hand total on the board.

## Rule Specification (Single Source of Truth)

- Decks: 1 deck, reshuffle every round.
- Dealer: stands on soft 17 (S17).
- Blackjack payout: 3:2.
- Options: Hit, Stand only.
- Round flow: Deal -> Player turn -> Dealer turn -> Settlement -> Round end.

## Work Plan

1. Define/confirm game phases and legal actions.

- Add explicit phase enum and guard rules.
- Ensure actions are only possible in the correct phase.

2. Normalize deck and dealing flow.

- Create a new shuffled deck each round.
- Deal cards in standard order: player(s) then dealer.
- Optionally support a face-down dealer card in UI.

3. Centralize hand evaluation.

- Implement helpers for best total, soft/hard totals, blackjack, bust.
- Reuse for both player and dealer to avoid duplication.

4. Implement player actions.

- Hit: deal a card, evaluate, advance on bust.
- Stand: end player turn and advance to dealer.

5. Implement dealer logic (S17).

- Reveal hole card at dealer turn.
- Hit until total >= 17; stand on soft 17.

6. Settlement logic.

- Resolve outcomes and payout rules.
- Store per-hand results for UI display.

7. Manual round advance.

- Remove auto-reset timer after settlement.
- Add an explicit Continue action that starts the next hand.
- Ensure Continue is only enabled during settlement/round end.

8. UI updates.

- Phase-aware controls (disable outside player turn).
- Show totals and round result after settlement.
- Show dealer hole card hidden during player turn (if supported).
- Add a visible player hand total (example: "Queen + 10 = 20") near the player area or scoreboard.

9. QA and cleanup.

- Check IDE errors and warnings.
- Run Prettier on modified frontend files only.

## Files in Scope (Expected)

- ClientApp/src/hooks/useGameState.ts
- ClientApp/src/hooks/useDeck.ts
- ClientApp/src/types/game.types.ts
- ClientApp/src/components/GameControls
- ClientApp/src/components/GameBoard
- ClientApp/src/components/Scoreboard

## Out of Scope

- Backend changes, API persistence, multiplayer enhancements.
- Advanced blackjack options (split, double, surrender, insurance).
