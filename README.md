# Vibe Coding Governance Framework

<p align="center">
  <b><a href="README.md">English</a></b> •
  <a href="README.ar.md">العربية</a>
</p>

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

### 3. Upgrade Existing Project to Latest Framework Version (Non-Destructive Sync)

```text
Sync this repository's governance setup with the latest version of https://github.com/wabdelgilil/vibe-coding-framework (check INDEX.md and 09_output_blueprints/agent_rule_adapters.md):
1. Compare our current Tier-0 rules file and `project_management/` / `docs/` governance structure against the latest upstream framework.
2. Merge any new Non-Negotiable Laws, Trigger Routing Table rows, or missing governance templates (such as `docs/memory/`) while keeping the primary Tier-0 file strictly <= 90 lines.
3. STRICTLY PRESERVE all existing project-specific `Standing User Preferences`, `docs/memory/` entries, `SRS.md`, `ADRs`, `MASTER_PLAN.md`, and active plans—never overwrite custom content or touch application source code.
4. Verify zero broken relative links and summarize the exact upgrades applied.
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

## Optional Local Human Portal (`portal/`)

Want a clean visual dashboard for your project's `MASTER_PLAN.md`, `ACTIVE_CONTEXT.md`, hierarchical plan trees, tech debt, and `SRS.md` without spending a single agent token on chat charts?
- Copy the optional `portal/` folder into your project (isolated from AI agents; zero `npm install` or `node_modules`).
- Run `portal/start_portal.bat` (Windows) or `./portal/start_portal.sh` (macOS/Linux): it auto-detects Node.js/Python, binds strictly to `127.0.0.1`, or falls back to zero-install direct browser mode (`File System Access API`), saving your preference locally in gitignored `portal/.portal-pref` (pass `--reset` to change).
- **Companion Markdown Station:** For advanced bilingual (`BiDi` RTL/LTR), KaTeX math, Mermaid diagrams, and export, the portal's built-in reader includes a 1-click bridge to [MDFull](https://wabdelgilil.github.io/markDownReader/) ([GitHub](https://github.com/wabdelgilil/markDownReader)).

---

## Contributing & License

Open-source under the [MIT License](LICENSE). Contributions are welcome—see [CONTRIBUTING.md](CONTRIBUTING.md) for link, line-budget, and anatomy standards.
