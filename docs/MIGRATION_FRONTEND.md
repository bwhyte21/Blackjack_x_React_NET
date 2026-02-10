# Frontend Migration Guide (AngularJS to React)

This document captures the AngularJS-to-React migration guidance for this project.

---

## Migration Context

- The current frontend is AngularJS and will be replaced with React.
- React versions listed in the frontend guidelines are the target stack.
- Update target versions after the initial audit if the migration plan requires changes.

---

## Migration Practices

- **Feature parity first** - Match current AngularJS behavior before refactors
- **Route mapping** - Track and map all AngularJS routes to React Router
- **Service adaptation** - Mirror AngularJS services with typed React data layers
- **UI regression checks** - Compare old and new screens for layout and behavior
- **Coexistence plan** - If dual-run is needed, keep integration boundaries explicit

---

## Validation Checklist

- **Routes mapped** - Every AngularJS route has a React Router equivalent
- **Parity confirmed** - Key screens match layout and behavior
- **Data flow stable** - React data layer mirrors service behavior
- **Accessibility preserved** - Keyboard and screen reader support verified

---

### _Last updated: February 10, 2026_
