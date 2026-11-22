# Brownfield 3-Stage Maturity Adoption

> **Pillar:** [08_adoption_and_onboarding](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Onboard an existing (legacy or active) codebase safely without breaking production behavior, rewriting working code blindly, or losing historical context.

## Mandatory Standards
1. **Stage 1 — Non-Destructive Baseline Setup:**
   - Install Tier-0 rules ([agent_rule_adapters.md](../09_output_blueprints/agent_rule_adapters.md)) and `project_management/` (`MASTER_PLAN.md`, `COMPLETED_WORK.md`, `TECH_DEBT_REGISTER.md`, `plans/`, `archive/`).
   - Reverse-document current reality into baseline `SRS.md` and `ARCHITECTURE.md` without modifying application logic.
2. **Stage 2 — Evidence-Based Diagnostic Audit (1–5 Maturity Rubric):**
   - Audit the codebase against Pillars 01–07 using **Dual Verification** (automated scans + direct reading of critical paths and random samples).
   - Score each Pillar on a 1–5 CMMI scale: `1 Ad-Hoc`, `2 Repeatable`, `3 Defined`, `4 Managed`, `5 Optimizing`.
   - Record concrete file-level findings and log deferred issues in `TECH_DEBT_REGISTER.md`.
3. **Stage 3 — Dependency-Ordered Wave Remediation:**
   - Group findings into sequential Waves under `project_management/plans/01-modernization/` ordered strictly by risk (`Wave 1: Security & Safety Net Tests` → `Wave 2: Architecture & Data Integrity` → `Wave 3: Scale, Clean Code & Living Docs`).
   - Track progress in `EXECUTION_LOG.md`; verify zero regressions after every wave.

## Prohibited Anti-Patterns
- Performing a "big bang" rewrite of a working legacy codebase before establishing safety-net tests.
- Running only an automated audit script without directly reading high-risk production files.
- Enabling strict lint/type rules globally and breaking the build without a phased remediation plan.

## Verification & Audit Checklist
- [ ] Stage 1 baseline rules and `project_management/` installed with zero breakage to existing code.
- [ ] Stage 2 audit completed with evidence-backed 1–5 scores and direct file sampling.
- [ ] Stage 3 wave plan approved by the user before executing structural refactors.
