# Development Guidelines

This document outlines the code quality standards and best practices for this project. All contributors should follow these guidelines to maintain consistency and code quality.

**IMPORTANT:** All changes, features, and implementations must adhere to these guidelines. Before submitting any code, review this document to ensure compliance with the established standards.

---

## Project Dependencies

### Core Technologies

- **React**: 18.3.1 (NOT React 19)
- **TypeScript**: 4.9.5
- **React Router**: 6.23.1
- **Sass**: 1.77.8

### Important Version Compatibility Notes

- **@types/react**: Should match React version (18.x, NOT 19.x)
- **@types/react-dom**: Should match React version (18.x, NOT 19.x)
- When using react-icons with React 18 and @types/react 19, use type assertions: `const Icon = IconName as React.ElementType`
- Always check package.json before adding dependencies to ensure compatibility

---

## Migration Reference

See [docs/MIGRATION_FRONTEND.md](docs/MIGRATION_FRONTEND.md) for AngularJS-to-React
migration steps and parity checks.

---

## Core Development Principles

### KISS (Keep It Simple, Stupid)

- Write simple, straightforward code that is easy to understand
- Avoid over-engineering solutions
- Choose clarity over cleverness
- Break complex problems into smaller, manageable pieces

### DRY (Don't Repeat Yourself)

- Avoid code duplication
- Extract repeated logic into reusable functions or components
- Use shared utilities and constants instead of hardcoding values
- Create abstractions when the same pattern appears multiple times

### YAGNI (You Aren't Gonna Need It)

- Only implement features that are currently required
- Don't add functionality based on speculation about future needs
- Remove unused code, imports, and dependencies
- Keep the codebase lean and focused

---

## Developer Approaches

### Root Cause Analysis First

- **Investigate the underlying problem** before implementing a solution
- Don't just treat symptoms - understand why the issue exists
- Ask "why" multiple times to get to the root cause
- Document your findings to prevent similar issues

### Architectural Thinking

- **Consider the big picture** before making changes
- Understand how components interact and depend on each other
- Think about scalability and maintainability
- Design solutions that fit within the existing architecture
- Question whether the current architecture supports the change efficiently

### Single Source of Truth

- **Maintain one authoritative source** for each piece of data or logic
- Avoid duplicating state or data across multiple locations
- Use shared constants, configurations, and utilities
- Reference the source rather than copying values

### Pattern Recognition

- **Identify existing patterns** in the codebase before implementing new solutions
- Look for similar problems that have already been solved
- Reuse established patterns for consistency
- When introducing new patterns, ensure they're necessary and well-documented

### Comprehensive Problem Solving

- **Consider all aspects** of a problem before implementing a solution
- Think about edge cases, error scenarios, and user experience
- Evaluate performance, accessibility, and security implications
- Consider both immediate needs and future maintenance

### Technical Debt Reduction

- **Leave code better than you found it** (Boy Scout Rule)
- Address technical debt when working in an area
- Refactor incrementally as part of feature work when appropriate
- Document known technical debt for future reference
- Balance debt reduction with feature delivery

### Change Impact Analysis

- **Assess the impact** of changes before implementation
- Identify all components, files, and systems affected by a change
- Consider backward compatibility and migration paths
- Test thoroughly across all affected areas
- Communicate potential impacts to the team

---

## Developer Workflows

### Check IDE for Errors First

- **Always review IDE errors and warnings** before running or committing code
- **Check the IDE for errors after every change** - don't wait until the end
- Address TypeScript errors immediately - don't ignore or suppress them
- Pay attention to ESLint warnings and errors
- **Fix warnings as well as errors** - warnings often indicate potential issues
- Use the Problems panel in VS Code to see all issues at a glance
- Fix errors at the source rather than working around them
- **This is a mandatory step** - no code should be committed with IDE errors or unresolved warnings

### Code Formatting

- **Run Prettier after creating or updating files** to ensure consistent formatting
- Format individual files or specific changes: `npx prettier --write <file-path>`
- **NEVER run formatters on all files** (e.g., `prettier --write .`) **without explicit permission**
- Running formatters globally can create massive diffs and obscure actual changes
- If you need to format multiple files, request permission first
- Configure your IDE to format on save for files you're actively editing

---

## TypeScript Best Practices

### Proper Typing

- **Always use explicit types** for function parameters and return values
- **Avoid using `any`** - use `unknown` if the type is truly unknown, then narrow it
- **Define interfaces or types** for object shapes and complex data structures
- **Use union types** (`string | number`) and type guards when appropriate
- **Leverage TypeScript's type inference** for variable declarations when the type is obvious

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // implementation
}

// ❌ Bad
function getUser(id: any): any {
  // implementation
}
```

### Type Safety

- Enable strict mode in `tsconfig.json`
- Use readonly for immutable properties
- Utilize const assertions for literal types
- Prefer interfaces for object types, type aliases for unions/intersections

---

## Code Organization & Naming Conventions

### Follow Existing Patterns

- **Review existing code** before creating new files or components
- **Match the project's naming conventions** for files, functions, and variables
- **Maintain consistency** with the established folder structure
- **Follow the same code style** (indentation, spacing, etc.)

### Naming Conventions

- **Components**: PascalCase (e.g., `ContactForm.tsx`, `ProjectCard.tsx`)
- **Utilities/Functions**: camelCase (e.g., `scrollEffects.ts`, `contactFormHandler.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `UserProfile`, `ApiResponse`)
- **Files**: Match the primary export name or purpose

---

## Code Documentation

### When to Add Comments

- **New logic or algorithms**: Explain the "why" behind the approach
- **Complex functions**: Describe what the function does, its parameters, and return value
- **Non-obvious code**: Clarify intent when the code isn't self-explanatory
- **Business logic**: Document requirements or rules that aren't clear from the code
- **Workarounds**: Explain why a workaround was necessary

### Comment Guidelines

- Write clear, concise comments that add value
- Keep comments up-to-date when code changes
- Use JSDoc format for functions and components
- Avoid commenting obvious code
- Use TODO/FIXME/NOTE tags appropriately

```typescript
/**
 * Validates and submits the contact form data to the API.
 *
 * @param formData - The contact form fields to submit
 * @returns Promise that resolves to the API response
 * @throws {ValidationError} If form data is invalid
 */
async function submitContactForm(
  formData: ContactFormData,
): Promise<ApiResponse> {
  // Validate email format before making API call to avoid unnecessary requests
  if (!isValidEmail(formData.email)) {
    throw new ValidationError("Invalid email format");
  }

  // Implementation...
}
```

---

## Change Management

### Minimize Changes

- **Only modify code directly related to the request** or task at hand
- Avoid refactoring unrelated code in the same commit
- Keep pull requests focused and scoped to a single feature or fix
- Resist the urge to "improve" unrelated code while working on a task

### Before Creating New Files

1. **Search for existing files** that serve a similar purpose
2. **Check if functionality already exists** elsewhere in the codebase
3. **Consider extending existing files** rather than creating new ones
4. **Follow the established folder structure** for new files
5. **Ensure the new file is truly necessary** and doesn't duplicate existing functionality

### Checklist Before Committing

- [ ] Have I checked the IDE for errors and warnings?
- [ ] Have I checked for existing similar functionality?
- [ ] Are my changes minimal and focused?
- [ ] Have I removed any unused imports or code?
- [ ] Do my changes follow the existing naming conventions?
- [ ] Have I added appropriate TypeScript types?
- [ ] Have I documented complex or non-obvious code?
- [ ] Have I run Prettier on the files I created or modified?
- [ ] Have I tested my changes?
- [ ] Does my code follow KISS, DRY, and YAGNI principles?

---

## Code Quality Standards

### General Guidelines

- **Write self-documenting code** with clear variable and function names
- **Keep functions small and focused** - ideally under 50 lines
- **Use meaningful variable names** - avoid single-letter names except for common patterns (i, j for loops)
- **Handle errors appropriately** - don't silently swallow exceptions
- **Clean up after yourself** - remove console.logs, commented code, and debug statements

### Component Guidelines

- Keep components focused on a single responsibility
- Extract complex logic into custom hooks or utility functions
- Use props interfaces to define component contracts
- Avoid deep prop drilling - consider context or state management

### Performance Considerations

- Avoid premature optimization
- Use React.memo, useMemo, and useCallback when appropriate
- Be mindful of re-renders and unnecessary computations
- Profile before optimizing

---

## Release Process

### Version Updating

Before each release, update the version number in `src/components/Sections/FooterSection/Footer.tsx`:

- The version format is `m.dd.yy` (month without leading zero, day with leading zero, 2-digit year)
- Update the `version` constant to reflect the release date
- Example: For a release on January 28, 2026, set `const version = '1.28.26';`

```typescript
const version = "1.28.26"; // Version based on release date. Update before every release.
```

---

## Testing

- Write tests for new features and bug fixes
- Follow existing test patterns in the codebase
- Aim for meaningful test coverage, not just high percentages
- Test edge cases and error conditions

---

## Code Review Expectations

When submitting code for review:

- Provide context and reasoning for your changes
- Self-review your code before requesting review from others
- Be open to feedback and willing to make improvements
- Respond to review comments promptly

When reviewing code:

- Check for adherence to these guidelines
- Look for potential bugs or edge cases
- Ensure code is understandable and maintainable
- Provide constructive feedback

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

---

## README Template

Use this template when creating README files for new projects. Customize sections as needed based on project requirements.

### Standard README Structure

````markdown
# [Project Name] - [Project Type/Framework]

[![Badge 1](badge-url)](link)
[![Badge 2](badge-url)](link)
[![Badge 3](badge-url)](link)

[Brief one-sentence description of the project]

## Overview

[1-2 paragraph description of the project, its purpose, and key highlights]

## Features

<details open>
<summary><strong>[Feature Category 1]</strong></summary>

- **[Feature Name]** - [Description]
- **[Feature Name]** - [Description]

</details>

<details open>
<summary><strong>[Feature Category 2]</strong></summary>

- **[Feature Name]** - [Description]
- **[Feature Name]** - [Description]

</details>

## Tech Stack

### Core Technologies

| Technology  | Version | Purpose   |
| ----------- | ------- | --------- |
| [Framework] | X.X.X   | [Purpose] |
| [Language]  | X.X.X   | [Purpose] |

### Key Dependencies

| Package        | Version | Purpose   |
| -------------- | ------- | --------- |
| [Package Name] | X.X.X   | [Purpose] |

### Development Tools

| Tool        | Version | Purpose   |
| ----------- | ------- | --------- |
| [Tool Name] | X.X.X   | [Purpose] |

## Project Structure

```text
src/
├── [folder]/           # [Description]
│   ├── [subfolder]/   # [Description]
│   └── [file].ext    # [Description]
├── [folder]/           # [Description]
└── [file].ext         # [Description]
```
````

## Available Scripts

<details>
<summary><strong>Development Commands</strong></summary>

### `[command]`

[Description of what the command does]

</details>

<details>
<summary><strong>Production Build</strong></summary>

### `[build-command]`

[Description of production build process]

</details>

## [Key System/Feature Name]

[Detailed explanation of a key system or feature]

### [Sub-section]

[Additional details or usage examples]

```[language]
// Code example
```

## Project Development Guidelines

This project follows comprehensive development standards. See [FRONTEND_DEVELOPMENT_GUIDELINES.md](FRONTEND_DEVELOPMENT_GUIDELINES.md) for:

- **Core Principles** - KISS, DRY, YAGNI
- **Code Quality Standards** - [List relevant standards]
- **Component Patterns** - [Framework] best practices
- **Architecture Guidelines** - Root cause analysis, pattern recognition
- **Performance Optimization** - [List optimization approaches]
- **Accessibility** - WCAG compliance

### Key Development Practices

- **Type Safety** - [Type system details]
- **Component Composition** - [Composition approach]
- **Performance** - [Performance strategies]
- **Accessibility** - [Accessibility requirements]
- **Code Quality** - [Quality enforcement tools]

## Building for Production

### [Integration Details if applicable]

[Description of how the project integrates with other systems]

1. **Build command:**

   ```bash
   [build command]
   ```

2. **Build output location:**

   ```text
   [output-folder]/
   ├── [file]
   └── [folder]/
   ```

3. **[Integration System]:**
   - [Integration step 1]
   - [Integration step 2]

### Deployment Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Browser Support

- **Production:**
  - [Browser requirements]

- **Development:**
  - [Browser recommendations]

## Documentation

| Document              | Description   |
| --------------------- | ------------- |
| [GUIDELINES.md](link) | [Description] |
| [OTHER_DOC.md](link)  | [Description] |

## Additional Resources

| Resource              | Description   |
| --------------------- | ------------- |
| [Resource Name](link) | [Description] |

---

Built with [Technology Stack]

```markdown
### Template Usage Guidelines

- **Badges**: Include relevant technology badges at the top for quick tech stack overview
- **Collapsible Sections**: Use `<details>` tags for feature lists to keep README scannable
- **Tables**: Use tables for structured data (dependencies, commands, resources)
- **Code Blocks**: Include language-specific syntax highlighting
- **Links**: Reference other documentation files and external resources
- **Customization**: Remove sections that don't apply to your project
- **Consistency**: Maintain the same formatting style across all project READMEs

---

### _Last Updated: January 28, 2026_
```
