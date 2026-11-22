# Resource & Algorithmic Complexity Bounds

> **Pillar:** [03_scalability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent memory leaks, resource exhaustion, and quadratic algorithmic slowdowns as inputs grow. Applies to all data processing, file handling, and hot-path computations.

## Mandatory Standards
1. **Algorithmic Awareness:** Avoid $O(n^2)$ nested loops over growing collections when $O(n)$ or $O(n \log n)$ via hash maps, sets, or indexed lookups is straightforward.
2. **Deterministic Resource Cleanup:** Always acquire file handles, streams, DB connections, locks, and subscriptions using scoped lifecycle constructs (`with`, `try/finally`, `using`) to guarantee release on both success and failure.
3. **Streaming Over Full Buffering:** Process large files, exports, and payloads via streaming or chunked iteration rather than loading entire files into memory.
4. **Explicit Input & Payload Caps:** Enforce strict upper bounds on upload sizes, batch lengths, recursion depth, and regex execution (guarding against ReDoS).

## Prohibited Anti-Patterns
- Nested `.find()` / `.includes()` scans inside loops over large arrays instead of pre-indexing into a `Map`/`Set`.
- Reading multi-megabyte uploads or CSV exports entirely into RAM before validation.
- Opening sockets, file descriptors, timers, or event listeners without deterministic teardown.

## Verification & Audit Checklist
- [ ] Hot-path loops avoid avoidable $O(n^2)$ lookups over unbounded collections.
- [ ] All handles, connections, and listeners have guaranteed cleanup on error paths.
- [ ] Large file/payload operations enforce size caps and stream/chunk safely.
