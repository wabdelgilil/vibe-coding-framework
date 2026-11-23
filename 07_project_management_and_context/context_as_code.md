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
   - **Live Session Handover (`project_management/ACTIVE_CONTEXT.md`, ≤ 30 lines):** Active phase, modified files, negative constraints / rejected approaches (max 3 bullets), blocker, resume check command, and exact next step.
   - **Lessons & Debt (`docs/memory/` + `project_management/TECH_DEBT_REGISTER.md`):** Learned preferences, past anti-patterns, and tracked debt.
2. **Write-Through Persistence (Auto-Compaction Immunity):** Never rely on end-of-session memory dumps; auto-compaction can fire without warning. Update disk state in the **same turn** at 3 events only:
   - *Decision or preference locked:* Persist immediately to `SRS.md`, `docs/adrs/`, or `docs/memory/`.
   - *Approach tested and rejected (Dead End):* Record 1 line under `Negative Constraints & Rejected Approaches` in `ACTIVE_CONTEXT.md` so post-compaction sessions never loop.
   - *Phase completed or blocked:* Overwrite `Active Phase`, `Next Step`, and `Resume Check Command` in `ACTIVE_CONTEXT.md`.
   - *(Optional Native Hook):* If the host tool supports `PreCompact` or `SessionStart` hooks, wire them to flush/re-read `ACTIVE_CONTEXT.md` automatically.
3. **Post-Compaction Ground-Truth Reconcile:** Upon any fresh session or auto-compaction resume, read `ACTIVE_CONTEXT.md` AND run a light filesystem reconcile (`git status` or targeted file read) before editing—never trust compacted memory for file contents.

## Prohibited Anti-Patterns
- Relying on chat scrollback or lossy auto-compaction summaries for constraints, rejected approaches, or file paths.
- Repeating a dead-end approach or project mistake across sessions because it was never persisted.

## Verification & Audit Checklist
- [ ] Decisions, rejected approaches, and phase transitions persisted via Write-Through in the same turn.
- [ ] New or post-compaction session reconciles `ACTIVE_CONTEXT.md` against actual repo state (`git status` / targeted read) before editing.
