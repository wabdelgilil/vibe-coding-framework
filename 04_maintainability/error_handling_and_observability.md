# Error Handling & Observability

> **Pillar:** [04_maintainability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Ensure production failures are diagnosable in seconds without leaking sensitive internals to end users. Applies to all services, APIs, workers, and UI error boundaries.

## Mandatory Standards
1. **Domain-Specific Typed Exceptions:** Define structured error classes/codes (e.g., `ValidationError`, `AuthorizationError`, `ResourceNotFoundError`, `ConflictError`) mapped consistently to transport status codes at the API boundary.
2. **Structured Logging Only:** Use the project's structured logger with explicit severity levels (`DEBUG`, `INFO`, `WARN`, `ERROR`, `CRITICAL`) and correlation/request IDs—never raw `console.log` / `print` in production code.
3. **Zero Sensitive Data in Logs or Client Errors:** Never log passwords, tokens, API keys, session cookies, or raw PII. Return safe, actionable error messages to clients while keeping stack traces strictly server-side.
4. **Actionable Context on Failure:** Include the operation name, correlation ID, and safe entity identifiers in error logs so failures can be traced without guesswork.
5. **UI Error Boundaries & Graceful Degradation:** Frontend surfaces MUST catch render/network errors cleanly and present recovery actions rather than blank screens.

## Prohibited Anti-Patterns
- Returning raw database errors, SQL queries, or stack traces in HTTP API responses.
- Logging unstructured strings without correlation IDs or leaving debug `print`/`console.log` statements in committed code.
- Throwing generic `Error("something went wrong")` without error codes or context.

## Verification & Audit Checklist
- [ ] Domain errors map cleanly to structured API responses without leaking internals.
- [ ] Structured logging used with appropriate severity levels and zero raw `print`/`console.log`.
- [ ] Confirmed zero secrets, tokens, or PII appear in logs or error payloads.
