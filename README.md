# Vibe Coding Governance Framework

A pure-Markdown, zero-dependency, language-agnostic engineering reference tree. Point any AI coding agent at [INDEX.md](INDEX.md) to establish strict engineering rules, deterministic quality gates, living documentation, and hierarchical project management from day one.

---

## How to Use

1. Reference [INDEX.md](INDEX.md) from your AI coding agent (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, Cursor, Copilot, or Windsurf).
2. Instruct the agent to bootstrap a **new project** (Greenfield) or audit an **existing codebase** (Brownfield).
3. The agent compiles a lightweight Tier-0 rules file (≤ 90 lines) with an on-demand Trigger Routing Table plus a hierarchical `project_management/` structure tailored to your repository.

---

## Repository Map

- [INDEX.md](INDEX.md) — Central Hub and execution router for AI agents.
- [QUICK_START_PROMPTS.md](QUICK_START_PROMPTS.md) — Ready-to-paste prompts for Greenfield, Brownfield, and PR reviews.
- [SKILL.md](SKILL.md) — Standard Agent Skill entrypoint for AI coding tools.
- [SRS.md](SRS.md) — System Requirements Specification for this framework.
- `01_anti_shortcuts/` through `09_output_blueprints/` — Modular governance Pillars organized as recursive micro-files with stable Rule IDs.
- [project_management/MASTER_PLAN.md](project_management/MASTER_PLAN.md) — Active development radar for this repository.
- [docs/BRAINSTORMING.md](docs/BRAINSTORMING.md) — Original design rationale and decision log.

---

## Design Principles

- **Zero Scripts, Zero Lock-In:** 100% pure Markdown; adapts to any programming language and AI tool.
- **Stop-on-Target Context Efficiency:** Routers ≤ 35 lines; micro-leaves ≤ 120 lines; Tier-0 rules ≤ 90 lines (~800 tokens).
- **Always Strict Quality, Proportional Ceremony:** Uncompromising code quality and security; documentation and plan depth scale with change scope.
