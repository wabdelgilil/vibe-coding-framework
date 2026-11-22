# Blueprint: System Requirements Specification (`SRS.md`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

```markdown
# System Requirements Specification (SRS) — <Project Name>

> **Version:** 0.1.0 | **Last Updated:** YYYY-MM-DD | **Status:** Active

## 1. Executive Scope & Objectives
- **Problem Statement:** <Concise domain problem solved>
- **Target Stakeholders & Actors:** <Roles and user personas>
- **Out of Scope:** <Explicit boundaries>

## 2. Functional Requirements
| ID | Domain / Module | Requirement Description | Linked Spec |
| :--- | :--- | :--- | :--- |
| FR-01 | <Module> | <Testable requirement> | [spec](docs/specs/<slug>/spec.md) |

## 3. Non-Functional Requirements
- **Security & Access Control:** <Auth, RBAC, tenant isolation, data protection>
- **Scalability & Performance:** <Latency budgets, pagination, concurrency, growth targets>
- **Reliability & Data Integrity:** <Transactions, backups, idempotency, immutability>
- **Maintainability & Testing:** <Strict typing, deterministic gates, coverage expectations>

## 4. Architecture & External Dependencies
- **Architecture Overview:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **External Integrations:** <APIs, databases, queues, identity providers>
```
