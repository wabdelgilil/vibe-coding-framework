# Input Validation, Auth & Defense-in-Depth

> **Pillar:** [06_security_and_reliability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Protect all system boundaries against untrusted input, broken access control, and injection attacks. Security controls are non-exemptible red lines.

## Mandatory Standards
1. **Treat All External Input as Untrusted:** Strictly validate type, format, length, and allowed ranges on every HTTP payload, query parameter, header, file upload, CLI argument, and webhook before processing.
2. **Server-Side Authority Always:** Enforce authentication, authorization (RBAC/ABAC), ownership checks, and business invariants exclusively on the server—client-side validation is UX only.
3. **Strict Tenant & Resource Isolation:** In multi-tenant or multi-user systems, scope every data query and mutation to the authenticated actor/tenant context resolved at the auth layer—never trust client-supplied `user_id` or `tenant_id` blindly.
4. **Injection & Path Traversal Prevention:**
   - Use parameterized queries or typed ORMs exclusively (zero string-interpolated SQL).
   - Never pass unsanitized input to shell commands, `eval`, or raw HTML rendering (XSS).
   - Canonicalize and confine file paths to intended root directories.
5. **Modern Cryptography:** Hash passwords with Argon2id or bcrypt; use constant-time comparison for tokens/signatures; enforce TLS in transit.

## Prohibited Anti-Patterns
- Checking permissions only in the frontend UI while leaving backend endpoints open.
- Interpolating user input into SQL queries, shell commands, or `dangerouslySetInnerHTML`.
- Using weak hashes (`MD5`, `SHA1`) for passwords or rolling custom cryptographic primitives.

## Verification & Audit Checklist
- [ ] All external inputs validated against strict schemas at the boundary.
- [ ] Server-side auth, RBAC, and tenant/ownership scoping verified on every modified endpoint.
- [ ] Zero SQL/command/XSS injection or path-traversal vectors introduced.
