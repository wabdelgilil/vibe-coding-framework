# Phase 1: Modular Portal Application & Cross-Platform Launchers

> **Parent Plan:** [INDEX.md](../INDEX.md)  
> **Rules Applied:** [functions_and_modularity.md](../../../../02_clean_code/functions_and_modularity.md) | [zero_ai_footprint.md](../../../../02_clean_code/zero_ai_footprint.md)

---

## Target Files (All Under `portal/`, Zero External Dependencies)

1. `portal/index.html` — Semantic shell (LTR/RTL + theme attributes, zero inline style sprawl, ≤ 150 lines).
2. `portal/styles.css` — Light/Dark semantic tokens, editorial workbench layout, responsive down to mobile, visible keyboard focus, `prefers-reduced-motion` support (≤ 300 lines).
3. `portal/parser.js` — Safe Markdown parser (escaped HTML, headings, tables, checklists, code blocks, links) + resilient extractors for `MASTER_PLAN.md`, `ACTIVE_CONTEXT.md`, `TECH_DEBT_REGISTER.md`, and `COMPLETED_WORK.md` (≤ 250 lines).
4. `portal/app.js` — Dual-mode loader (`fetch('/api/project')` when on `127.0.0.1` with auto-poll refresh; `File System Access API` folder picker when on `file://`), view router, EN/AR i18n dictionary, and Light/Dark theme persistence (≤ 320 lines).
5. `portal/server.mjs` — Zero-dependency Node.js (`node:http`, `node:fs`, `node:path`) server bound strictly to `127.0.0.1` on an automatic free port (`port: 0`), serving `/api/project` (recursively indexing `project_management/`, `SRS.md`, `docs/memory/`) and `/api/file?path=...` with strict root-confinement validation (≤ 180 lines).
6. `portal/start_portal.bat` — Windows smart launcher: reads/writes `portal/.portal-pref`, evaluates Node/Python availability, offers direct browser fallback or optional Node install guidance, supports `--reset`, and opens the browser.
7. `portal/start_portal.sh` — POSIX (macOS/Linux) smart launcher with identical preference-recording and fallback behavior.

## Phase Exit Criteria
- Every file under `portal/` stays strictly ≤ 350 lines with zero external dependencies.
- `node portal/server.mjs` starts cleanly on `127.0.0.1` and serves this repository's real governance files without error.
