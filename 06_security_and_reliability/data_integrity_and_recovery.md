# Data Integrity, Immutability & Safe Recovery

> **Pillar:** [06_security_and_reliability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent irreversible data loss, silent corruption, destructive migrations, and broken intermediate workspace states.

## Mandatory Standards
1. **Source Data Immutability:** Raw input files, client baselines, historical logs, and source datasets MUST be treated as read-only. Processing pipelines MUST write transformed outputs to separate target directories or tables—never mutate raw inputs in place.
2. **Safe, Reversible Schema Migrations:** Manage all database schema changes through versioned migration files. Avoid destructive operations (`DROP TABLE`, `DROP COLUMN`) without an explicit backup, expand-contract rollout, and user approval.
3. **Self-Verifying Mathematical & Financial Integrity:** Any quantitative, billing, inventory, or aggregation logic MUST include automated assertions or balance checks verifying component sums reconcile with grand totals (`delta == 0`).
4. **Transactional Atomicity:** Wrap multi-step database writes that must succeed or fail together inside explicit transactions.
5. **Auditability & Safe Rollback:** Log critical mutations (actor, action, timestamp, target) and never leave a repository branch in a broken, non-compiling state—resolve defects or roll back cleanly via Git.

## Prohibited Anti-Patterns
- Overwriting original client source files or raw datasets during data processing.
- Running ad-hoc manual DDL changes directly against shared/production databases without migrations.
- Leaving partial multi-table writes outside a transaction where mid-way failure corrupts state.

## Verification & Audit Checklist
- [ ] Raw source data remains untouched and immutable.
- [ ] Schema migrations are versioned, additive/reversible, and verified cleanly.
- [ ] Multi-step mutations are transactional; quantitative outputs pass zero-delta balance assertions.
