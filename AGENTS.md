# AGENTS.md

This file provides guidance to Mistral Vibe Code  when working with code in this repository.

## Project Overview

A Blackjack (21) card game built with ASP.NET Core MVC (.NET 9) backend and React 18 + TypeScript frontend. All game logic runs client-side in the browser via React hooks. The ASP.NET backend serves the SPA from `wwwroot/dist`.

## Building and Running

### Build Everything (Backend + Frontend)

```bash
dotnet build
```

This triggers MSBuild which automatically runs `npm install` and `npm run build` in `ClientApp/` before building the .NET project.

### Run the Application

```bash
dotnet run
```

Navigate to `https://localhost:5001` (or the port shown in console output).

### Frontend Development (Vite HMR)

```bash
cd ClientApp
npm run dev
```

This starts the Vite dev server with hot module replacement at `http://localhost:5173`.

### Production Build

```bash
cd ClientApp
npm run build
cd ..
dotnet publish -c Release
```

## Architecture

### Backend (.NET 9)

The ASP.NET Core MVC backend is minimal — it serves the React SPA. No API endpoints or server-side game logic.

- **`Program.cs`** — Minimal hosting with static files middleware and SPA fallback routing
- **`Controllers/HomeController.cs`** — Single `Index()` action returning the SPA container view
- **`Views/Home/Index.cshtml`** — Minimal HTML that loads `/dist/main.js` and `/dist/index.css`
- **`BlackjackReact.csproj`** — Includes MSBuild target that auto-builds React before .NET build

### Frontend (React 18 + TypeScript + Vite)

All game logic is implemented client-side in React with TypeScript. Located in `ClientApp/src/`.

**Types** (`types/`):

- `game.types.ts` — `Card`, `Suit`, `Value`, `GameState`, `GameAction` type definitions

**Hooks** (`hooks/`):

- `useDeck.ts` — Card deck management: Fischer-Yates shuffle, card drawing via `useRef` (avoids stale closures), Ace-aware scoring (1 or 11)
- `useGameState.ts` — Game state via `useReducer`: hit/stand/newHand actions, dealer AI with recursive 500ms draws, bust detection, round scoring

**Components** (`components/`):

- `GameBoard/GameBoard.tsx` — Main orchestrator: MUI AppBar, Container, Paper layout; wires hooks to child components; Snackbar for game messages
- `Card/Card.tsx` — Renders individual cards using CSS sprite classes (`card`, suit, value, `back`, `rotate-in`)
- `CardHand/CardHand.tsx` — Displays a player's hand with face-down logic for dealer's first card
- `Scoreboard/Scoreboard.tsx` — MUI Grid showing rounds won per player
- `GameControls/GameControls.tsx` — Hit/Stand MUI Buttons, disabled when `gameOver` is true

**Styles** (`styles/`):

- `_variables.scss` — Card dimensions (83x115px), animation timing (550ms), sprite offsets (93px x, 115px y)
- `_mixins.scss` — Card animation and 3D rotation mixins
- `cards.scss` — Sprite positioning for suits and values (maps to `full_deck.png`)
- `animations.scss` — `rotateInCard` and `flipCard` keyframe animations (3D perspective rotation)
- `global.scss` — Minimal body reset (MUI handles everything else)

**Theme** (`theme.ts`):

- MUI dark theme: green table background (`#0d5d0d`), gold accents (`#ffd700`), custom Button and Paper overrides

**Entry Points**:

- `main.tsx` — React root with StrictMode
- `App.tsx` — ThemeProvider + CssBaseline + GameBoard + style imports

### Game Flow

1. `useDeck` creates and shuffles a 52-card deck (stored in `useRef`)
2. `useGameState` calls `newHand()` on mount — deals 2 cards to dealer and 3 players
3. Player One (user) clicks Hit or Stand buttons
4. **Hit**: draws card, checks bust after 300ms delay; if bust, dealer wins, new hand after 800ms
5. **Stand**: dealer draws recursively until score >= 17 (500ms between draws); compares scores
6. Deck reshuffles when < 26 cards remain
7. Game messages shown via MUI Snackbar (replaced browser `alert()`)

### Key Files

- `ClientApp/src/hooks/useDeck.ts` — Deck service (shuffle, draw, score)
- `ClientApp/src/hooks/useGameState.ts` — Core game logic (hit, stand, newHand, dealer AI)
- `ClientApp/src/components/GameBoard/GameBoard.tsx` — Main UI orchestrator
- `ClientApp/src/styles/cards.scss` — Card sprite positioning
- `ClientApp/src/types/game.types.ts` — TypeScript interfaces
- `Views/Home/Index.cshtml` — SPA container HTML

## Important Notes

### Card Sprite System

- Card sprites use CSS classes from `cards.scss` applied to div elements
- `full_deck.png` sprite sheet: 93px column width, 115px row height
- Suits: `.diamond` (row 0), `.club` (row 1), `.heart` (row 2), `.spade` (row 3)
- Values: `.ace` through `.king` (columns 0-12, calculated via SCSS loop)
- Face-down card: `.back` class uses `back_of_card.png`
- Images served from `wwwroot/images/` (production) and `ClientApp/public/images/` (Vite dev)

### State Management

- Game state managed via `useReducer` in `useGameState.ts`
- Deck stored in `useRef` (not `useState`) to avoid stale closure issues during sequential draws
- Timer refs track all `setTimeout` calls for cleanup
- No persistence — refreshing browser resets game
- Players Two and Three are dealt cards but have no AI or interaction

### Build Pipeline

- Vite builds to `wwwroot/dist/` with predictable filenames (`main.js`, `index.css`)
- MSBuild pre-build target in `.csproj` auto-runs `npm install` + `npm run build`
- `@` path alias maps to `ClientApp/src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
