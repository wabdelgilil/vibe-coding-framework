# Verification & Closure Gate — Initiative 02

> **Parent Plan:** [INDEX.md](INDEX.md)  
> **Rules Applied:** [proof_of_work.md](../../../01_anti_shortcuts/proof_of_work.md) | [adversarial_review.md](../../../01_anti_shortcuts/adversarial_review.md) | [living_docs_sync_rule.md](../../../05_documentation/living_docs_sync_rule.md)

---

## 1. Automated & Runtime Verification
- [ ] Run `node portal/server.mjs` against this repository: confirm `127.0.0.1` binding, `/api/project` returns valid JSON, and path-traversal probe (`/api/file?path=../../Windows/win.ini`) returns `403`.
- [ ] Verify `portal/start_portal.bat` dry-run/logic parses cleanly with zero syntax errors.
- [ ] Run full repository Markdown link, line-budget, and 4-part anatomy audit (`0` errors).
- [ ] Verify `portal/.portal-pref` is ignored by `git status`.

## 2. Direct Reading & Adversarial Security Review
- [ ] Directly inspect `portal/server.mjs`, `portal/parser.js`, and `portal/start_portal.bat` for XSS, path traversal, shell injection, file size ≤ 350 lines, and zero AI footprint.
- [ ] Visually inspect the running portal in a browser (`EN`/`AR`, Light/Dark, clicking plan tree & Markdown viewer).

## 3. Closure & Archival
- [ ] Physically archive `project_management/plans/02-local-human-portal/` → `project_management/archive/02-local-human-portal/`.
- [ ] Update `COMPLETED_WORK.md`, `MASTER_PLAN.md`, and `ACTIVE_CONTEXT.md`, then commit & push `v1.6.0`.
