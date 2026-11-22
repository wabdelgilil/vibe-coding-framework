# Root Cause Protocol

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent symptom-masking patches when tests fail, builds break, or runtime bugs occur. Applies to all debugging, incident remediation, and test-failure resolution.

## Mandatory Standards
1. **Reproduce Before Fixing:** Confirm the exact failure condition, stack trace, or failing test case before modifying code.
2. **Trace to the Origin:** Identify *why* the defect occurred (data contract mismatch, race condition, missing validation, stale state, broken invariant) rather than patching the surface symptom.
3. **Fix at the Authoritative Layer:** Resolve data integrity bugs at the schema/service boundary—not via defensive UI band-aids that leave corrupted state underneath.
4. **Lock the Fix with a Regression Test:** Every non-trivial bug fix MUST add or update an automated test that fails before the fix and passes after it.
5. **Preserve Safe Rollback:** If a remediation attempt fails or destabilizes unrelated behavior, revert cleanly and re-diagnose rather than stacking nested workarounds.

## Prohibited Anti-Patterns
- Adding arbitrary `sleep()` / `setTimeout()` calls to mask race conditions or async ordering bugs.
- Wrapping broken logic in broad `try/catch` blocks that return fallback values and hide the root exception.
- Changing test assertions to match buggy output instead of fixing the code.
- Applying trial-and-error edits across multiple files without a stated root-cause hypothesis.

## Verification & Audit Checklist
- [ ] Root cause explicitly identified and stated before applying the fix.
- [ ] Fix applied at the authoritative architectural layer (not a superficial symptom mask).
- [ ] Regression test added and verified to fail without the fix and pass with it.
