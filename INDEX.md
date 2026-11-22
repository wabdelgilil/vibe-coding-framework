# Engineering Governance Framework — Central Hub

> **Purpose:** Pure-Markdown, language-agnostic reference tree for bootstrapping professional rules, architecture standards, and hierarchical project management in any software repository.
> **Navigation Law:** Stop-on-Target. Traverse only the Pillar and micro-leaf required for your current step. Never bulk-read unrelated files.

---

## 1. Execution Entrypoints (Start Here)

| Scenario | Read First |
| :--- | :--- |
| **New project (Greenfield)** | [08_adoption_and_onboarding/greenfield_bootstrap.md](08_adoption_and_onboarding/greenfield_bootstrap.md) |
| **Existing repository (Brownfield)** | [08_adoption_and_onboarding/brownfield_three_stage_audit.md](08_adoption_and_onboarding/brownfield_three_stage_audit.md) |
| **Generate target agent rules** | [09_output_blueprints/agent_rule_adapters.md](09_output_blueprints/agent_rule_adapters.md) |

---

## 2. The 9 Governance Pillars

| Pillar | Router | Core Responsibility |
| :-: | :--- | :--- |
| **01** | [01_anti_shortcuts/README.md](01_anti_shortcuts/README.md) | Objectivity, anti-shortcuts, root cause, long-term impact, targeted research, dual verification, adversarial review |
| **02** | [02_clean_code/README.md](02_clean_code/README.md) | Zero AI footprint, naming, modularity, strict types, deterministic tooling |
| **03** | [03_scalability/README.md](03_scalability/README.md) | Stateless design, query scale, async execution, complexity and resource bounds |
| **04** | [04_maintainability/README.md](04_maintainability/README.md) | Clean boundaries, domain/impact integrity, observability, regression tests, tech debt |
| **05** | [05_documentation/README.md](05_documentation/README.md) | Mandatory per-feature artifacts (SRS, Feature Spec, API contracts, ADRs) and living sync |
| **06** | [06_security_and_reliability/README.md](06_security_and_reliability/README.md) | Secrets hygiene, input validation, defense-in-depth, data immutability, safe recovery |
| **07** | [07_project_management_and_context/README.md](07_project_management_and_context/README.md) | Pre-code planning gate, dependency prioritization, hierarchical plan trees, physical archival |
| **08** | [08_adoption_and_onboarding/README.md](08_adoption_and_onboarding/README.md) | Greenfield bootstrap and 3-stage Brownfield maturity audit |
| **09** | [09_output_blueprints/README.md](09_output_blueprints/README.md) | Multi-agent Tier-0 rule adapters and standard project templates |

---

## 3. Non-Negotiable Operating Laws

1. **Always Strict Quality + Proportional Ceremony:** Never compromise code quality, security, or verification; scale planning and documentation depth to actual change size.
2. **3-Tier Context Memory:** Compile target project rules into a lean Tier-0 Micro-Kernel + Trigger Table (≤ 90 lines) pointing to on-demand Pillar micro-leaves (≤ 120 lines).
3. **100% Relative Paths:** Never write hardcoded local machine paths (`file:///...`) inside repository files.
4. **Zero AI Footprint:** Every artifact must read as seasoned human engineering with zero synthetic watermarks.
