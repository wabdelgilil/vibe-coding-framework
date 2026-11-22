# Async Execution, Concurrency & Queues

> **Pillar:** [03_scalability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Keep user-facing requests responsive and resilient under concurrent load, third-party latency, and traffic spikes.

## Mandatory Standards
1. **Non-Blocking Request Paths:** Offload heavy computation, bulk exports, email/notification fan-out, media processing, and slow third-party calls to background workers or durable queues.
2. **Bounded Concurrency & Timeouts:** Every outbound HTTP call, RPC, and parallel batch MUST set explicit timeouts and concurrency limits (no unbounded `Promise.all` / thread fan-out over arbitrary arrays).
3. **Resilient Retries:** Transient external failures MUST use bounded retries with exponential backoff and jitter—never tight infinite retry loops.
4. **Rate Limiting & Backpressure:** Protect public endpoints, auth routes, and expensive operations with rate limits and graceful degradation (`429` / queue buffering).
5. **Safe Concurrency Control:** Protect shared mutable state transitions (inventory deductions, balance updates, workflow transitions) with database transactions, row locks, or optimistic version checks.

## Prohibited Anti-Patterns
- Blocking the main request thread on multi-second file generation, AI inference, or third-party webhooks.
- Unbounded parallel network calls over user-supplied or database-fetched lists.
- Non-atomic read-modify-write updates on counters, balances, or status fields.

## Verification & Audit Checklist
- [ ] Heavy or slow I/O work is offloaded asynchronously off the request path.
- [ ] All external calls enforce explicit timeouts, bounded concurrency, and jittered retries.
- [ ] Concurrent state mutations use atomic transactions or optimistic locking.
