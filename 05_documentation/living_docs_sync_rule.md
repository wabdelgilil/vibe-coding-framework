# Living Documentation Sync Rule

> **Pillar:** [05_documentation](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate documentation drift where `SRS.md`, specs, API contracts, and `README.md` quietly become outdated and mislead future sessions and engineers.

## Mandatory Standards
1. **Atomic Code + Docs Closure:** A task MUST NOT be marked complete until all documentation affected by the code change is updated in the **same** change/PR—never deferred to "later."
2. **Single Source of Truth:** Avoid duplicating the same schema or configuration table across 4 different Markdown files; maintain one authoritative file and link to it via relative paths.
3. **Zero-Drift Verification:** Before closing any milestone, compare modified endpoints, schemas, environment variables, and commands against `SRS.md`, API contracts, `.env.example`, and `README.md`.
4. **Relative Links Only:** All internal cross-references MUST use repository-relative Markdown paths and resolve to existing files.

## Prohibited Anti-Patterns
- Merging schema, API, or CLI flag changes while leaving `SRS.md`, `.env.example`, or contracts stale.
- Saying "I will update the documentation in a follow-up task" and closing the feature.
- Leaving outdated diagrams or removed endpoints documented as active.

## Verification & Audit Checklist
- [ ] All docs impacted by the diff (`SRS.md`, Feature Spec, contracts, `.env.example`, `README.md`) updated in the same change.
- [ ] Zero broken relative links and zero stale references to renamed or deleted symbols/files.
- [ ] Documentation accurately matches actual implemented behavior.
