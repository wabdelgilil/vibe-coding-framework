# Proof of Work & Dual Verification

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Replace unverified "Done" claims and blind script trust with concrete, dual-layer verification evidence. Applies to every implementation task, refactor, migration, and codebase audit.

## Mandatory Standards
1. **No Evidence, No Completion:** A task MUST NOT be declared complete without actual execution evidence from the project's verification commands (build, type check, linter, tests, security checks).
2. **Dual Verification Law (Script + Direct Reading):**
   - **Layer 1 — Automated Scripts:** Run all applicable deterministic scripts, linters, type checkers, and test suites. Never skip automated checks.
   - **Layer 2 — Direct Agent Reading:** Scripts can have false negatives or miss semantic bugs. The agent MUST directly read and inspect modified files, diffs, and outputs to verify real business-logic correctness.
3. **Risk-Based & Random Sampling for Large Tasks:** When a task or audit spans many files where reading every line is impractical, the agent MUST directly read:
   - All high-risk / critical-path files (auth, permissions, financial/state mutations, schema changes), AND
   - A random sample of modified or audited files across the batch—explicitly listing which files were directly inspected.
4. **Exact Scope Reporting:** Report what actually ran, what passed, what failed, and what was NOT tested (e.g., live production environment).

## Prohibited Anti-Patterns
- Declaring "100% verified" solely because an automated script exited with code `0`.
- Claiming tests pass without running them after the final edit.
- Hiding skipped tests, compiler warnings, or partial failures behind a generic "all checks passed" summary.

## Verification & Audit Checklist
- [ ] Automated build, type, lint, and test commands executed *after* the final edit.
- [ ] Direct file/diff inspection performed (or risk-based + random sample read and listed for large batches).
- [ ] Any untested scope or residual risk stated explicitly.
