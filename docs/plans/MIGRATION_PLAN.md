# Migration Plan: Blackjack .NET Framework 4.8 + AngularJS → .NET 8 + React 18

## Context

This plan modernizes a legacy Blackjack card game by migrating from .NET Framework 4.8 with AngularJS 1.6.5 to .NET 8 with React 18 and SCSS. The current application is a purely client-side game where all logic runs in the browser - the ASP.NET backend only serves the SPA container. The migration will preserve exact game mechanics, card sprite rendering, and 3D rotation animations while modernizing the technology stack.

**Why this migration:**

- .NET Framework 4.8 is in long-term support mode with no new features
- AngularJS reached end-of-life in January 2022
- Bootstrap adds 150KB+ for minimal UI components used; Material UI provides a richer component library with built-in theming
- Modern React + Vite provides faster development with HMR
- SCSS enables better style organization and maintainability

## Architecture Decisions

### Backend: ASP.NET Core MVC (.NET 8)

Since the game is 100% client-side with no API requirements, ASP.NET Core MVC will serve the React SPA from `wwwroot/dist`. This provides a single deployment unit without CORS concerns while allowing future expansion.

### Frontend: React 18 + TypeScript + Vite

- **State Management**: `useState` + `useReducer` (no Redux - game state is simple)
- **Custom Hooks**: `useDeck` (shuffle, draw, score), `useGameState` (game reducer + dealer AI)
- **Build Tool**: Vite (10x faster than CRA, ESM-native, official React recommendation)

### UI Library: Material UI (MUI)

- **MUI Components**: `AppBar`, `Paper`, `Button`, `Grid`, `Typography`, `Container` replace Bootstrap layout/widgets
- **MUI Theming**: Custom theme with dark green table palette, gold accents, and game-appropriate typography
- **Emotion**: MUI's styling engine (included as peer dependency)

### Styling: SCSS (Card-Specific Only)

- **Cards SCSS**: Sprite positioning system (preserve exact pixel values)
- **Animations SCSS**: 3D rotation with keyframe animations
- **Global SCSS**: Minimal body/reset styles only — MUI handles layout, buttons, and containers

## Project Structure

### New Structure (Cleaner & Efficient)

The new project uses a flat, efficient structure eliminating the redundant folder nesting from the old project:

```text
BlackjackReact/
├── BlackjackReact.sln              # Solution file
├── BlackjackReact.csproj           # .NET 8 Web Application
├── Program.cs                       # Minimal hosting configuration
├── appsettings.json                 # Application settings
├── Controllers/
│   └── HomeController.cs           # Single Index() action
├── Views/
│   └── Home/
│       └── Index.cshtml            # SPA container HTML
├── wwwroot/
│   ├── favicon.ico
│   └── dist/                       # Vite build output (git-ignored)
└── ClientApp/                      # React + Vite project
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── public/
    │   └── images/
    │       ├── full_deck.png       # Card sprite sheet
    │       └── back_of_card.png    # Card back image
    └── src/
        ├── main.tsx                # React entry point
        ├── App.tsx                 # Root component with MUI ThemeProvider
        ├── theme.ts                # MUI theme configuration (colors, typography)
        ├── types/
        │   └── game.types.ts       # Card, GameState, GameAction interfaces
        ├── hooks/
        │   ├── useDeck.ts          # Deck service (shuffle, draw, score)
        │   └── useGameState.ts     # Game state reducer + dealer AI
        ├── components/
        │   ├── GameBoard/
        │   │   └── GameBoard.tsx   # Uses MUI Container, Paper, AppBar
        │   ├── Scoreboard/
        │   │   └── Scoreboard.tsx  # Uses MUI Grid, Typography
        │   ├── CardHand/
        │   │   └── CardHand.tsx    # Uses MUI Box, Typography
        │   ├── Card/
        │   │   ├── Card.tsx
        │   │   └── Card.module.scss  # Card-specific wrapper styles
        │   └── GameControls/
        │       └── GameControls.tsx  # Uses MUI Button, Stack
        └── styles/
            ├── _variables.scss     # SCSS variables (card sizes, animation timing)
            ├── _mixins.scss        # Animation mixins
            ├── cards.scss          # Sprite positioning (from cards.css)
            ├── animations.scss     # 3D rotations (from animation.css)
            └── global.scss         # Minimal body reset and card-specific globals
```

### Old Structure (For Reference)

The legacy project has redundant nesting - `BlackJack/BlackJack/` where solution and project share the same name:

```text
Blackjack_x_AngularJS_NET/
└── BlackJack/
    ├── BlackJack.sln               # Solution file
    └── BlackJack/                  # ← Redundant nesting
        ├── BlackJack.csproj
        ├── Controllers/
        ├── Scripts/ang/
        ├── Content/
        └── Views/
```

**Improvement:** The new structure eliminates this redundancy by placing the `.csproj` at the same level as the `.sln`, creating a cleaner, flatter hierarchy.

## Implementation Steps

### Phase 1: Setup .NET 8 Backend (2 hours)

1. **Create new ASP.NET Core MVC project with clean structure**

   ```bash
   # Create in a new directory (not nested inside old project)
   cd c:\DEV\Source\Repos
   dotnet new mvc -n BlackjackReact -f net8.0
   cd BlackjackReact

   # The dotnet CLI creates a flat structure automatically:
   # BlackjackReact/
   # ├── BlackjackReact.csproj
   # ├── Program.cs
   # └── ... (no redundant nested folders)
   ```

2. **Configure Program.cs** for SPA hosting
   - Add static files middleware
   - Configure fallback routing to Index action
   - Enable HTTPS redirection and HSTS

3. **Create HomeController** with single `Index()` action returning View()

4. **Create Views/Home/Index.cshtml** as minimal HTML container

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Blackjack</title>
       <link rel="icon" href="/favicon.ico" />
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/dist/main.js"></script>
     </body>
   </html>
   ```

### Phase 2: Setup React + Vite Frontend (1 hour)

5. **Initialize Vite + React + TypeScript in ClientApp folder**

   ```bash
   # From BlackjackReact root directory
   npm create vite@latest ClientApp -- --template react-ts
   cd ClientApp
   npm install
   npm install @mui/material @emotion/react @emotion/styled sass classnames
   npm install -D @types/node
   ```

6. **Configure vite.config.ts** to build to `../wwwroot/dist`
   - Set `build.outDir: '../wwwroot/dist'`
   - Set `build.emptyOutDir: true`
   - Configure rollup output names (main.js, main.css)
   - Add path alias `@` for `./src`

   Example config:

   ```typescript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import path from "path";

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: "../wwwroot/dist",
       emptyOutDir: true,
     },
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   });
   ```

7. **Update .gitignore** in BlackjackReact root
   - Add `wwwroot/dist/`
   - Add `ClientApp/dist/`
   - Add `ClientApp/node_modules/`

### Phase 3: Port Assets & Create SCSS (3 hours)

8. **Copy card images** from old project
   - Copy `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Content/Images/full_deck.png` → `BlackjackReact/ClientApp/public/images/full_deck.png`
   - Copy `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Content/Images/back_of_card.png` → `BlackjackReact/ClientApp/public/images/back_of_card.png`

9. **Create `src/styles/_variables.scss`** (card/animation values only — colors and layout handled by MUI theme)

   ```scss
   // Card dimensions
   $card-width: 83px;
   $card-height: 115px;

   // Animation timing
   $card-animation-duration: 550ms;
   $card-animation-easing: cubic-bezier(
     0.175,
     0.885,
     0.45,
     1.595
   ); // easeOutBack

   // Sprite offsets
   $card-offset-x: 93px;
   $card-offset-y: 115px;
   ```

10. **Create `src/styles/_mixins.scss`**

    ```scss
    @mixin card-animation(
      $duration: $card-animation-duration,
      $easing: $card-animation-easing
    ) {
      transition: all $duration $easing;
    }

    @mixin rotate-3d($angle, $perspective: 300px) {
      transform: perspective($perspective) rotateY($angle);
    }
    ```

11. **Convert `cards.css` → `src/styles/cards.scss`**
    - Port sprite positioning classes using SCSS variables and loops
    - Update image paths to `/images/full_deck.png` and `/images/back_of_card.png`
    - Use SCSS map for values with calculated offsets

    ```scss
    @use "variables" as *;

    .card {
      background: url("/images/full_deck.png") no-repeat;
      width: $card-width;
      height: $card-height;
    }

    .back {
      background: url("/images/back_of_card.png") no-repeat;
      width: $card-width;
      height: $card-height;
      background-position-x: -1px;
    }

    // Suits with SCSS variables
    .diamond {
      background-position-y: 0;
    }
    .club {
      background-position-y: -$card-offset-y;
    }
    .heart {
      background-position-y: -($card-offset-y * 2);
    }
    .spade {
      background-position-y: -($card-offset-y * 3);
    }

    // Values with calculated offsets
    $values: (
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
    );

    @each $name, $index in $values {
      .#{$name} {
        background-position-x: -($card-offset-x * $index);
      }
    }
    ```

12. **Convert `animation.css` → `src/styles/animations.scss`**
    - Remove AngularJS-specific `.ng-enter` classes
    - Create CSS keyframe animations for card entry
    - Preserve exact timing: 550ms, perspective(300px), rotateY(40deg→0deg), opacity 0.7→1

    ```scss
    @use "variables" as *;
    @use "mixins" as *;

    @keyframes rotateInCard {
      from {
        @include rotate-3d(40deg);
        opacity: 0.7;
      }
      to {
        @include rotate-3d(0deg);
        opacity: 1;
      }
    }

    .rotate-in {
      animation: rotateInCard $card-animation-duration $card-animation-easing;
      transform-origin: center;
    }

    @keyframes flipCard {
      0% {
        @include rotate-3d(0deg);
      }
      50% {
        @include rotate-3d(90deg);
      }
      100% {
        @include rotate-3d(0deg);
      }
    }

    .card-flip {
      animation: flipCard $card-animation-duration $card-animation-easing;
    }
    ```

13. **Create `src/styles/global.scss`** (minimal — MUI handles layout, buttons, and containers)

    ```scss
    body {
      margin: 0;
    }
    ```

14. **Create `src/theme.ts`** (MUI theme with game-appropriate colors)

    ```typescript
    import { createTheme } from "@mui/material/styles";

    export const theme = createTheme({
      palette: {
        mode: "dark",
        primary: {
          main: "#1a1a1a",
        },
        secondary: {
          main: "#ffd700",
        },
        background: {
          default: "#0d5d0d",
          paper: "rgba(0, 0, 0, 0.3)",
        },
        warning: {
          main: "#f0ad4e",
        },
        success: {
          main: "#5cb85c",
        },
      },
      typography: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              padding: "12px 30px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "6px",
              transition: "transform 0.1s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              },
            },
          },
        },
      },
    });
    ```

### Phase 4: Create TypeScript Types (1 hour)

15. **Create `src/types/game.types.ts`**

    ```typescript
    export type Suit = "spade" | "diamond" | "club" | "heart";
    export type Value =
      | "two"
      | "three"
      | "four"
      | "five"
      | "six"
      | "seven"
      | "eight"
      | "nine"
      | "ten"
      | "jack"
      | "queen"
      | "king"
      | "ace";

    export interface Card {
      suit: Suit;
      value: Value;
    }

    export interface GameState {
      dealerCards: Card[];
      playerOneCards: Card[];
      playerTwoCards: Card[];
      playerThreeCards: Card[];
      dealerRoundsWon: number;
      playerOneRoundsWon: number;
      playerTwoRoundsWon: number;
      playerThreeRoundsWon: number;
      gameOver: boolean;
    }

    export type GameAction =
      | { type: "HIT" }
      | { type: "STAND" }
      | {
          type: "NEW_HAND";
          payload: { dealerCards: Card[]; playerCards: Card[][] };
        }
      | { type: "DEALER_DRAW"; payload: Card }
      | { type: "DEALER_WIN" }
      | { type: "PLAYER_WIN" }
      | { type: "PUSH" }
      | { type: "BUST" };
    ```

### Phase 5: Port Deck Service to Hook (3 hours)

16. **Create `src/hooks/useDeck.ts`** - Port from `Scripts/ang/services/deck.js`

    **Critical Logic to Preserve:**
    - Fischer-Yates shuffle algorithm (exact implementation from deck.js lines 20-35)
    - Card drawing via `array.pop()` (deck.js line 56)
    - Ace scoring: base value 1, add 10 if result ≤ 21 (deck.js lines 63-92)
    - Reshuffle trigger when `deck.length < 26` (gameController.js line 74)
    - Value map: ace=1, face cards=10, numbers=face value

    **Important:** The deck uses `useRef` (not `useState`) to avoid stale closure issues.
    React batches state updates, so calling `drawCard()` multiple times in succession
    (e.g., 8 times in `newHand`) would read the same stale `useState` value each time.
    `useRef` provides a mutable reference that is always current, matching the original
    AngularJS service's mutable array behavior.

    **Implementation:**

    ```typescript
    import { Card, Suit, Value } from "@/types/game.types";
    import { useRef, useCallback } from "react";

    const suits: Suit[] = ["spade", "diamond", "club", "heart"];
    const values: Value[] = [
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "jack",
      "queen",
      "king",
      "ace",
    ];

    const valueMap: Record<Value, number> = {
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      jack: 10,
      queen: 10,
      king: 10,
      ace: 1,
    };

    // Fischer-Yates shuffle (from deck.js)
    function shuffle(array: Card[]): Card[] {
      const shuffled = [...array];
      let counter = shuffled.length;
      while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = shuffled[counter];
        shuffled[counter] = shuffled[index];
        shuffled[index] = temp;
      }
      return shuffled;
    }

    // Calculate score with Ace handling (from deck.js addScore)
    function addScore(cards: Card[]): number {
      let sum = 0;
      const cardValues = cards.map((c) => c.value);

      for (const value of cardValues) {
        sum += valueMap[value];
      }

      // Handle Ace: if counting as 11 doesn't bust, use 11
      if (cardValues.includes("ace")) {
        const ace11Score = sum + 10;
        if (ace11Score <= 21) {
          sum = ace11Score;
        }
      }

      return sum;
    }

    export function useDeck() {
      const deckRef = useRef<Card[]>([]);

      // Create and shuffle new deck
      const shuffleDeck = useCallback(() => {
        const newDeck: Card[] = [];
        for (const value of values) {
          for (const suit of suits) {
            newDeck.push({ value, suit });
          }
        }
        deckRef.current = shuffle(newDeck);
      }, []);

      // Draw card from deck (mutates ref directly — safe for sequential calls)
      const drawCard = useCallback((): Card => {
        const card = deckRef.current.pop();
        if (!card) throw new Error("Deck is empty");
        return card;
      }, []);

      const getRemainingCards = useCallback(
        () => deckRef.current.length,
        [],
      );

      return { drawCard, addScore, getRemainingCards, shuffleDeck };
    }
    ```

### Phase 6: Port Game Logic to Hook (4 hours)

17. **Create `src/hooks/useGameState.ts`** - Port from `Scripts/ang/controllers/gameController.js`

    **Critical Logic to Preserve:**
    - Hit action: draw card, check for bust (>21), auto-start new hand if busted (lines 22-34)
    - Stand action: dealer draws until score ≥17, handle bust/win/push (lines 37-66)
    - Dealer AI: recursive stand() with 500ms delay between draws (line 43)
    - New hand: reshuffle if <26 cards, deal 2 cards each, 800ms delay (lines 68-93)
    - Timer delays: 300ms for bust check, 500ms for dealer draws, 800ms for new hand

    **Implementation structure:**

    ```typescript
    import { useReducer, useCallback, useEffect } from "react";
    import { GameState, GameAction, Card } from "@/types/game.types";
    import { useDeck } from "./useDeck";

    const initialState: GameState = {
      dealerCards: [],
      playerOneCards: [],
      playerTwoCards: [],
      playerThreeCards: [],
      dealerRoundsWon: 0,
      playerOneRoundsWon: 0,
      playerTwoRoundsWon: 0,
      playerThreeRoundsWon: 0,
      gameOver: true,
    };

    function gameReducer(state: GameState, action: GameAction): GameState {
      switch (action.type) {
        case "HIT":
        // Add card to playerOneCards
        case "DEALER_DRAW":
        // Add card to dealerCards
        case "NEW_HAND":
        // Reset cards, set gameOver to false
        case "DEALER_WIN":
        // Increment dealerRoundsWon
        case "PLAYER_WIN":
        // Increment playerOneRoundsWon
        case "BUST":
        case "PUSH":
        default:
          return state;
      }
    }

    export function useGameState() {
      const [state, dispatch] = useReducer(gameReducer, initialState);
      const { drawCard, addScore, getRemainingCards, shuffleDeck } = useDeck();

      const hit = useCallback(() => {
        // Port hit() logic from gameController.js
        // 300ms timeout to check bust
      }, [drawCard, addScore]);

      const stand = useCallback(() => {
        // Port stand() logic from gameController.js
        // Recursive dealer draws with 500ms delay
      }, [drawCard, addScore]);

      const newHand = useCallback(() => {
        // Port newHand() logic from gameController.js
        // Reshuffle if <26 cards
        // Deal 2 cards to each player
        // 800ms delay before setting gameOver to false
      }, [drawCard, getRemainingCards, shuffleDeck]);

      return { state, hit, stand, newHand };
    }
    ```

### Phase 7: Build React Components (6 hours)

18. **Create `src/components/Card/Card.tsx`** - Port from `Scripts/ang/directives/card.js`

    ```tsx
    import { Card as CardType } from "@/types/game.types";
    import classNames from "classnames";
    import styles from "./Card.module.scss";

    interface CardProps {
      card: CardType;
      isFaceDown?: boolean;
      animateEntry?: boolean;
    }

    export function Card({
      card,
      isFaceDown = false,
      animateEntry = false,
    }: CardProps) {
      const cardClasses = classNames(
        "card",
        { [card.suit]: !isFaceDown },
        { [card.value]: !isFaceDown },
        { back: isFaceDown },
        { "rotate-in": animateEntry },
      );

      return (
        <div className={styles.cardWrapper}>
          <div className={cardClasses} />
        </div>
      );
    }
    ```

19. **Create `src/components/Card/Card.module.scss`**

    ```scss
    .cardWrapper {
      display: inline-block;
      margin: 5px;
    }
    ```

20. **Create `src/components/CardHand/CardHand.tsx`** (uses MUI `Box` and `Typography`)

    ```tsx
    import { Box, Typography } from "@mui/material";
    import { Card as CardType } from "@/types/game.types";
    import { Card } from "../Card/Card";

    interface CardHandProps {
      label: string;
      cards: CardType[];
      isDealer?: boolean;
      gameOver?: boolean;
    }

    export function CardHand({
      label,
      cards,
      isDealer = false,
      gameOver = false,
    }: CardHandProps) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {cards.map((card, index) => (
              <Card
                key={`${card.suit}-${card.value}-${index}`}
                card={card}
                isFaceDown={isDealer && index === 0 && !gameOver}
                animateEntry={true}
              />
            ))}
          </Box>
        </Box>
      );
    }
    ```

21. **Create `src/components/Scoreboard/Scoreboard.tsx`** (uses MUI `Grid` and `Typography`)

    ```tsx
    import { Grid, Typography } from "@mui/material";

    interface ScoreboardProps {
      dealerWins: number;
      playerOneWins: number;
      playerTwoWins: number;
      playerThreeWins: number;
    }

    function ScoreColumn({ label, score }: { label: string; score: number }) {
      return (
        <Grid item xs={3} sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="h5" color="secondary">
            {score}
          </Typography>
        </Grid>
      );
    }

    export function Scoreboard({
      dealerWins,
      playerOneWins,
      playerTwoWins,
      playerThreeWins,
    }: ScoreboardProps) {
      return (
        <Grid container spacing={2}>
          <ScoreColumn label="Dealer" score={dealerWins} />
          <ScoreColumn label="Player One" score={playerOneWins} />
          <ScoreColumn label="Player Two" score={playerTwoWins} />
          <ScoreColumn label="Player Three" score={playerThreeWins} />
        </Grid>
      );
    }
    ```

22. **Create `src/components/GameControls/GameControls.tsx`** (uses MUI `Button` and `Stack`)

    ```tsx
    import { Button, Stack } from "@mui/material";

    interface GameControlsProps {
      onHit: () => void;
      onStand: () => void;
      disabled?: boolean;
    }

    export function GameControls({
      onHit,
      onStand,
      disabled = false,
    }: GameControlsProps) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="warning"
            onClick={onHit}
            disabled={disabled}
          >
            Hit
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onStand}
            disabled={disabled}
          >
            Stand
          </Button>
        </Stack>
      );
    }
    ```

23. **Create `src/components/GameBoard/GameBoard.tsx`** - Main orchestrator (uses MUI `AppBar`, `Toolbar`, `Container`, `Paper`)

    ```tsx
    import { useEffect } from "react";
    import {
      AppBar,
      Toolbar,
      Typography,
      Container,
      Paper,
    } from "@mui/material";
    import { useGameState } from "@/hooks/useGameState";
    import { Scoreboard } from "../Scoreboard/Scoreboard";
    import { CardHand } from "../CardHand/CardHand";
    import { GameControls } from "../GameControls/GameControls";

    export function GameBoard() {
      const { state, hit, stand, newHand } = useGameState();

      useEffect(() => {
        // Start first hand on mount
        newHand();
      }, []);

      return (
        <>
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h5" fontWeight="bold">
                BLACKJACK!
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Spacer for fixed AppBar */}

          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Scoreboard
                dealerWins={state.dealerRoundsWon}
                playerOneWins={state.playerOneRoundsWon}
                playerTwoWins={state.playerTwoRoundsWon}
                playerThreeWins={state.playerThreeRoundsWon}
              />
            </Paper>

            <Paper sx={{ p: 3, mb: 2 }}>
              <CardHand
                label="Dealer"
                cards={state.dealerCards}
                isDealer={true}
                gameOver={state.gameOver}
              />
            </Paper>

            <Paper sx={{ p: 3, mb: 2 }}>
              <CardHand
                label="Player One (You)"
                cards={state.playerOneCards}
              />
            </Paper>

            <Paper sx={{ p: 3, mb: 2 }}>
              <CardHand label="Player Two" cards={state.playerTwoCards} />
            </Paper>

            <Paper sx={{ p: 3, mb: 2 }}>
              <CardHand label="Player Three" cards={state.playerThreeCards} />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <GameControls
                onHit={hit}
                onStand={stand}
                disabled={state.gameOver}
              />
            </Paper>
          </Container>
        </>
      );
    }
    ```

24. **Update `src/App.tsx`** (wraps app in MUI `ThemeProvider` and `CssBaseline`)

    ```tsx
    import { ThemeProvider, CssBaseline } from "@mui/material";
    import { theme } from "./theme";
    import { GameBoard } from "./components/GameBoard/GameBoard";
    import "./styles/global.scss";
    import "./styles/cards.scss";
    import "./styles/animations.scss";

    function App() {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GameBoard />
        </ThemeProvider>
      );
    }

    export default App;
    ```

25. **Update `src/main.tsx`**

    ```tsx
    import React from "react";
    import ReactDOM from "react-dom/client";
    import App from "./App";

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    ```

### Phase 8: Testing & Refinement (4 hours)

26. **Test deck logic**
    - Verify Fischer-Yates shuffle produces random distributions
    - Test Ace scoring: A-K should be 21, A-A-9 should be 21, A-A-A-8 should be 21
    - Confirm reshuffle triggers at <26 cards

27. **Test game mechanics**
    - Hit until bust (score >21) - verify dealer wins
    - Stand at 18 - verify dealer draws until 17+
    - Test dealer bust (>21) - verify player wins
    - Test push scenario (equal scores)

28. **Test animations**
    - Verify card entry animation (3D rotation, 550ms)
    - Confirm dealer hole card flips on gameOver state change
    - Check timing feels identical to original

29. **Replace browser alerts** with better UX
    - Consider MUI `Snackbar`/`Alert` components or dialog
    - Show "Busted!", "Dealer Busted!", "Push!", "You Win!" messages

30. **Cross-browser testing** (Chrome, Firefox, Safari, Edge)

### Phase 9: Build Configuration (2 hours)

31. **Configure Vite production build**
    - Verify output to `wwwroot/dist` is correct
    - Test minification and tree-shaking
    - Ensure source maps are generated for debugging

32. **Add MSBuild pre-build task** (optional) to auto-build React

    ```xml
    <Target Name="BuildClientApp" BeforeTargets="Build">
      <Exec Command="npm install" WorkingDirectory="ClientApp" />
      <Exec Command="npm run build" WorkingDirectory="ClientApp" />
    </Target>
    ```

33. **Test production build**

    ```bash
    cd ClientApp
    npm run build
    cd ..
    dotnet run --configuration Release
    ```

34. **Update CLAUDE.md** with new architecture and build commands

## Critical Files to Port

**From Old Project (note redundant BlackJack/BlackJack/ structure):**

1. **Game Logic - Deck Service**
   - Old: `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Scripts/ang/services/deck.js`
   - New: `BlackjackReact/ClientApp/src/hooks/useDeck.ts`
   - Port: Fischer-Yates shuffle (lines 20-35), Ace scoring logic (lines 63-92)

2. **Game Logic - Game Controller**
   - Old: `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Scripts/ang/controllers/gameController.js`
   - New: `BlackjackReact/ClientApp/src/hooks/useGameState.ts`
   - Port: Hit/Stand/NewHand logic (lines 22-93), Dealer AI with recursive drawing

3. **Card Rendering - Directive**
   - Old: `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Scripts/ang/directives/card.js`
   - New: `BlackjackReact/ClientApp/src/components/Card/Card.tsx`
   - Port: Face-down card logic, hole card reveal on gameOver

4. **Styling - Card Sprites**
   - Old: `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Content/cards.css`
   - New: `BlackjackReact/ClientApp/src/styles/cards.scss`
   - Port: Sprite positioning (preserve exact pixel values), convert to SCSS with variables

5. **Styling - Animations**
   - Old: `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Content/animation.css`
   - New: `BlackjackReact/ClientApp/src/styles/animations.scss`
   - Port: 3D rotation timing and easing (550ms, easeOutBack), remove .ng-enter classes

6. **Assets - Card Images**
   - Old: `Blackjack_x_AngularJS_NET/BlackJack/BlackJack/Content/Images/`
   - New: `BlackjackReact/ClientApp/public/images/`
   - Copy: full_deck.png, back_of_card.png (no modifications needed)

## Verification Steps

After implementation, verify:

1. **Build & Run**

   ```bash
   # Terminal 1: Vite dev server
   cd ClientApp
   npm run dev

   # Terminal 2: .NET backend
   cd ..
   dotnet run

   # Navigate to http://localhost:5000
   ```

2. **Game Mechanics**
   - Deal initial hand (2 cards each)
   - Hit button adds card to Player One
   - Stand button triggers dealer AI (draws until 17+)
   - Bust detection works (>21 auto-loses)
   - Scoring displays correctly
   - Reshuffle happens at <26 cards

3. **Visual Fidelity**
   - Cards render with correct sprites (suit + value combination)
   - Dealer's first card is face-down
   - Dealer's hole card flips on game end
   - 3D rotation animation plays on new cards (550ms)
   - Layout matches original (scoreboard, 4 player sections, controls)

4. **Production Build**

   ```bash
   cd ClientApp
   npm run build
   cd ..
   dotnet publish -c Release
   ```

## Dependencies

**Backend (.NET 8):**

- None beyond ASP.NET Core MVC (included in SDK)

**Frontend (React):**

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@mui/material": "^5.15.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "classnames": "^2.5.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.11",
    "sass": "^1.83.4",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/node": "^22.10.5"
  }
}
```

**Total Production Bundle Size:** ~250KB gzipped (React + MUI + game code + SCSS compiled)

## Post-Migration Considerations

After successful migration, consider:

- Replace browser `alert()` with MUI `Snackbar`/`Alert` or `Dialog` components
- Add sound effects (card deal, win/loss)
- Implement betting system (replace round counters)
- Mobile responsive layout (touch-friendly controls)
- Add unit tests with Vitest
- Consider multiplayer with SignalR
