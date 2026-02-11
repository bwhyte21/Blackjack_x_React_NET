# AI Content Hygiene Skill

## Purpose

Ensure AI-generated or AI-assisted changes remove filler and preserve project context after additions or modifications.

## Scope

- Applies to any file edited or created in ClientApp.
- Focus on documentation, comments, and UI copy where filler often appears.
- Do not change behavior or formatting beyond removing slop and correcting context.

## Core Checks

1. Remove placeholders, bracketed text, and template artifacts (e.g., "[Description]", "[Feature Name]").
2. Delete generic filler or boilerplate that is not specific to this project.
3. Validate facts against the current codebase (versions, paths, scripts, features).
4. Ensure project-specific terminology matches existing naming (components, hooks, folders).
5. Keep tone concise and factual; avoid marketing language.

## Execution Steps

1. Scan edited files for placeholders and generic text.
2. Replace with concrete, verified project details or remove the section.
3. Re-read surrounding context to confirm flow and accuracy.
4. Confirm no new placeholders remain.

## Success Criteria

- No placeholder or template artifacts remain in modified files.
- Statements match the current project structure and behavior.
- No unrelated refactors or formatting-only changes were introduced.
