# Blueprint: System Architecture (`docs/ARCHITECTURE.md`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

```markdown
# System Architecture — <Project Name>

> **Last Updated:** YYYY-MM-DD | **SRS:** [../SRS.md](../SRS.md) | **ADRs:** [adrs/](adrs/)

## 1. High-Level Component Map
<Concise diagram or structured description showing clients, API/service layers, workers, persistence, and external services.>

## 2. Layering & Dependency Rules
- **Presentation / UI:** <Responsibilities & forbidden imports>
- **API / Transport:** <Validation, auth resolution, error mapping>
- **Domain Services:** <Authoritative business rules>
- **Data Access / Repositories:** <Sole persistence boundary>

## 3. Shared Platform Capabilities
| Capability | Authoritative Module | Consumers |
| :--- | :--- | :--- |
| Auth & Authorization | <path> | All protected routes/services |
| Audit & Logging | <path> | All mutating services |

## 4. Trust Boundaries & Data Flows
- **Authentication & Tenant Context:** <Where resolved and enforced>
- **Async / Background Workflows:** <Queues, retries, idempotency>
```
