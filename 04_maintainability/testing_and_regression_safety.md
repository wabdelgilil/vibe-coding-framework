# Testing & Regression Safety

> **Pillar:** [04_maintainability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Guarantee that new changes work on real behavior and do not silently break existing features. Applies to all business logic, API endpoints, critical UI flows, and bug fixes.

## Mandatory Standards
1. **Test Real Behavior, Not Mocks:** Assert observable outcomes, state transitions, and API contracts—never write tests that merely assert a mocked function returned its own hardcoded mock value.
2. **Balanced Coverage Across Risk:**
   - *Unit Tests:* Pure domain logic, calculations, validators, and edge cases.
   - *Contract / Integration Tests:* API request/response shapes, status codes, authorization/tenant isolation, and real persistence/repository behavior.
   - *Regression Tests:* Mandatory test for every non-trivial bug fix proving the bug cannot silently return.
3. **Strict Test Isolation & Determinism:** Every test MUST be independent, clean up its own state, run safely in parallel, and never depend on wall-clock flakiness or live third-party networks.
4. **Boundary & Negative Path Coverage:** Every feature test suite MUST cover invalid inputs, unauthorized callers, missing resources, and edge boundaries—not just the happy path.

## Prohibited Anti-Patterns
- Mocking the entire service under test so the test always passes even when production logic is broken.
- Deleting, skipping (`.skip`), or loosening assertions on failing tests instead of fixing the code.
- Relying on shared mutable test state that causes order-dependent failures.

## Verification & Audit Checklist
- [ ] Tests verify real behavior across happy paths, negative paths, and authorization boundaries.
- [ ] Every bug fix includes a targeted regression test.
- [ ] Full relevant test suite runs deterministically and passes after the final edit.
