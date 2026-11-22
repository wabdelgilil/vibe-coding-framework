# Anti-Rot, Dependency Hygiene & Tech Debt Control

> **Pillar:** [04_maintainability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent gradual codebase decay, orphaned files, unmaintained dependencies, and forgotten debt across long-running projects.

## Mandatory Standards
1. **Zero Dead Code Policy:** When replacing or refactoring a feature, immediately remove obsolete functions, unused imports, orphaned components, dead feature flags, and unused dependencies.
2. **Indexed Tech Debt Register (`TECH_DEBT_REGISTER.md`):** Never leave deferred improvements as scattered inline `TODO` comments. Log them in `project_management/TECH_DEBT_REGISTER.md` with an ID (`TD-XXX`), severity, impacted files, and target resolution.
3. **Disciplined Dependency Management:**
   - Justify every new third-party package before adding it (maintenance health, license, security, bundle/runtime cost).
   - Pin exact versions in lockfiles and run dependency vulnerability audits regularly.
4. **Safe Incremental Refactoring:** Keep refactoring commits cleanly separated from behavioral feature commits where feasible, verifying green tests before and after each step.

## Prohibited Anti-Patterns
- Leaving commented-out legacy code blocks "just in case" (Git history already preserves deleted code).
- Installing a heavy third-party library for a 10-line pure utility function.
- Accumulating untracked workarounds across sprints without scheduling remediation.

## Verification & Audit Checklist
- [ ] Zero unused imports, orphaned files, or commented-out dead code blocks introduced.
- [ ] All deferred improvements or approved exemptions logged in `TECH_DEBT_REGISTER.md`.
- [ ] New dependencies justified, lockfile updated, and vulnerability audit clean.
