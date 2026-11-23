# Initiative 02: Optional Local Human Portal (`portal/`)

> **Status:** `[-]` Pending Plan Sign-Off  
> **Parent Radar:** [MASTER_PLAN.md](../../MASTER_PLAN.md)  
> **Specification:** [SRS.md](../../../SRS.md)  

---

## 1. Objective & Scope

Add an **optional, strictly isolated local web portal** (`portal/`) for human visibility into any project governed by this framework—without adding `node_modules`, external packages, or any token overhead on AI agents.

### Strict Architectural Boundary
- **Agent Layer (`01_`–`09_`, `INDEX.md`, `AGENTS.md`):** Remains 100% pure Markdown with zero runtime dependencies. Agents never read `portal/` during normal work.
- **Human Layer (`portal/`):** Optional local viewer reading `project_management/` (`MASTER_PLAN.md`, `ACTIVE_CONTEXT.md`, `plans/`, `archive/`, `COMPLETED_WORK.md`, `TECH_DEBT_REGISTER.md`), `SRS.md`, and `docs/memory/`.

---

## 2. Plan Tree Navigation

| File | Purpose |
| :--- | :--- |
| [01_design_and_architecture.md](01_design_and_architecture.md) | Dual-mode engine, smart `.bat`/`.sh` launcher with saved `.portal-pref`, security, and intentional UI design |
| [02_phases/phase_01_portal_app_and_launchers.md](02_phases/phase_01_portal_app_and_launchers.md) | Build `portal/` modular UI (`index.html`, `styles.css`, `parser.js`, `app.js`), zero-dep `server.mjs`, `start_portal.bat`, and `start_portal.sh` |
| [02_phases/phase_02_docs_and_integration.md](02_phases/phase_02_docs_and_integration.md) | Update `AGENTS.md`, `SRS.md`, `README.md`, `README.ar.md`, `CONTRIBUTING.md`, `.gitignore`, and optional adoption hook |
| [03_verification.md](03_verification.md) | Security/XSS check, live `127.0.0.1` run against this repo, browser visual verification, and Markdown link/budget audit |

---

## 3. Acceptance Criteria (Definition of Done)

- [ ] Zero `node_modules` or external npm/pip packages required.
- [ ] `start_portal.bat` (Windows) and `start_portal.sh` (macOS/Linux) auto-detect Node/Python, offer direct browser mode or optional Node install guidance, and persist choice in gitignored `portal/.portal-pref`.
- [ ] Local server binds strictly to `127.0.0.1` on an auto-selected free port and blocks path traversal outside the project root.
- [ ] `portal/index.html` works in both `http://127.0.0.1` live mode AND `file://` direct folder-picker mode, with EN/AR (`RTL`/`LTR`) and Light/Dark theme toggles.
- [ ] Every source file under `portal/` stays modular (≤ 350 lines), XSS-safe, and free of AI footprint.
- [ ] All 01–09 Pillar link/budget/anatomy checks remain 100% green (`0` broken links).
