# Scope Triage & Physical Archiving

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent half-finished tasks when new requests arrive mid-flight, and prevent completed folders from cluttering active project management directories.

## Mandatory Standards
1. **Mid-Task Scope Triage:**
   - *Related to active task:* Integrate cleanly into the active plan folder and continue.
   - *Unrelated new feature/topic:* Never abandon the active task in a broken state. Log the new directive in `MASTER_PLAN.md` as pending, note dependencies, inform the user it is safely queued, and finish or safely checkpoint the active milestone first.
2. **Mandatory Physical Archival on Closure:** Immediately after an initiative passes its Verification Gate:
   - Move its entire folder physically from `project_management/plans/<slug>/` to `project_management/archive/<slug>/` (using `git mv` to preserve history).
   - Add a concise executive entry with summary, deliverables, and relative link to `project_management/COMPLETED_WORK.md`.
   - Delete the closed entry from `project_management/MASTER_PLAN.md`.
3. **Update Relative Links:** Verify all links in `COMPLETED_WORK.md` and `MASTER_PLAN.md` resolve cleanly after moving folders.

## Prohibited Anti-Patterns
- Leaving 50 closed sprint folders sitting alongside active work inside `project_management/` root or `plans/`.
- Abandoning an in-progress refactor half-broken to chase a newly mentioned feature.
- Archiving a task before it passes its Verification Gate.

## Verification & Audit Checklist
- [ ] Unrelated mid-flight requests queued cleanly without breaking active work.
- [ ] Closed plan folders physically moved to `archive/` and pruned from `MASTER_PLAN.md`.
- [ ] `COMPLETED_WORK.md` updated with working relative links.
