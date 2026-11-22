# Standard Engineering Artifacts Per Feature

> **Pillar:** [05_documentation](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Ensure every added or modified capability produces the required formal engineering documentation—not just code and comments—while scaling depth proportionally to change size.

## Mandatory Standards
1. **Proportional Artifact Matrix:** Every change MUST create or update its corresponding standard artifacts:
   - **Small Bug Fix / Minor Adjustment:** Update `CHANGELOG.md` and only the directly affected section of `SRS.md` or contract docs (no empty boilerplate files).
   - **New Feature / Behavioral Modification:**
     1. Update `SRS.md` with the new or changed functional/non-functional requirements.
     2. Create or update a dedicated `Feature Spec` under `docs/specs/<feature-slug>/spec.md` (scope, edge cases, acceptance criteria, impact analysis).
     3. Create or update affected `API / Schema Contracts` and data model docs.
     4. Record the change in `CHANGELOG.md`.
   - **Architectural / Schema / Security / Dependency Shift:** All of the above PLUS update `ARCHITECTURE.md` and write a numbered `ADR` under `docs/adrs/`.
2. **Authoritative Templates:** Use the project's standardized blueprints from [09_output_blueprints/README.md](../09_output_blueprints/README.md) so all specifications share consistent structure.

## Prohibited Anti-Patterns
- Shipping a new feature without updating `SRS.md` or creating its `Feature Spec`.
- Treating operational `README.md` notes as a substitute for formal requirements and contract specs.
- Generating empty or copy-pasted boilerplate spec files for a trivial 2-line bug fix.

## Verification & Audit Checklist
- [ ] `SRS.md` reflects all newly added or modified capabilities.
- [ ] Every new or materially modified feature has an up-to-date `Feature Spec` and contract docs.
- [ ] `CHANGELOG.md` updated and `ADR` created for any architectural trade-off.
