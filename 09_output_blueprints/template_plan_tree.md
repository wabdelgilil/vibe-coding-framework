# Blueprint: Hierarchical Plan Tree (`project_management/plans/<NN-slug>/`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Scaling Rule (Proportional Tree Depth)
- **Small Task (1–3 files):** Create a single `plans/<NN-slug>/plan.md` containing scope, file changes, and verification checklist.
- **Medium / Complex Initiative:** Create a recursive folder tree with self-reminding rule checkpoints:

```text
project_management/plans/<NN-slug>/
├── INDEX.md                      # Objective, dependency order, acceptance criteria, navigation
├── 01_spec_and_impact.md         # Ambiguities resolved, contracts, cross-layer impact analysis
├── 02_phases/                    # Atomic execution phases (read ONLY the active phase)
│   ├── phase_01_<foundation>.md
│   └── phase_02_<feature>.md
└── 03_verification.md            # Dual verification (automated + direct reading) & adversarial review
```

## Required Self-Reminding Checkpoints Inside Plan Files
- In `01_spec_and_impact.md`: Link to `04_maintainability/domain_and_impact_integrity.md` and `07_project_management_and_context/planning_rigor_and_pre_code_gate.md`.
- In `02_phases/phase_XX.md`: Link to `01_anti_shortcuts/long_term_and_standards_gate.md` and `02_clean_code/README.md`.
- In `03_verification.md`: Link to `01_anti_shortcuts/proof_of_work.md`, `01_anti_shortcuts/adversarial_review.md`, and `05_documentation/living_docs_sync_rule.md`.

## Closure Rule
Once `03_verification.md` passes 100%, run `git mv project_management/plans/<NN-slug> project_management/archive/<NN-slug>`, log the summary in `COMPLETED_WORK.md`, and remove the row from `MASTER_PLAN.md`.
