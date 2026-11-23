# Blueprint: Feature Specification (`docs/specs/<slug>/spec.md`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

```markdown
# Feature Spec: <Feature Name>

> **Feature ID:** FEAT-NNN | **Status:** Draft / Approved / Implemented | **SRS Ref:** FR-XX

## 1. Objective & User Value
<What this feature enables and why it exists.>

## 2. Functional Behavior & Edge Cases
- **Primary Flows:** <Step-by-step expected behavior>
- **Edge Cases & Failure Modes:** <Empty states, invalid inputs, concurrency conflicts, timeouts, unauthorized access>

## 3. Pre-Implementation Impact Analysis
| Area | Impacted Components / Entities | Required Changes |
| :--- | :--- | :--- |
| Data / Schema | <Tables, migrations, indexes> | <Details> |
| API / Contracts | <Endpoints, events, schemas> | <Details> |
| UI & Navigation | <Views, reverse navigation, search> | <Details> |
| Security & Audit | <RBAC, tenant scope, audit logs> | <Details> |

## 4. Acceptance Criteria (Testable Definition of Done)
- [ ] <Observable, verifiable criterion 1>
- [ ] <Negative/unauthorized path criterion 2>
- [ ] `SRS.md`, API contracts, and `CHANGELOG.md` updated in sync.

## 5. Spec Delta (For Existing-Feature Modifications Only)
<!-- Use this block when iterating on an existing spec, then fold approved changes into Sections 2–4 upon closure. -->
- **Added:** <New fields, states, or behaviors>
- **Modified:** <Changed rules or edge-case handling>
- **Removed:** <Deprecated behaviors or contracts>
```
