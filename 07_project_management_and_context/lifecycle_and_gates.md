# Gated Engineering Lifecycle

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Replace chaotic ad-hoc coding with a repeatable, gate-enforced engineering lifecycle from initial requirement to verified archival.

## Mandatory Standards
1. **Six Sequential Stages:**
   - **Stage 1 — Discover:** Read existing code, contracts, and relevant local Skills.
   - **Stage 2 — Spec & Impact:** Define requirements, edge cases, and cross-layer impact analysis.
   - **Stage 3 — Deep Plan Gate:** Produce a file-level plan tree scaled to complexity; obtain sign-off for non-trivial work.
   - **Stage 4 — Disciplined Build:** Implement cleanly with strict types, security controls, and real behavior tests.
   - **Stage 5 — Dual Verify & Adversarial Audit:** Run automated checks + direct reading/sampling + adversarial review + living docs sync.
   - **Stage 6 — Close & Archive:** Update `SRS.md`/`CHANGELOG.md`, move closed plan folder to `archive/`, record in `COMPLETED_WORK.md`, and prune `MASTER_PLAN.md`.
2. **Hard Transition Gates:** Never advance to Build without passing Stage 3; never advance to Close without passing Stage 5.

## Prohibited Anti-Patterns
- Skipping discovery, impact analysis, or verification to "move faster."
- Leaving completed work unarchived in `MASTER_PLAN.md` or omitting documentation sync.
- Mixing unverified experimental code into the main branch.

## Verification & Audit Checklist
- [ ] Every stage gate satisfied in order with proportional rigor.
- [ ] Build, verification, documentation sync, and archival completed before declaring done.
