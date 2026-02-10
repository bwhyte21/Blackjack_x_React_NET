# Backend Migration Guide (.NET Framework to .NET 8)

This document captures the .NET Framework to .NET 8 migration guidance for this project.

---

## Migration Context

- The current backend is .NET Framework and will be upgraded to .NET 8.
- Target stack versions in the backend guidelines reflect the desired end state.
- Validate upgrade steps against current dependencies and API behavior.

---

## Migration Practices

- **Upgrade assessment** - Identify framework gaps and replacement APIs early
- **API contract stability** - Preserve routes, status codes, and payload shapes
- **Hosting model shift** - Plan for Program.cs minimal hosting and DI updates
- **Config migration** - Move legacy config to appsettings and environment variables
- **Library parity** - Replace .NET Framework-only packages with .NET 8 equivalents

---

## Validation Checklist

- **API contracts preserved** - Routes and payloads unchanged or documented
- **Config migrated** - All settings moved and verified per environment
- **Dependency audit** - Legacy packages replaced or removed
- **Behavior verified** - Error handling and logging unchanged or improved

---

### _Last updated: February 10, 2026_
