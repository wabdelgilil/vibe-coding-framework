# Phase 2: Governance Sync, Docs & Optional Adoption Hook

> **Parent Plan:** [INDEX.md](../INDEX.md)  
> **Depends On:** [Phase 1](phase_01_portal_app_and_launchers.md)  
> **Rules Applied:** [living_docs_sync_rule.md](../../../../05_documentation/living_docs_sync_rule.md)

---

## Target Files

1. `.gitignore` — Ignore `portal/.portal-pref` so local machine launcher preferences never enter Git.
2. `AGENTS.md` — Update Standing Preference wording transparently (*Core Pillars `01–09` remain 100% pure Markdown; `portal/` is an isolated optional human viewer*).
3. `SRS.md` — Bump to `v1.6.0` and document FR-09 (Optional Local Human Portal) and its strict isolation from the Agent layer.
4. `CONTRIBUTING.md` — Clarify that `01–09` Pillars stay 100% pure Markdown while `portal/` remains zero-dependency vanilla HTML/CSS/JS.
5. `README.md` & `README.ar.md` — Add a concise "Optional Local Project Portal" section explaining 1-click usage (`portal/start_portal.bat` or `portal/start_portal.sh`).
6. `08_adoption_and_onboarding/greenfield_bootstrap.md` — Add a 1-line optional note: copy `portal/` into the target project only if the user requests visual tracking, and ensure `portal/.portal-pref` is gitignored.

## Phase Exit Criteria
- All living docs, `AGENTS.md`, and bilingual `README` files stay synchronized with zero broken relative links.
- Core Pillars `01–09` retain 100% pure-Markdown compliance and line budgets.
