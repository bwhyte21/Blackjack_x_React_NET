# JSDoc Coverage Plan

Date: 2026-02-10

## Goals

- Improve readability and onboarding by documenting functions and hooks with JSDoc.
- Keep comments concise, accurate, and aligned with TypeScript types.
- Follow frontend guidelines (KISS/DRY/YAGNI, explicit types, minimal changes).
- Avoid documenting trivial or self-evident helpers.

## Scope Rules

- Target: exported functions, hooks, components, and any non-trivial internal helpers.
- Skip: trivial getters/setters, one-line pass-through wrappers, and obvious UI-only handlers.
- Keep JSDoc consistent with existing types; do not duplicate type info unless clarifying intent.

## JSDoc Standard

- Use `/** ... */` blocks above function declarations.
- Include:
  - Summary line (verb-first, short).
  - `@param` for parameters that need explanation beyond the type.
  - `@returns` when return value meaning is not obvious.
  - `@throws` only when errors are intentionally surfaced.
- Prefer plain language over repeating type signatures.

## Work Plan

1. Baseline inventory.

- List all exported functions, hooks, and components in `src/`.
- Identify internal helpers with non-obvious logic (game rules, state transitions).

### Inventory (Initial Scan)

- Hooks: `useGameState`, `useDeck`, `getHandValue`.
- Game logic helpers: `gameReducer`, `shouldDealerHit`, `shuffle`.
- UI helpers: `formatCardValue`, `ScoreColumn`.
- Components: `GameBoard`, `GameControls`, `Scoreboard`, `Card`, `CardHand`.

2. Establish JSDoc patterns.

- Create consistent wording for game actions (deal, hit, stand, settle).
- Define a short glossary for domain terms (hand, round, payout) to reuse in comments.

3. Hooks first.

- Document public contracts and side effects in:
  - `src/hooks/useGameState.ts`
  - `src/hooks/useDeck.ts`
- Highlight state transitions, inputs, and outputs.

4. Components and utilities.

- Add JSDoc to component props and any non-trivial helpers in:
  - `src/components/GameBoard`
  - `src/components/GameControls`
  - `src/components/Scoreboard`
  - `src/components/Card`
  - `src/components/CardHand`

5. Types and shared helpers.

- Add short JSDoc to key types or enums in `src/types/game.types.ts` if intent is unclear.
- Document any shared helper functions introduced during cleanup.

6. Review and cleanup.

- Verify comments match current logic and edge cases.
- Remove redundant or noisy comments.
- Run Prettier on touched files only.
- Check IDE Problems panel for warnings/errors.

## Files in Scope (Expected)

- ClientApp/src/hooks/useGameState.ts
- ClientApp/src/hooks/useDeck.ts
- ClientApp/src/components/Card/Card.tsx
- ClientApp/src/components/CardHand/CardHand.tsx
- ClientApp/src/components/GameBoard/GameBoard.tsx
- ClientApp/src/components/GameControls/GameControls.tsx
- ClientApp/src/components/Scoreboard/Scoreboard.tsx
- ClientApp/src/types/game.types.ts

## Out of Scope

- Backend changes, API integration, or new gameplay rules.
- Refactors unrelated to JSDoc coverage.
- Auto-generating docs from JSDoc or adding new tooling.
