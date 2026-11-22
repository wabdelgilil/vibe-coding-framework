# Prioritization & Dependency Ordering

> **Pillar:** [07_project_management_and_context](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent blind sequential execution (`1 → 2 → 3`) when tasks have hidden dependencies, shared-file conflicts, or unequal security/business risk.

## Mandatory Standards
1. **Dependency & Conflict Analysis First:** Whenever 2+ tasks exist, build a dependency/conflict map and execute in topological order—if Task 1 depends on or conflicts with Task 4, Task 4 MUST run first.
2. **Engineering Priority Hierarchy:**
   - `P0` — Critical security flaws, data-integrity hazards, and blocking outages.
   - `P1` — Foundational dependencies, shared contracts, schemas, and core abstractions.
   - `P2` — Core user-facing functional features.
   - `P3` — Optimizations, polish, and non-blocking enhancements.
3. **Conflict Consolidation:** When multiple tasks touch the same module or schema, sequence foundational changes first or group them into one coherent wave to prevent rework.
4. **User Escalation for Business Ties:** When tasks have equal technical priority or competing product urgency, present the recommended order with dependency rationale and let the user decide.

## Prohibited Anti-Patterns
- Executing a backlog blindly in written list order while ignoring prerequisites or conflicts.
- Building UI or secondary features on top of an unresolved `P0` security flaw or unstable schema.
- Guessing business/product priority silently when trade-offs require user direction.

## Verification & Audit Checklist
- [ ] Dependency and conflict graph evaluated before starting execution.
- [ ] `P0` security/data risks and `P1` foundations scheduled ahead of dependent features.
- [ ] Ambiguous business priorities escalated to the user with a clear recommendation.
