# Active Session Context

> **Rule:** Keep strictly <= 30 lines. Update via Write-Through (decision / dead-end / phase change). On resume or post-compaction, read this file AND run the Resume Check Command before editing.

- **Active Initiative & Phase:** None (`v1.6.0` complete, archived, and synced to `origin/main`)
- **Last Updated:** 2026-11-23
- **Recently Modified Files:** `portal/*`, `AGENTS.md`, `SRS.md`, `README.md`, `README.ar.md`, `CONTRIBUTING.md`, `.gitignore`
- **Current Blocker / Open Decision:** `TD-001` (finalize official framework name before formal `v1.0.0` release tag)
- **Negative Constraints & Rejected Approaches (Max 3):**
  - *Rejected:* `npm install` / `node_modules` inside `portal/` — must remain zero-dependency vanilla HTML/CSS/JS + built-in Node/Python.
  - *Rejected:* Binding local portal server to `0.0.0.0` — strictly `127.0.0.1` loopback with path-traversal guard.
  - *Rejected:* Loading `portal/` into AI agent context — Pillars `01–09` stay 100% pure Markdown.
- **Resume Check Command:** `git status -sb`
- **Immediate Next Step:** Await next user directive or test `portal/start_portal.bat` locally.
