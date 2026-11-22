# Forbidden Shortcuts

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Block happy-path-only implementations, superficial stubs, and deceptive workarounds that make a feature appear functional while hiding defects. Applies to all production code, migrations, configurations, and tests.

## Mandatory Standards
1. **Complete Implementations Only:** Every function, endpoint, handler, and UI state MUST handle valid inputs, invalid inputs, empty states, and failure paths before being marked complete.
2. **Real Logic Over Simulated Outputs:** Production code MUST execute real business logic and data access. Hardcoded return values, fake delays, or static arrays pretending to be dynamic queries are prohibited outside explicit test fixtures.
3. **Explicit Error Propagation:** Every caught error MUST be handled meaningfully (typed recovery, contextual rethrow, or structured error response). Silent suppression is strictly forbidden.
4. **Honest Type & Lint Compliance:** Code MUST satisfy the project's strict type checker and linter cleanly rather than disabling checks inline.

## Prohibited Anti-Patterns
- Leaving unimplemented stubs (`TODO: implement later`, bare `pass`, `...`, `throw new Error('not implemented')`) in committed code.
- Empty error blocks (`catch {}`, `except Exception: pass`, `.catch(() => {})`).
- Inline rule suppression (`@ts-ignore`, `@ts-nocheck`, `eslint-disable`, `# noqa`, `# type: ignore`) used to hide real defects.
- Weakening or deleting failing tests to make a pipeline turn green.
- Hardcoding environment-specific URLs, credentials, tenant IDs, or sample records inside application logic.

## Verification & Audit Checklist
- [ ] Zero unresolved `TODO`, `FIXME`, stub functions, or empty `catch`/`except` blocks in changed files.
- [ ] Zero unjustified linter or type-checker suppression directives.
- [ ] All error, empty, and boundary states verified alongside the happy path.
