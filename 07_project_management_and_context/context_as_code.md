# Context-as-Code (Persistent Institutional Memory)

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate context drift and memory loss across sessions by storing all project decisions, state, and lessons in version-controlled Markdown files—never solely inside chat history.

## Mandatory Standards
1. **Five Core Memory Artifacts:**
   - **Tier-0 Rules (`AGENTS.md` / adapter):** Always-in-context Micro-Kernel + Trigger Routing Table (≤ 90 lines).
   - **Specification (`SRS.md`):** Living functional, non-functional, and architectural baseline.
   - **Decision Log (`docs/adrs/`):** Numbered ADRs preserving *why* major choices were made.
   - **Active Radar (`project_management/MASTER_PLAN.md`):** Current active initiatives only.
   - **Live Session Handover (`project_management/ACTIVE_CONTEXT.md`, ≤ 30 lines):** Exact current focus, last modified files, open blockers, and immediate next step updated at every session pause.
   - **Lessons & Debt (`docs/memory/` + `project_management/TECH_DEBT_REGISTER.md`):** Learned preferences, past anti-patterns, and tracked debt.
2. **Immediate Persistence:** Any architectural decision, status transition, blocker, or recurring pitfall MUST be written to its repository file in the same turn—never left solely in conversation memory.
3. **10-Second Session Handover:** A brand-new AI session reading Tier-0 Rules + `ACTIVE_CONTEXT.md` + `MASTER_PLAN.md` MUST be able to resume work accurately without asking the user to re-explain history.

## Prohibited Anti-Patterns
- Relying on chat scrollback to remember schema decisions, naming rules, or task progress.
- Repeating the same project-specific mistake across sessions because it was never logged in `ANTI_PATTERNS.md`.

## Verification & Audit Checklist
- [ ] All decisions, status updates, and recurring lessons persisted in version-controlled files.
- [ ] New session can resume active work cleanly from `MASTER_PLAN.md` and the active phase file.
