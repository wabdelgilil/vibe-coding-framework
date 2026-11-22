# Adversarial Self-Review Protocol

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Separate the "Builder" mindset from the "Auditor" mindset before closing any non-trivial feature, security-sensitive change, or architectural refactor.

## Mandatory Standards
1. **Role Switch Before Closure:** After implementation passes automated checks, switch explicitly to an adversarial reviewer perspective whose sole goal is to break the implementation and expose hidden flaws.
2. **Mandatory 5-Point Attack Pass:** Inspect the diff against five concrete lenses:
   - *Boundary & Failure Paths:* Null/empty inputs, extreme payload sizes, timeouts, partial failures, duplicate retries.
   - *Security & Authorization:* Unvalidated inputs, missing permission/tenant checks, secret exposure, injection vectors.
   - *Scale & Concurrency:* $N+1$ queries, unbounded lists, race conditions, blocking I/O.
   - *Domain & Regression Impact:* Broken reverse relationships, side effects on adjacent modules, stale caches.
   - *Shortcuts & AI Footprint:* Hardcoded values, suppressed warnings, robotic comments, missing doc updates.
3. **Conventional Finding Format:** Tag every review finding with its severity label, Rule ID, and file/line reference:
   - `issue (blocking) [RULE-ID] (<file>:<line>): <summary>` — MUST be fixed and re-verified before closing the task.
   - `suggestion (non-blocking) [RULE-ID] (<file>:<line>): <summary>` — Log in `TECH_DEBT_REGISTER.md` if deferred.
4. **Optional Deep-Audit Companion:** If a companion checkpoint catalog (such as `CodeReviewFramework`) is available in the workspace, cross-check applicable domain checkpoints alongside Pillar gates during release or PR audits.

## Prohibited Anti-Patterns
- Skimming your own diff with confirmation bias ("looks good to me").
- Treating unit-test green lights as proof of security or architectural soundness.
- Deferring `issue (blocking)` findings to "future cleanup" without an approved exemption.

## Verification & Audit Checklist
- [ ] Adversarial pass executed across boundaries, security, scale, domain impact, and shortcuts.
- [ ] All `issue (blocking)` findings tagged with `[RULE-ID]`, resolved, and re-verified before closure.
- [ ] Remaining `suggestion (non-blocking)` items logged in `TECH_DEBT_REGISTER.md` (not ignored).
