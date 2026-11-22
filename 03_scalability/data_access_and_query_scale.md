# Data Access & Query Scale

> **Pillar:** [03_scalability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent database bottlenecks that work with 10 test rows but collapse under production data volumes. Applies to all repositories, ORM queries, SQL, and list endpoints.

## Mandatory Standards
1. **Zero $N+1$ Queries:** Never execute database or API calls inside a loop over parent records. Use eager loading, joins, or batched `IN` / bulk queries.
2. **Mandatory Pagination & Upper Bounds:** Every list/search endpoint and collection query MUST enforce pagination (cursor-based preferred for large/live datasets, or bounded offset) with a strict maximum page size.
3. **Index-Backed Access Paths:** Every frequent filter (`WHERE`), join key, foreign key, tenant scope column, and sort column (`ORDER BY`) MUST be backed by an appropriate index.
4. **Minimal Projection:** Fetch only the columns/fields required by the caller—never select entire wide rows or binary blobs for summary lists.
5. **Connection Pooling & Query Timeouts:** Configure bounded connection pools and explicit statement timeouts so one slow query cannot exhaust database connections.

## Prohibited Anti-Patterns
- Unbounded `SELECT *` or `.findAll()` returning an entire table to an API or UI.
- Executing per-item child queries inside a `for`/`map` loop.
- Filtering or sorting large tables on unindexed computed expressions in hot paths.

## Verification & Audit Checklist
- [ ] Zero $N+1$ query patterns in modified repositories or services.
- [ ] All list endpoints enforce pagination with a hard maximum page size.
- [ ] New query filters, foreign keys, and sort orders are backed by indexes.
