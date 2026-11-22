# Code & API Contract Documentation

> **Pillar:** [05_documentation](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Ensure every public interface, API endpoint, event schema, and domain module is self-documenting, accurate, and unambiguous for both human consumers and AI agents.

## Mandatory Standards
1. **Explicit API & Event Contracts:** Every public endpoint, RPC, webhook, or message topic MUST document: route/name, auth/permission requirements, request schema, response schema, pagination/rate limits, and exact error codes.
2. **Meaningful Public Docstrings:** Document public classes, services, and non-trivial functions using the language's standard docstring format—focusing on *intent, invariants, side effects, and raised domain exceptions*.
3. **Inline Comments Explain "Why" Only:** Use inline comments strictly to document non-obvious business constraints, regulatory rules, performance invariants, or workarounds linked to an issue/TD ID.
4. **Contract-Code Alignment:** Prefer schema-driven or code-generated contract specs (e.g., OpenAPI, typed schemas) where supported so documentation cannot silently diverge from runtime validation.

## Prohibited Anti-Patterns
- Documenting only the `200 OK` response while omitting `400`/`401`/`403`/`404`/`409`/`429` error contracts.
- Writing tautological docstrings (`"Gets the user by ID"`) that add zero information beyond the signature.
- Leaving example payloads containing outdated field names or missing required properties.

## Verification & Audit Checklist
- [ ] All added/modified endpoints and events have complete request, response, auth, and error contracts.
- [ ] Public interfaces carry concise docstrings describing invariants and exceptions.
- [ ] Example payloads match actual validated schemas.
