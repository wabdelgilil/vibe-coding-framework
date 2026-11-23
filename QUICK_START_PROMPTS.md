# Quick-Start Prompts

Copy and paste the prompt matching your workflow into any AI coding agent (Antigravity, Cursor, Claude Code, Windsurf, or GitHub Copilot). You can reference the hosted repository directly (`https://github.com/wabdelgilil/vibe-coding-framework`) or a local clone path.

---

## 1. Greenfield Bootstrap (New Project From Scratch)

```text
Follow the engineering governance framework at https://github.com/wabdelgilil/vibe-coding-framework (INDEX.md).
Execute the Greenfield Bootstrap flow (`08_adoption_and_onboarding/greenfield_bootstrap.md`):
1. Challenge any risky assumptions objectively before writing code.
2. Clarify stack, database, auth/tenancy, and non-functional constraints first.
3. Propose a dependency-ordered roadmap (P0 security/data -> P1 foundations -> P2 features) and wait for my sign-off before scaffolding detailed phase files or application code.

Project idea:
[Describe what you want to build here]
```

---

## 2. Brownfield 3-Stage Audit (Existing Codebase)

```text
Follow the engineering governance framework at https://github.com/wabdelgilil/vibe-coding-framework (INDEX.md).
Execute the Brownfield 3-Stage Adoption flow (`08_adoption_and_onboarding/brownfield_three_stage_audit.md`) on this repository:
1. Stage 1: Install a single primary Tier-0 rules file (<= 90 lines) and `project_management/` without modifying application code.
2. Stage 2: Run an evidence-based diagnostic audit across Pillars 01-07 using Dual Verification (automated checks + direct reading of high-risk files and random samples). Report compliance % (`PASS / (Total - N/A) * 100%`), letter grade (automatic F on any critical `SEC-*` failure), and `[RULE-ID]` file/line findings.
3. Stage 3: Propose a dependency-ordered Wave remediation plan and wait for my sign-off before editing application code.
```

---

## 3. Feature / Pull Request Adversarial Review

```text
Follow the engineering governance framework at https://github.com/wabdelgilil/vibe-coding-framework (INDEX.md).
Read `01_anti_shortcuts/adversarial_review.md` and `01_anti_shortcuts/proof_of_work.md`, then review the current diff / feature with strict objectivity:
- Check boundaries, security (`SEC-*`), scalability (`SCALE-*`), domain impact (`MAINT-02`), shortcuts (`ANTI-02`), zero AI footprint (`CLEAN-01`), and living docs sync (`DOC-02`).
- Format every finding as:
  `issue (blocking) [RULE-ID] (<file>:<line>): <summary>`
  `suggestion (non-blocking) [RULE-ID] (<file>:<line>): <summary>`
- Report both automated check outputs and the exact files you directly inspected.
```

---

## 4. Upgrade / Sync Existing Project to Latest Framework Version

```text
Sync this repository's governance setup with the latest version of https://github.com/wabdelgilil/vibe-coding-framework (check INDEX.md and 09_output_blueprints/agent_rule_adapters.md):
1. Compare our current Tier-0 rules file and `project_management/` / `docs/` governance structure against the latest upstream framework.
2. Merge any new Non-Negotiable Laws, Trigger Routing Table rows, or missing governance templates (such as `docs/memory/`) while keeping the primary Tier-0 file strictly <= 90 lines.
3. STRICTLY PRESERVE all existing project-specific `Standing User Preferences`, `docs/memory/` entries, `SRS.md`, `ADRs`, `MASTER_PLAN.md`, and active plans—never overwrite custom content or touch application source code.
4. Verify zero broken relative links and summarize the exact upgrades applied.
```
