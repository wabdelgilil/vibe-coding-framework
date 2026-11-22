# Onboarding, Environment & Operational Runbooks

> **Pillar:** [05_documentation](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Enable any engineer or new AI session to clone, configure, run, test, and troubleshoot the project deterministically within minutes.

## Mandatory Standards
1. **Actionable `README.md`:** Maintain a clean root `README.md` with: project purpose, directory map, prerequisites, exact local setup commands, verification commands (`lint`, `typecheck`, `test`, `build`), and links to `SRS.md` and `ARCHITECTURE.md`.
2. **Complete `.env.example`:** Every environment variable read by the application MUST be declared in `.env.example` with a safe dummy value, expected format, and brief purpose comment.
3. **Operational Runbooks for Production Systems:** For deployable services, document deployment steps, database migration execution/rollback procedures, backup verification, and common incident diagnostics under `docs/runbooks/`.
4. **Zero Tribal Knowledge:** Any manual step required to run or deploy the system MUST be written down explicitly—never left in chat history.

## Prohibited Anti-Patterns
- Adding a new environment variable in code without updating `.env.example` and setup docs.
- Writing vague setup instructions ("configure your database and run the app") without exact commands.
- Documenting broken or deprecated commands that no longer work on a clean checkout.

## Verification & Audit Checklist
- [ ] `README.md` setup and verification commands verified against actual project scripts.
- [ ] `.env.example` contains every required environment variable with safe dummy values.
- [ ] Migration, rollback, and deployment procedures documented for deployable projects.
