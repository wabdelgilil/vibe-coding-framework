# Multi-Agent Rule Adapters (Tier-0 Micro-Kernel Compiler)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Compile a lean, always-in-context Tier-0 rules file (strictly **≤ 90 lines / ~800 tokens**) adapted to the target project's AI coding tool(s), guaranteeing on-demand recall of all 9 Pillars without polluting the context window.

## Mandatory Standards
1. **Select One Primary Native Target Path (Zero Duplication):** Detect the repository's primary AI tool and emit **one** authoritative Tier-0 file:
   - **Universal / Multi-Agent:** `AGENTS.md`
   - **Antigravity / Gemini:** `GEMINI.md`
   - **Claude Code:** `CLAUDE.md`
   - **Cursor:** `.cursor/rules/governance.mdc` (with `alwaysApply: true`)
   - **GitHub Copilot:** `.github/copilot-instructions.md`
   - *Secondary Tool Pointer:* If a repo actively uses a second AI tool, emit a 3-line pointer file referencing the primary Tier-0 file instead of duplicating identical copies.
2. **Tier-0 Payload Template (Copy & Adapt — Keep Strictly ≤ 90 Lines):**

```markdown
# Project Engineering Governance (Tier-0 Micro-Kernel)

> Framework Reference: `<relative-or-repo-path-to-framework>/INDEX.md`
> Navigation Law: Stop-on-Target. Read only the triggered micro-leaf before acting.

## 10 Non-Negotiable Laws
1. **Objectivity:** Never flatter blindly; push back with trade-offs when an idea carries risk.
2. **Pre-Code Plan Gate:** Never edit code before a verified plan proportional to change size.
3. **Dependency-First Order:** Prioritize `P0` security/data, then `P1` foundations; escalate business ties.
4. **Root Cause & Long-Term Impact:** Fix causes at the authoritative layer; evaluate 6–12 month impact.
5. **Zero Shortcuts:** No stubs, empty `catch`, hardcoded fakes, or inline lint/type suppressions.
6. **Zero AI Footprint:** Clean human-grade code, comments ("why" only), commits, and metadata.
7. **Always Strict Security:** Zero hardcoded secrets; server-side auth, RBAC, and strict input validation.
8. **Dual Verification:** Run automated checks AND directly read modified/sampled files before claiming Done.
9. **Living Docs Sync:** Update `SRS.md`, specs, contracts, and `CHANGELOG.md` atomically with code.
10. **Clean Workspace:** 100% relative links; keep `MASTER_PLAN.md` lean; physically archive closed plans.

## On-Demand Trigger Routing Table
| When you are about to... | Read ONLY this file first |
| :--- | :--- |
| Plan a feature or multi-file change | `07_project_management_and_context/planning_rigor_and_pre_code_gate.md` |
| Order or prioritize 2+ tasks | `07_project_management_and_context/prioritization_and_dependency_ordering.md` |
| Debug a failure or weigh a quick fix | `01_anti_shortcuts/root_cause_protocol.md` + `long_term_and_standards_gate.md` |
| Build UI/UX or use unfamiliar APIs | `01_anti_shortcuts/targeted_skills_and_research.md` |
| Design queries, caching, or async jobs | `03_scalability/README.md` |
| Add/change entities or cross-layer flows | `04_maintainability/domain_and_impact_integrity.md` |
| Touch auth, secrets, or external inputs | `06_security_and_reliability/README.md` |
| Add/modify features (standard docs) | `05_documentation/standard_artifacts_per_feature.md` |
| Close any task or audit | `01_anti_shortcuts/proof_of_work.md` + `adversarial_review.md` |
| Receive a recurring user preference | `07_project_management_and_context/continuous_learning_memory.md` |
| Touch UI, stack, or domain conventions | `docs/memory/INDEX.md` (project-local learned preferences) |
| Onboard an existing codebase | `08_adoption_and_onboarding/brownfield_three_stage_audit.md` |

## Standing User Preferences (Bucket A — Max 10 One-Liners)
<!-- Pin only universal every-turn preferences here; demote domain-specific items to docs/memory/. -->
```

## Prohibited Anti-Patterns
- Pasting all 9 Pillars inline into `AGENTS.md` / `GEMINI.md` / `CLAUDE.md` (destroys context budget).
- Writing hardcoded local machine paths (`file:///...`) inside generated rule files.

## Verification & Audit Checklist
- [ ] Generated Tier-0 rule file is strictly ≤ 90 lines and matches the target AI tool's native path.
- [ ] All trigger table paths resolve cleanly to the framework reference location.
