# Type Safety & Explicit Contracts

> **Pillar:** [02_clean_code](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate runtime shape mismatches, silent `undefined`/`None` crashes, and implicit data contracts across module, service, and API boundaries.

## Mandatory Standards
1. **Strict Static Typing Everywhere:** Enable the strictest compiler/type-checker mode supported by the project's language. Every public function signature, parameter, return type, and data model MUST be explicitly typed.
2. **Zero Escape-Hatch Types:** Untyped escape hatches (`any`, raw untyped dicts/maps for structured domain objects, unchecked casts) are prohibited unless strictly isolated at a validated external boundary.
3. **Schema Validation at System Edges:** All external data (HTTP payloads, CLI inputs, environment variables, third-party API responses, file reads) MUST be parsed and validated through an explicit schema before entering domain logic.
4. **Single Source of Truth for Contracts:** Shared request/response DTOs, enums, and domain types MUST be defined once and imported across layers—never manually duplicated out of sync.
5. **Explicit Nullability & Error Return Types:** Represent optional values and failure states explicitly in types rather than returning ambiguous `null`/`false`/`-1` sentinels.

## Prohibited Anti-Patterns
- Casting external JSON directly to internal domain types without runtime validation.
- Using `any` / `Object` / untyped dictionaries to bypass compiler errors.
- Duplicating the same entity interface independently in backend, frontend, and test files.

## Verification & Audit Checklist
- [ ] Strict type checker passes with zero errors and zero new escape-hatch types.
- [ ] Every external boundary validates incoming data against a typed schema.
- [ ] Shared contracts and enums have a single authoritative definition.
