# Greenfield Project Bootstrap

> **Pillar:** [08_adoption_and_onboarding](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Establish complete engineering governance, deterministic tooling, living documentation, and hierarchical project management on a new repository before writing application code.

## Mandatory Standards
1. **Step 1 — Clarify Core Intent:** Confirm target stack, runtime boundaries, and critical non-functional constraints (auth, multi-tenancy, scale, compliance) with the user.
2. **Step 2 — Compile Tier-0 Agent Rules:** Follow [agent_rule_adapters.md](../09_output_blueprints/agent_rule_adapters.md) to emit the native Tier-0 Micro-Kernel + Trigger Table (≤ 90 lines) for the repository's AI tool(s).
3. **Step 3 — Scaffold Governance & Living Docs:** Create clean root files (`README.md`, `SRS.md`, `CHANGELOG.md`, `.gitignore`, `.env.example`), `docs/` (`ARCHITECTURE.md`, `specs/`, `adrs/`, `ANTI_PATTERNS.md`), and `project_management/` (`MASTER_PLAN.md`, `COMPLETED_WORK.md`, `TECH_DEBT_REGISTER.md`, `plans/`, `archive/`).
4. **Step 4 — Wire Native Deterministic Tooling:** Follow [deterministic_tooling_mandate.md](../02_clean_code/deterministic_tooling_mandate.md) to configure the stack's formatter, strict linter, strict type checker, test runner, dependency audit, and unified verification commands.
5. **Step 5 — Lock First Initiative Plan:** Create the first hierarchical plan under `project_management/plans/01-<slug>/`, link it in `MASTER_PLAN.md`, and obtain plan sign-off before coding.

## Prohibited Anti-Patterns
- Writing feature code before `SRS.md`, Tier-0 rules, `.gitignore`, and deterministic lint/type/test gates exist.
- Hardcoding secrets or skipping `.env.example` during initial project scaffolding.

## Verification & Audit Checklist
- [ ] Tier-0 rules file generated (≤ 90 lines) with valid relative trigger links.
- [ ] `SRS.md`, `README.md`, `.gitignore`, `.env.example`, and `project_management/` created cleanly.
- [ ] Native formatter, linter, type checker, and test runner execute cleanly with zero errors.
