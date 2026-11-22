# Brownfield 3-Stage Maturity Adoption

> **Pillar:** [08_adoption_and_onboarding](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Onboard an existing (legacy or active) codebase safely without breaking production behavior, rewriting working code blindly, or losing historical context.

## Mandatory Standards
1. **Stage 1 — Non-Destructive Baseline Setup:**
   - Install Tier-0 rules ([agent_rule_adapters.md](../09_output_blueprints/agent_rule_adapters.md)) and `project_management/` (`MASTER_PLAN.md`, `COMPLETED_WORK.md`, `TECH_DEBT_REGISTER.md`, `plans/`, `archive/`).
   - Reverse-document current reality into baseline `SRS.md` and `ARCHITECTURE.md` without modifying application logic.
2. **Stage 2 — Evidence-Based Diagnostic Audit (Applicability & Quantitative Scoring):**
   - Audit the codebase against Pillars 01–07 using **Dual Verification** (automated scans + direct reading of critical paths and random samples).
   - Mark genuinely inapplicable checks `N/A` (with rationale) so they never distort the score; calculate compliance as `PASS / (Total - N/A) * 100%` alongside 1–5 CMMI maturity (`1 Ad-Hoc` to `5 Optimizing`).
   - **Hard Release Gate:** Grade `A+` (98–100%), `A` (90–97%), `B` (80–89%), `C` (65–79%), `F` (< 65%). Any Critical `SEC-*` failure forces an automatic **`F (Release Blocked)`** regardless of overall percentage.
   - *Optional Deep Audit:* If a companion review catalog (e.g., `CodeReviewFramework`) is present, map its applicable checkpoints into the evidence table.
   - Record concrete file/line findings with `[RULE-ID]` tags and log deferred items in `TECH_DEBT_REGISTER.md`.
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
