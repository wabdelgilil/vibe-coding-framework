# Blueprint: Live Session Handover (`project_management/ACTIVE_CONTEXT.md`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

```markdown
# Active Session Context

> **Rule:** Keep strictly <= 30 lines. Update via Write-Through (decision / dead-end / phase change). On resume or post-compaction, read this file AND run the Resume Check Command before editing.

- **Active Initiative & Phase:** `<NN-slug>` — [phase_XX.md](plans/<NN-slug>/02_phases/phase_XX.md)
- **Last Updated:** YYYY-MM-DD
- **Recently Modified Files:** `<path1>`, `<path2>`
- **Current Blocker / Open Decision:** None (or exact blocker)
- **Negative Constraints & Rejected Approaches (Max 3):**
  - *Rejected:* `<Approach X>` — failed because `<reason Y>` (do not retry).
- **Resume Check Command:** `git status -sb` (or targeted test/verify command)
- **Immediate Next Step:** <Exact single next action to execute upon resume>
```
