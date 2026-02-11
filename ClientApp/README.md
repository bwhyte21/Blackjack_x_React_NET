# ClientApp - Blackjack UI (React + Vite)

ClientApp is the React frontend for the Blackjack experience. It renders the table UI, cards, and game controls while using local state for game flow.

## Overview

This app is built with Vite and React. It runs standalone for local development and produces a static build for deployment.

## Features

- Table layout with dealer and player hands
- Hit/Stand controls
- Round scoring and basic game messaging
- Component and hook tests for UI and game logic

## Tech Stack

### Core Technologies

| Technology | Version | Purpose              |
| ---------- | ------- | -------------------- |
| React      | 19.2.0  | UI framework         |
| TypeScript | 5.9.3   | Static typing        |
| Vite       | 7.3.1   | Dev server and build |
| Sass       | 1.97.3  | Styling              |

### Key Dependencies

| Package       | Version | Purpose                 |
| ------------- | ------- | ----------------------- |
| @mui/material | 7.3.7   | UI components           |
| classnames    | 2.5.1   | Conditional class names |

### Testing

| Tool                     | Version | Purpose                     |
| ------------------------ | ------- | --------------------------- |
| Vitest                   | 3.2.4   | Test runner                 |
| @testing-library/react   | 16.3.0  | Component testing utilities |
| @testing-library/jest-dom| 6.8.0   | DOM matchers                |
| jsdom                    | 26.1.0  | Browser-like test runtime   |

## UI Structure

- `src/components/GameBoard` - Page layout and overall game flow UI
- `src/components/CardHand` - Renders a labeled hand of cards
- `src/components/Card` - Card sprite rendering and animation
- `src/components/GameControls` - Hit/Stand actions
- `src/components/Scoreboard` - Round win counters

## State and Game Logic

- `src/hooks/useGameState.ts` manages phases, round progression, and scoring
- `src/hooks/useDeck.ts` builds/shuffles the deck and calculates hand values
- `src/types/game.types.ts` defines core types and state shapes

## Styling and Theming

- `src/theme.ts` defines the MUI theme
- `src/styles/global.scss` holds baseline global styles
- `src/styles/_variables.scss` stores shared Sass variables
- `src/components/**.module.scss` contains component-scoped styling

## Assets

- Card sprites live in `public/images`

## Development

### Scripts

- `npm run dev` - Start the Vite dev server
- `npm run build` - Type-check and create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run lint and unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Local Run

```bash
npm install
npm run dev
```

### Build Output

Production builds emit to `../wwwroot/dist`.

### Tests

- Unit tests live under `src/**/__tests__`
- Test setup is in `src/test/setupTests.ts`

## Guidelines

See [docs/guidelines/FRONTEND_DEVELOPMENT_GUIDELINES.md](docs/guidelines/FRONTEND_DEVELOPMENT_GUIDELINES.md) for coding standards and workflow requirements.
