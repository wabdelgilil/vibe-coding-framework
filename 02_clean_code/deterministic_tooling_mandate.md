# Deterministic Tooling Mandate

> **Pillar:** [02_clean_code](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Ensure code quality is enforced mechanically by the target project's native toolchain—not merely promised in Markdown rules. Applies whenever bootstrapping a new project or auditing an existing one.

## Mandatory Standards
1. **Configure Native Gates at Bootstrap:** Because this framework is language-agnostic and script-free, the agent MUST configure the standard deterministic tools for the target project's language during setup:
   - **Formatter** (consistent mechanical formatting).
   - **Linter** (strict rules catching unused code, complexity, unsafe patterns, and anti-shortcuts).
   - **Static Type Checker** (strict mode enabled).
   - **Test Runner** (unit + integration execution with clear failure exit codes).
   - **Security / Dependency Scanner** (secret detection + dependency vulnerability audit).
2. **Unified Verification Entrypoint:** Expose single, repeatable commands (e.g., `lint`, `typecheck`, `test`, `build`, `verify`) in the project's native task runner (`package.json`, `Makefile`, `pyproject.toml`, etc.).
3. **Pre-Commit & CI Enforcement:** Wire the same deterministic checks into local Git hooks (when supported) and CI pipelines so non-compliant code cannot be merged.
4. **Pin Tool Versions:** Lock dependency and toolchain versions in the project's lockfile for deterministic reproducibility across machines.

## Prohibited Anti-Patterns
- Relying solely on agent prompts to maintain formatting, typing, or lint quality without configuring native tooling.
- Disabling strict linter rules globally to avoid fixing existing warnings.
- Leaving CI pipelines green while ignoring lint, typecheck, or high-severity security audit failures.

## Verification & Audit Checklist
- [ ] Formatter, linter, strict type checker, test runner, and dependency audit are configured for the target stack.
- [ ] Single repeatable verification commands run cleanly from the terminal.
- [ ] CI/hook configuration enforces the same gates automatically.
