# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Blackjack (21) card game built with ASP.NET MVC 5 (.NET Framework 4.8) backend and AngularJS 1.6.5 frontend. All game logic runs client-side in the browser.

## Building and Running

### Build the Solution

```powershell
# From the BlackJack directory
msbuild BlackJack.sln /t:Build /p:Configuration=Debug
```

### Run with IIS Express

Open the solution in Visual Studio and press F5, or:

```powershell
# IIS Express should be configured to run at http://localhost:51373/
# Path is typically: C:\Program Files\IIS Express\iisexpress.exe
```

### Restore NuGet Packages

```powershell
nuget restore BlackJack\BlackJack.sln
```

## Architecture

### Backend (.NET)

The ASP.NET MVC backend is minimal - it primarily serves as a host for the single-page application. Game logic does NOT run on the server.

- **Controllers**: `HomeController` serves views only (Index, About, Contact actions)
- **Models**: None - no server-side game logic or data models
- **Views**: Razor views in `Views/Home/`, main game view is `Index.cshtml`
- **Configuration**:
  - `App_Start/BundleConfig.cs` - CSS/JS bundling configuration
  - `App_Start/RouteConfig.cs` - MVC routing
  - `Web.config` - ASP.NET configuration (targeting .NET 4.8)

### Frontend (AngularJS)

All game logic is implemented client-side in AngularJS. The app is structured as follows:

**Module**: `blackjackGame` (defined in `Views/Shared/_Layout.cshtml`)

- Depends on `ngRoute` and `ngAnimate`
- AngularJS 1.6.5 loaded from CDN

**Structure** (`Scripts/ang/`):

- **Controllers**:
  - `gameController.js` - Main game logic (hit/stand actions, scoring, round management)
  - `mainController.js` - Minimal, currently unused

- **Services**:
  - `deck.js` - Card deck management, implements Fischer-Yates shuffle, scoring logic with Ace handling (counts as 1 or 11)

- **Directives**:
  - `card.js` - Renders individual playing cards using CSS sprites, handles face-down dealer card

**Game Flow**:

1. `Deck` service initializes and shuffles a 52-card deck
2. `GameController` deals initial cards to dealer and 3 players
3. Player One (user) can hit or stand via buttons in `Index.cshtml`
4. Dealer draws cards until score >= 17
5. Rounds won tracked in `$scope.dealerRoundsWon`, `$scope.playerOneRoundsWon`, etc.
6. Deck reshuffles when less than 26 cards remain

### Key Files

- `BlackJack/BlackJack/Views/Home/Index.cshtml` - Main game UI with ng-controller and card display
- `BlackJack/BlackJack/Views/Shared/_Layout.cshtml` - Layout template, defines AngularJS module and script loading order
- `BlackJack/BlackJack/Scripts/ang/controllers/gameController.js` - Core game logic
- `BlackJack/BlackJack/Scripts/ang/services/deck.js` - Card deck and scoring implementation

## Important Notes

### Script Loading Order

Scripts MUST load in this order (see `_Layout.cshtml`):

1. AngularJS core, ngRoute, ngAnimate (from CDN)
2. Module definition: `angular.module('blackjackGame', ['ngRoute', 'ngAnimate'])`
3. `mainController.js`
4. `deck.js` (service)
5. `card.js` (directive)
6. `gameController.js`

### CSS and Card Display

- Card sprites use CSS classes defined in `Content/cards.css`
- Card images stored in `Content/Images/` (full_deck.png, back_of_card.png)
- Animations defined in `Content/animation.css` (rotate-in, slide-right classes)
- Cards rendered via `card` directive with attributes: `suit`, `value`, `first` (for dealer's face-down card)

### Game State Management

- All game state stored in AngularJS `$scope` variables in `gameController.js`
- No persistence - refreshing browser resets game
- Players Two and Three are dealt cards but have no AI or interaction (UI only shows their cards)

### Development vs Production

The `_Layout.cshtml` includes commented-out minified AngularJS CDN links. Currently uses non-minified versions for better error messages during development.
