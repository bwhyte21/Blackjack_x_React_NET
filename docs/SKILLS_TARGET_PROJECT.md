# Agent Skills and Operating Guidance (Target Project)

Skills and behaviors for the Blackjack_x_AngularJS_NET migration to .NET 8 and React.

Current state assumptions:

- Backend: .NET Framework
- Frontend: AngularJS (version unknown)
- Constraints: none provided

---

## Immediate Discovery Skills

- **Inventory endpoints** - List all controllers, routes, and payload shapes
- **UI map** - Catalog AngularJS views, controllers, services, and directives
- **Dependency audit** - Identify legacy libraries that block .NET 8 or React
- **Build pipeline scan** - Capture current build and deployment steps
- **Risk register** - Note high-risk areas (auth, payments, file uploads)

---

## Backend Migration Skills (.NET Framework to .NET 8)

- **Upgrade plan** - Identify framework gaps, API changes, and third-party blockers
- **API consistency** - Preserve route paths and response contracts
- **Modernization** - Introduce DI, options pattern, async/await, nullable refs
- **Security retention** - Keep current auth, headers, CORS, and validation
- **Health checks** - Add basic monitoring endpoints if missing

---

## Frontend Migration Skills (AngularJS to React)

- **Feature parity** - Replicate existing behavior before refactors
- **Component-first** - Build reusable React components per screen section
- **Routing conversion** - Translate AngularJS routes to React Router
- **State strategy** - Prefer local state, lift only when needed
- **Accessibility** - Match or improve keyboard and screen reader support

---

## Integration and Cutover

- **Parallel run** - Allow old and new frontends during transition
- **API compatibility** - Update clients without breaking existing endpoints
- **Cleanup** - Remove AngularJS assets and legacy build steps after parity

---

## Testing Focus

- **Critical flows** - Login, primary actions, error states
- **Regression checks** - Compare old vs new behavior on core pages
- **Security checks** - Ensure headers and CORS still apply in .NET 8

---

## Documentation Updates

- **New run steps** - .NET 8 build and React dev server instructions
- **Architecture notes** - Describe new frontend and backend layout
- **Migration log** - Track removed legacy pieces and rationale

---

### _Last updated: February 10, 2026_
