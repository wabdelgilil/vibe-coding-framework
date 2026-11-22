# Domain & Impact Integrity

> **Pillar:** [04_maintainability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent isolated, half-wired features that work on one screen while breaking related modules, reverse navigation, search, permissions, or reports.

## Mandatory Standards
1. **Pre-Implementation Impact Analysis:** Before creating or modifying any entity or feature, identify all connected entities and document impact across:
   - Data schema & migrations, API contracts, UI views, navigation, search, permissions/RBAC, reports/dashboards, notifications, audit logs, and external integrations.
2. **No Isolated Entities:** Every new domain entity MUST explicitly define its parent, child, and related entities, lifecycle transitions, and navigation entrypoints before implementation starts.
3. **Bidirectional Relationship Symmetry:** When Entity A references Entity B, verify both directions where applicable: database/ORM relations, API exposure (`A → B` and `B → A`), UI visibility, bidirectional navigation, search, and consistent permissions on both sides.
4. **Domain Consistency:** Keep entity names, status enums, and business invariants synchronized across database schemas, backend types, frontend types, and documentation.

## Prohibited Anti-Patterns
- Implementing a new entity or relation in one screen without wiring its reverse view, navigation, or permission checks.
- Modifying a shared schema or status enum without auditing downstream reports, filters, and consumers.
- Starting implementation on a core entity before mapping its incoming and outgoing dependencies.

## Verification & Audit Checklist
- [ ] Pre-implementation impact analysis completed across all affected layers.
- [ ] No new or modified entity is isolated; all relationships and navigation paths are wired.
- [ ] Bidirectional symmetry and consistent permissions verified on both sides of each relation.
