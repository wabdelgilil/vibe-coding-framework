# Context Memory Architecture: 3-Tier Trigger-Based Progressive Disclosure

> **Problem Solved:** Loading 45+ rule files into every AI turn consumes ~30,000+ tokens, degrades instruction-following accuracy ("lost in the middle"), and slows every session. Conversely, hiding rules without an always-present index causes the agent to forget they exist.

---

## Architectural Design (3 Tiers)

### Tier 0 — Always-In-Context Micro-Kernel & Trigger Table (~60–90 lines / ~800 tokens)
This is the **only** file automatically loaded on every turn (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, or `.cursor/rules`). It contains strictly two blocks:
1. **The 10 Non-Negotiable Laws** (one sharp line each: Zero AI Footprint, No Code Before Verified Plan, Objectivity & Constructive Pushback, Always Strict Quality/Security, Proportional Ceremony, Dual Verification, Relative Paths, etc.).
2. **The Situation → File Trigger Routing Table:** Maps concrete engineering moments to the exact file the agent MUST read *before* acting:

| Trigger (When you are about to...) | Mandatory File to Read First |
| :--- | :--- |
| Start a feature or multi-file change | `07_project_management_and_context/planning_rigor_and_pre_code_gate.md` |
| Sequence or prioritize 2+ tasks | `07_project_management_and_context/prioritization_and_dependency_ordering.md` |
| Fix a bug or evaluate a workaround | `01_anti_shortcuts/root_cause_protocol.md` + `long_term_and_standards_gate.md` |
| Design UI/UX or use an unfamiliar/new library | `01_anti_shortcuts/targeted_skills_and_research.md` |
| Modify data models, queries, caching, or async jobs | `03_scalability/README.md` |
| Touch auth, secrets, permissions, or external inputs | `06_security_and_reliability/README.md` |
| Add/modify any entity or cross-cutting capability | `04_maintainability/domain_and_impact_integrity.md` |
| Claim a task or audit is "Done" | `01_anti_shortcuts/proof_of_work.md` + `05_documentation/living_docs_sync_rule.md` |
| Onboard an existing repository | `08_adoption_and_onboarding/brownfield_three_stage_audit.md` |

### Tier 1 — Recursive Pillar & Sub-Branch Routers (`README.md` / `INDEX.md`, ~15–35 lines each)
- Acts as a lightweight directory card for one Pillar or sub-branch.
- Lists each child branch or micro-leaf with a 1-line trigger condition ("Read when...") so the agent opens **only** the exact target and never reads unrelated sibling files.
- **Branches-Within-Branches Rule:** Whenever a topic naturally contains distinct sub-concerns that would exceed 120 lines, it MUST split into a sub-folder with its own tiny router + focused micro-leaves rather than growing into a long document.

### Tier 2 — Surgical Micro-Leaf Rules (`<pillar>/.../<rule>.md`, target 40–90 lines, hard ceiling 120 lines)
- Short, atomic, high-signal engineering specifications using the 4-part anatomy.
- **Stop-on-Target Rule:** The agent navigates directly down the single matching branch, reads the 1 exact micro-leaf needed (~300–500 tokens), and stops immediately — zero lateral reading of unrelated files.

---

## Anti-Amnesia Reinforcement: Self-Reminding Plan Checkpoints

Long conversations compress or drop early context. To prevent rule amnesia mid-project, **every generated Plan Tree and Verification template embeds direct relative links to the exact rules needed at each phase**:
- `01_spec_and_contracts.md` embeds links to *Impact Analysis* and *Living Docs Sync*.
- `02_phases/phase_XX.md` embeds links to *Clean Code* and *Long-Term Impact Gate*.
- `03_verification.md` embeds links to *Proof of Work (Dual Verification)* and *Adversarial Review*.

Result: **Even at turn 100, opening the active phase file re-triggers the exact rule needed right then — at <1% baseline token overhead.**
