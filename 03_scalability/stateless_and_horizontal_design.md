# Stateless & Horizontal Design

> **Pillar:** [03_scalability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Ensure application services scale horizontally across multiple instances or serverless workers without session loss, split-brain state, or local-disk bottlenecks.

## Mandatory Standards
1. **Stateless Application Tier:** API and service handlers MUST NOT store session state, job state, or mutable business caches exclusively in process memory or ephemeral local disk.
2. **Externalized Shared State:** Store sessions, distributed locks, rate-limit counters, and shared caches in external state stores or databases accessible by all replicas.
3. **Explicit Cache Invalidation Strategy:** Every caching layer MUST define a bounded TTL and a deterministic invalidation strategy (key-based or tag-based) on mutations.
4. **Idempotent Mutating Operations:** Critical write endpoints and webhook/event consumers SHOULD support idempotency keys so retries under load or network drops never duplicate side effects.

## Prohibited Anti-Patterns
- Storing user sessions, uploaded production assets, or rate-limit maps in in-memory variables (`Map`, global `dict`) assuming a single long-lived process.
- Caching sensitive or tenant-scoped data under keys that omit tenant or user context.
- Infinite-TTL caches without an explicit invalidation trigger on writes.

## Verification & Audit Checklist
- [ ] Application tier runs safely across 2+ concurrent replicas without shared-memory assumptions.
- [ ] All caches define bounded TTLs, tenant/scope-safe keys, and write invalidation.
- [ ] Critical write/retry paths are idempotent.
