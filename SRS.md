# System Requirements Specification (SRS)

> **Project:** Pure-Markdown AI Engineering Governance Framework (Working Title: `vibe-coding-framework`)  
> **Version:** 1.0.0 (Implemented Baseline)  
> **Status:** Active Specification  

---

## 1. Executive Scope & Objective

This repository provides a **pure-Markdown, zero-dependency, language-agnostic engineering governance tree** designed to eliminate the systemic failure modes of ad-hoc AI-assisted software development ("vibe coding").

Instead of shipping runtime scripts or CLI tools, the framework operates as a **structured knowledge tree of modular Pillars linked to a Central Hub (`INDEX.md`)**. Any AI coding agent reads the Hub directly and compiles a tailored, strictly enforced Rules file and Hierarchical Project Management system for any new (**Greenfield**) or existing (**Brownfield**) software project.

### Core Failure Modes Addressed
1. **AI Sycophancy & Uncritical Agreement** — enforcing objective, constructive challenge.
2. **Premature Execution & Rushed Planning** — blocking code edits until a verified plan exists.
3. **Myopic Patch-to-Pass Fixes** — evaluating long-term impact and standards compliance before fixing.
4. **Shortcut Bias & Silent Workarounds** — prohibiting hardcoding, empty catches, and rule suppression.
5. **Memory-Only Improvisation** — enforcing targeted skill discovery and research on specialized tasks.
6. **Blind Script Trust** — requiring dual verification (automated checks + direct agent reading/sampling).
7. **AI Footprint** — eliminating synthetic signatures, robotic comments, and generator watermarks.
8. **Poor Clean Code, Scalability, Maintainability & Living Documentation** — elevating each as a first-class Pillar.
9. **Faulty Prioritization & Context Drift** — enforcing dependency-ordered execution and hierarchical Context-as-Code.

---

## 2. Functional Requirements

| ID | Capability | Requirement Description |
| :--- | :--- | :--- |
| **FR-01** | **Central Hub Router (`INDEX.md`)** | A single entrypoint instructing any AI agent how to bootstrap a new project or adopt an existing repository without requiring scripts or CLI tools. |
| **FR-02** | **3-Tier Trigger-Based Context Architecture** | Generated project rules MUST use a lean always-in-context Micro-Kernel + Trigger Routing Table (~60–90 lines) pointing to Pillar indexes and focused leaf rules to prevent context window bloat while guaranteeing on-demand recall. |
| **FR-03** | **9 Modular Engineering Pillars** | Organized tree covering: (01) Anti-Shortcuts & Objectivity, (02) Clean Code & Zero AI Footprint, (03) Scalability, (04) Maintainability & Domain Integrity, (05) Standard & Living Documentation, (06) Security & Reliability, (07) Hierarchical Project Management & Prioritization, (08) Greenfield & 3-Stage Brownfield Adoption, (09) Output Blueprints & Multi-Agent Adapters. |
| **FR-04** | **Standard Pillar Document Anatomy** | Every leaf rule file MUST follow a uniform 4-part structure: *Objective & Scope*, *Mandatory Standards*, *Prohibited Anti-Patterns*, and *Verification & Audit Checklist*. |
| **FR-05** | **Multi-Agent Rule Adaptation** | Output blueprints MUST instruct the agent to emit the native rule format for the target environment (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursor/rules`, `.github/copilot-instructions.md`). |
| **FR-06** | **Always Strict Quality + Proportional Ceremony** | Code quality, security, anti-shortcut, and verification standards are strictly enforced on every change; planning and documentation depth scales proportionally to change size. |
| **FR-07** | **Hierarchical Project Management Blueprint** | `MASTER_PLAN.md` serves strictly as an active-only front door linking to per-initiative plan folders (`plans/<slug>/`) whose internal file tree scales with complexity, with physical archival of closed folders into `archive/`. |
| **FR-08** | **Greenfield & 3-Stage Brownfield Flows** | Dedicated onboarding paths for starting from scratch and for auditing/modernizing legacy repositories via a 3-stage maturity model (Standard → 1–5 CMMI Audit → Wave Remediation). |

---

## 3. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Zero Runtime Dependencies** | 100% pure Markdown (`.md`). No Python, Node.js, shell scripts, or build steps required to consume the framework. |
| **Language-Agnostic Core** | No hardcoded programming language or framework lock-in; rules mandate configuring native deterministic tooling for whatever stack the target project uses. |
| **Context Window Budget** | Generated Tier-0 rule files MUST stay under 90 lines (~800 tokens). Pillar & sub-branch routers MUST stay under 35 lines. Every leaf rule file MUST be a surgical micro-file (target 40–90 lines, hard ceiling 120 lines); any topic exceeding this MUST decompose into recursive sub-branches (branches-within-branches). |
| **Portability & Link Integrity** | 100% repository-relative Markdown paths. Zero hardcoded local machine paths (`file:///...`). Zero broken internal links. |
| **Language & Tone** | 100% English for all framework files and generated outputs. Authoritative, concise senior-engineering prose with zero AI footprint. |

---

## 4. Repository Architecture

```text
vibe-coding-framework/
├── INDEX.md                             # Framework Central Hub & Execution Router
├── README.md                            # Human-facing overview & usage guide
├── SRS.md                               # This specification
├── .gitignore
├── 01_anti_shortcuts/                   # Pillar 01
├── 02_clean_code/                       # Pillar 02
├── 03_scalability/                      # Pillar 03
├── 04_maintainability/                  # Pillar 04
├── 05_documentation/                    # Pillar 05
├── 06_security_and_reliability/         # Pillar 06
├── 07_project_management_and_context/   # Pillar 07
├── 08_adoption_and_onboarding/          # Pillar 08
├── 09_output_blueprints/                # Pillar 09
├── docs/
│   └── BRAINSTORMING.md                 # Approved brainstorming & design decisions record
└── project_management/                  # Self-governed hierarchical project management
    ├── MASTER_PLAN.md
    ├── COMPLETED_WORK.md
    ├── TECH_DEBT_REGISTER.md
    ├── plans/
    └── archive/
```
