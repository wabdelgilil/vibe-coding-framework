# Vibe Coding Governance Framework

A pure-Markdown, zero-dependency, language-agnostic engineering governance tree for AI-assisted software development. Point any AI coding agent (Antigravity, Cursor, Claude Code, Windsurf, or GitHub Copilot) at [INDEX.md](INDEX.md) to establish strict engineering standards, pre-code planning gates, deterministic quality tooling, living documentation, and hierarchical project management from day one.

**License:** [MIT](LICENSE) | **Entrypoint:** [INDEX.md](INDEX.md) | **Agent Skill:** [SKILL.md](SKILL.md) | **All Prompts:** [QUICK_START_PROMPTS.md](QUICK_START_PROMPTS.md)

---

## Quick Start: Add This Framework to Your Project (Copy & Paste)

Paste either prompt directly into your AI coding agent inside your repository:

### 1. New Project (Greenfield Bootstrap)

```text
Adopt the engineering governance framework from https://github.com/wabdelgilil/vibe-coding-framework (start at INDEX.md and follow 08_adoption_and_onboarding/greenfield_bootstrap.md).

Execute Stage A first:
1. Challenge any risky architectural, security, or scalability assumptions objectively before writing code.
2. Clarify stack, database, authentication/tenancy, and non-functional constraints with me.
3. Propose a dependency-ordered roadmap (P0 security/data -> P1 foundations -> P2 features) and wait for my sign-off before scaffolding detailed phase files or application code.
4. Once approved, compile one primary Tier-0 rules file (<= 90 lines) for this tool, scaffold `project_management/` and living docs, and configure native deterministic tooling (formatter, strict linter, type checker, tests, dependency audit).

Project idea:
[Describe what you want to build here]
```

### 2. Existing Codebase (Brownfield 3-Stage Audit)

```text
Adopt the engineering governance framework from https://github.com/wabdelgilil/vibe-coding-framework (start at INDEX.md and follow 08_adoption_and_onboarding/brownfield_three_stage_audit.md) on this repository:
1. Stage 1: Install a single primary Tier-0 rules file (<= 90 lines) and `project_management/` without modifying application code.
2. Stage 2: Run an evidence-based diagnostic audit across Pillars 01-07 using Dual Verification (automated checks + direct reading of high-risk files and random samples). Report compliance % (`PASS / (Total - N/A) * 100%`), letter grade (automatic F on any critical `SEC-*` failure), and `[RULE-ID]` file/line findings.
3. Stage 3: Propose a dependency-ordered Wave remediation plan and wait for my sign-off before editing application code.
```

*(Need a PR / feature adversarial review prompt? See [QUICK_START_PROMPTS.md](QUICK_START_PROMPTS.md).)*

---

## Why This Framework Exists

Ad-hoc AI coding ("vibe coding") fails predictably in production projects:
- **Sycophancy & Shortcuts:** Agents agree with risky ideas, hardcode secrets/fakes, swallow errors, and suppress linter/type checks.
- **Premature Execution:** Agents jump into code with vague wish-list plans and execute backlogs in blind sequential order.
- **Context Drift & Bloat:** Stuffing all rules into one massive prompt wastes thousands of tokens; omitting them causes rule amnesia across sessions.
- **Missing Standard Docs:** `SRS.md`, feature specs, API contracts, `ADRs`, and `CHANGELOG.md` are skipped or left permanently stale.

---

## Architecture: 3-Tier Context Memory & 9 Modular Pillars

Instead of flooding your context window, the framework compiles a **~30-line Tier-0 Micro-Kernel + Trigger Routing Table** (`~650 tokens`) into your project's native rule file (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursor/rules`, or `.github/copilot-instructions.md`). The agent follows a **Stop-on-Target** law—opening only the single micro-leaf (`<= 120` lines) triggered by its current task.

| Pillar | Router | Focus |
| :-: | :--- | :--- |
| **01** | [01_anti_shortcuts/README.md](01_anti_shortcuts/README.md) | Objectivity, anti-shortcuts, root cause, long-term impact, targeted research, dual verification, adversarial review |
| **02** | [02_clean_code/README.md](02_clean_code/README.md) | Zero AI footprint, naming, modularity, strict types, deterministic tooling |
| **03** | [03_scalability/README.md](03_scalability/README.md) | Stateless design, query scale ($N+1$, pagination, indexing), async execution, resource bounds |
| **04** | [04_maintainability/README.md](04_maintainability/README.md) | Clean boundaries, domain/impact integrity, observability, regression tests, tech debt register |
| **05** | [05_documentation/README.md](05_documentation/README.md) | Mandatory per-feature specs (`SRS.md`, Feature Spec, API contracts, `ADRs`) and living sync |
| **06** | [06_security_and_reliability/README.md](06_security_and_reliability/README.md) | Secrets hygiene, input validation, server-side RBAC/tenant isolation, data immutability |
| **07** | [07_project_management_and_context/README.md](07_project_management_and_context/README.md) | Pre-code plan gate, dependency prioritization, lean `MASTER_PLAN.md`, hierarchical plan trees, physical archival |
| **08** | [08_adoption_and_onboarding/README.md](08_adoption_and_onboarding/README.md) | Greenfield bootstrap and 3-stage Brownfield maturity audit |
| **09** | [09_output_blueprints/README.md](09_output_blueprints/README.md) | Multi-agent Tier-0 adapters and standard engineering document blueprints |

---

## Contributing & License

Open-source under the [MIT License](LICENSE). Contributions are welcome—see [CONTRIBUTING.md](CONTRIBUTING.md) for link, line-budget, and anatomy standards.
