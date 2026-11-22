# Naming & Readability

> **Pillar:** [02_clean_code](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Make source code immediately comprehensible to any engineer reading it months later without requiring verbal explanation. Applies to all identifiers, control flow, and module structures.

## Mandatory Standards
1. **Domain-Ubiquitous Naming:** Variables, functions, classes, and files MUST use exact domain terms consistent with the SRS and data model—never generic names (`data`, `item`, `temp`, `handleStuff`, `utils2`).
2. **Intent-Revealing Predicates & Actions:** Booleans MUST read as predicates (`isActive`, `hasPermission`, `canRetry`); functions MUST begin with clear verbs matching their side effects (`calculateTotal`, `fetchInvoice`, `validateToken`).
3. **Flat Control Flow (Guard Clauses):** Prefer early returns and guard clauses over deep nesting. Avoid exceeding 3 levels of indentation inside any function.
4. **Zero Magic Literals:** Replace unexplained numbers, status codes, and repeated string keys with named constants or enums.
5. **Single Consistent Convention:** Follow the target language's idiomatic casing and directory conventions uniformly across the entire codebase.

## Prohibited Anti-Patterns
- Cryptic abbreviations (`usrMgr`, `calcVal2`, `tmpArr`, `procObj`) that obscure intent.
- Deeply nested `if/else` pyramids when guard clauses make the logic linear.
- Reusing the same variable name for different meanings or mutating input parameters unexpectedly.
- Clever one-liners that sacrifice clarity for brevity.

## Verification & Audit Checklist
- [ ] All identifiers match domain terminology and reveal intent without comments.
- [ ] Control flow uses guard clauses with ≤ 3 nesting levels.
- [ ] Zero unexplained magic numbers or repeated raw string literals.
