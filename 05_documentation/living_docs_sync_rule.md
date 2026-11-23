# Living Documentation Sync Rule

> **Pillar:** [05_documentation](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate documentation drift where `SRS.md`, specs, API contracts, and `README.md` quietly become outdated and mislead future sessions and engineers.

## Mandatory Standards
1. **Atomic Code + Docs Closure:** A task MUST NOT be marked complete until all documentation affected by the code change is updated in the **same** change/PR—never deferred to "later."
2. **Single Source of Truth:** Avoid duplicating the same schema or configuration table across 4 different Markdown files; maintain one authoritative file and link to it via relative paths.
3. **Zero-Drift & Tier-0 Staleness Verification:** Before closing any milestone, compare modified endpoints, schemas, environment variables, and commands against `SRS.md`, API contracts, `.env.example`, `README.md`, **and** the project's primary Tier-0 rule file (`AGENTS.md` / `GEMINI.md` / `CLAUDE.md`) to ensure zero stale commands, renamed paths, or broken trigger links.
4. **Relative Links Only:** All internal cross-references MUST use repository-relative Markdown paths and resolve to existing files.

## Prohibited Anti-Patterns
- Merging schema, API, or CLI flag changes while leaving `SRS.md`, `.env.example`, or contracts stale.
- Leaving outdated build/test commands or renamed folder paths inside `AGENTS.md` / Tier-0 rules.
- Saying "I will update the documentation in a follow-up task" and closing the feature.

## Verification & Audit Checklist
- [ ] All docs impacted by the diff (`SRS.md`, Feature Spec, contracts, `.env.example`, `README.md`) updated in the same change.
- [ ] Primary Tier-0 rule file checked for stale commands, paths, or broken trigger references.
- [ ] Zero broken relative links and zero stale references to renamed or deleted symbols/files.
