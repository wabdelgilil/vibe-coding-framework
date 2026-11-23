# Greenfield Project Bootstrap

> **Pillar:** [08_adoption_and_onboarding](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Establish complete engineering governance, deterministic tooling, living documentation, and hierarchical project management on a new repository before writing application code.

## Mandatory Standards
1. **Stage A — Fast Turn-1 Alignment (Before Detailed Scaffolding):**
   - Push back objectively on any risky architectural/security assumptions ([objectivity_and_constructive_challenge.md](../01_anti_shortcuts/objectivity_and_constructive_challenge.md)).
   - Clarify unresolved stack, database, auth/tenancy, and non-functional choices with the user.
   - Propose the dependency-ordered initiative roadmap (`P0` → `P1` → `P2`) and obtain stack/plan sign-off **before** generating granular per-phase files (avoids premature file churn and rework).
2. **Stage B — Compile Tier-0 Rules & Core Governance (Once Stack Is Confirmed):**
   - Follow [agent_rule_adapters.md](../09_output_blueprints/agent_rule_adapters.md) to emit one primary Tier-0 Micro-Kernel + Trigger Table (≤ 90 lines).
   - Scaffold clean root files (`README.md`, `SRS.md`, `CHANGELOG.md`, `.gitignore`, `.env.example`), `docs/` (`ARCHITECTURE.md`, `specs/`, `adrs/`, `memory/`, `ANTI_PATTERNS.md`), and `project_management/` (`MASTER_PLAN.md`, `ACTIVE_CONTEXT.md`, `COMPLETED_WORK.md`, `TECH_DEBT_REGISTER.md`, `plans/`, `archive/`).
   - Write the confirmed hierarchical plan tree under `project_management/plans/01-<slug>/` and record `ADR-001`.
   - *(Optional Human Viewer):* Only if the user wants a local visual dashboard, copy the framework's `portal/` folder into the target project and add `portal/.portal-pref` to `.gitignore`.
3. **Stage C — Wire Native Deterministic Tooling:** Follow [deterministic_tooling_mandate.md](../02_clean_code/deterministic_tooling_mandate.md) to configure the stack's formatter, strict linter, strict type checker, test runner, dependency audit, and unified verification commands before writing feature code.

## Prohibited Anti-Patterns
- Writing feature code before `SRS.md`, Tier-0 rules, `.gitignore`, and deterministic lint/type/test gates exist.
- Generating 5+ detailed stack-specific phase files *before* the user confirms the database and runtime stack.
- Hardcoding secrets or skipping `.env.example` during initial project scaffolding.

## Verification & Audit Checklist
- [ ] Stack choices, objections, and dependency order confirmed with the user before detailed phase scaffolding.
- [ ] Single primary Tier-0 rules file generated (≤ 90 lines) with valid relative trigger links.
- [ ] `SRS.md`, `README.md`, `.gitignore`, `.env.example`, and `project_management/` created cleanly.
- [ ] Native formatter, linter, type checker, and test runner execute cleanly with zero errors.
