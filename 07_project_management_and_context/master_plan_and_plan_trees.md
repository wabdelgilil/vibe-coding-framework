# Master Plan & Hierarchical Plan Trees

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Keep `MASTER_PLAN.md` ultra-lean as a front-door radar while giving every initiative a dedicated folder whose internal tree scales dynamically to its complexity.

## Mandatory Standards
1. **`MASTER_PLAN.md` Is Strictly a Front Door:** It lists ONLY active/upcoming initiatives, priority, status (`[/]` In Progress, `[-]` Pending/Blocked, `[!]` Partially Blocked), and a relative link to each initiative's folder. Never dump granular implementation steps into `MASTER_PLAN.md`.
2. **Dedicated Folder Per Initiative (`project_management/plans/<NN-slug>/`):**
   - *Small Task:* A single concise `plan.md` inside its folder.
   - *Medium/Complex Feature:* A recursive tree scaled to complexity (`INDEX.md`, `01_spec_and_contracts.md`, `02_phases/phase_XX.md`, `03_verification.md`).
3. **Self-Reminding Phase Checkpoints:** Each phase and verification file embeds direct relative links to the exact Pillar micro-leaves relevant to that phase so long sessions never lose rule awareness.
4. **Clear Boundary With `docs/specs/`:** Permanent product/feature specifications live in `docs/specs/`; active execution plans live in `project_management/plans/`.

## Prohibited Anti-Patterns
- Bloating `MASTER_PLAN.md` into a 500-line monolithic log of every subtask and historical sprint.
- Cramming a multi-week feature into one unreadable flat plan file.
- Creating duplicate parallel numbering across `specs/` and `project_management/`.

## Verification & Audit Checklist
- [ ] `MASTER_PLAN.md` remains lean and contains active initiatives with links to `plans/` only.
- [ ] Plan folder internal tree matches the actual complexity of the initiative.
- [ ] Active phase files contain direct reminder links to relevant verification/quality rules.
