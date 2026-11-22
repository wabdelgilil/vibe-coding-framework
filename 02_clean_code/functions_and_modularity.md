# Functions, Modularity & File Sizing

> **Pillar:** [02_clean_code](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent monolithic god-files, sprawling functions, and copy-paste sprawl that make AI-generated codebases fragile and impossible to maintain.

## Mandatory Standards
1. **Single Responsibility (SRP):** Every module, class, and function MUST own one cohesive responsibility and one clear reason to change.
2. **Hard File & Function Size Ceilings:**
   - Keep source files focused; decompose any file approaching **350–450 lines** into cohesive submodules (`queries`, `mutations`, `validators`, `mappers`, etc.).
   - Keep functions concise (target **≤ 40 lines**, hard ceiling **60 lines**); extract well-named helpers when logic spans multiple conceptual steps.
3. **Disciplined DRY (Not Premature Abstraction):** Extract shared business rules into a single authoritative module when duplicated across 2+ places, while keeping genuinely unrelated concepts decoupled.
4. **Minimal Parameter Lists:** Functions taking > 3–4 parameters MUST accept a typed options/request object rather than positional argument lists.
5. **Zero Circular Dependencies:** Module import graphs MUST remain strictly acyclic (DAG).

## Prohibited Anti-Patterns
- Dumping unrelated routes, helpers, types, and DB queries into a single 800+ line file.
- Copy-pasting business validation or pricing logic across multiple endpoints or components.
- Creating vague "junk drawer" files (`helpers.ts`, `misc.py`, `common_utils.go`) with unrelated functions.
- Over-abstracting a one-off operation into 5 indirection layers (YAGNI violation).

## Verification & Audit Checklist
- [ ] No new or modified source file exceeds 450 lines without explicit justification.
- [ ] Functions are single-responsibility, concise, and avoid long positional parameter lists.
- [ ] Zero duplicated business logic and zero circular module imports.
