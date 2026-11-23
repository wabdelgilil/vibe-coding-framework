# Project Engineering Governance (Tier-0 Micro-Kernel)

> Framework Reference: [INDEX.md](INDEX.md)
> Navigation Law: Stop-on-Target. Read only the triggered micro-leaf before acting.

## 10 Non-Negotiable Laws
1. **Objectivity:** Never flatter blindly; surface real downsides and trade-offs before agreeing.
2. **Pre-Code Plan Gate:** Never edit code before a verified plan proportional to change size.
3. **Dependency-First Order:** Prioritize `P0` security/data, then `P1` foundations; escalate business ties.
4. **Root Cause & Long-Term Impact:** Fix causes at the authoritative layer; evaluate 6–12 month impact.
5. **Zero Shortcuts:** No stubs, empty `catch`, hardcoded fakes, or inline lint/type suppressions.
6. **Zero AI Footprint:** Clean human-grade prose, code, comments ("why" only), commits, and metadata.
7. **Always Strict Security:** Zero hardcoded secrets; server-side auth, RBAC, and strict input validation.
8. **Dual Verification:** Run automated checks AND directly read modified/sampled files before claiming Done.
9. **Living Docs Sync:** Update `SRS.md`, specs, contracts, `AGENTS.md`, and `CHANGELOG.md` atomically.
10. **Clean Workspace:** 100% relative links; keep `MASTER_PLAN.md` lean; physically archive closed plans.

## Action Boundaries (3-Zone Matrix)
- **Always:** Run link/budget/anatomy checks, use relative links, update `ACTIVE_CONTEXT.md` and living docs.
- **Ask First:** Add runtime dependencies/scripts, break Pillar taxonomy, or alter core framework principles.
- **Never:** Commit secrets or local `file:///` paths, exceed router (35) or leaf (120) line caps, or flatter uncritically.

## On-Demand Trigger Routing Table
| When you are about to... | Read ONLY this file first |
| :--- | :--- |
| Start a session or resume after auto-compaction | `project_management/ACTIVE_CONTEXT.md` (+ run `git status` reconcile) |
| Plan a feature or multi-file change | `07_project_management_and_context/planning_rigor_and_pre_code_gate.md` |
| Drive a feature lifecycle (auto-scaled) | `07_project_management_and_context/lifecycle_and_gates.md` |
| Order or prioritize 2+ tasks | `07_project_management_and_context/prioritization_and_dependency_ordering.md` |
| Evaluate a proposal or push back | `01_anti_shortcuts/objectivity_and_constructive_challenge.md` |
| Close any task or audit | `01_anti_shortcuts/proof_of_work.md` + `adversarial_review.md` |
| Receive a recurring user preference | `07_project_management_and_context/continuous_learning_memory.md` |
| Check project-local learned preferences | `docs/memory/INDEX.md` |

## Standing User Preferences (Bucket A — Max 10 One-Liners)
- **Zero Sycophancy:** Never open with empty praise; always evaluate and state real downsides and trade-offs.
- **Pure Markdown Only:** Keep this framework 100% pure Markdown with zero runtime scripts or CLI dependencies.
- **Micro-Files Only:** Keep routers ≤ 35 lines, micro-leaves ≤ 120 lines, and Tier-0 ≤ 90 lines.
