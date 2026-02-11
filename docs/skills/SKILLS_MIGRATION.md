# Agent Skills and Operating Guidance (Migration)

Skills and behaviors the agent should use when migrating a legacy app to .NET 8 and React.

---

## Target Stack (Migration Goal)

- **Backend** - .NET 8, ASP.NET Core 8, C# 12
- **Frontend** - React 18+, TypeScript, modern bundler (Vite or CRA)
- **Interop** - RESTful endpoints with typed DTOs

---

## Migration Strategy Skills

- **Strangler pattern** - Replace features incrementally, avoid big-bang rewrites
- **Baseline first** - Inventory routes, APIs, dependencies, and build steps
- **Compatibility checks** - Identify framework and library upgrades early
- **Risk isolation** - Small, reversible changes with clear rollback paths
- **Parity verification** - Ensure new UI matches existing behavior before removal

---

## Backend Migration Skills

- **Upgrade path** - Plan .NET Framework to .NET 8 with intermediate steps if needed
- **API surface audit** - Enumerate controllers, routes, payloads, and response codes
- **Modern patterns** - DI, options pattern, async/await, nullable references
- **Security carryover** - Preserve headers, CORS, rate limiting, and validation rules
- **Logging** - Structured logs with safe data handling

---

## Frontend Migration Skills

- **AngularJS to React mapping** - Identify views, controllers, services, and directives
- **Componentization** - Convert templates to React components with clear props
- **State ownership** - Centralize state, avoid duplicated sources of truth
- **Routing conversion** - Map AngularJS routes to React Router
- **UI parity** - Match layout, behavior, and accessibility

---

## Build and Deployment Skills

- **Parallel builds** - Allow old and new frontends to coexist during migration
- **Asset pipeline** - Verify static assets and bundling outputs
- **Environment config** - Move settings to appsettings and environment variables
- **CI steps** - Add lint, test, and build verification for both stacks

---

## Testing and Validation

- **Golden paths** - Validate core flows with before/after checks
- **Regression checks** - Focus on routes, auth, and error handling
- **Security validation** - Confirm CSP/CORS/HSTS/rate limits still apply
- **Performance checks** - Compare payload sizes and response times

---

## Definition of Done (Migration)

- **Feature parity achieved** - No missing pages or behaviors
- **Legacy removed** - AngularJS assets and bindings no longer required
- **.NET 8 running** - Build and deploy in .NET 8 only
- **Documentation updated** - Architecture and run steps reflect new stack

---

### _Last updated: February 10, 2026_
