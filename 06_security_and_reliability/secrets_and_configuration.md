# Secrets & Configuration Hygiene

> **Pillar:** [06_security_and_reliability](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Eliminate hardcoded credentials, accidental secret commits, and misconfigured runtime environments. Applies to all code, tests, CI workflows, containers, and documentation.

## Mandatory Standards
1. **Zero Hardcoded Secrets:** API keys, passwords, private keys, JWT secrets, webhook signing secrets, and database connection strings MUST NEVER appear in source code, tests, or committed config files.
2. **Environment & Secret Store Loading:** Load all secrets exclusively from environment variables or a dedicated secret manager. Validate all required config values at startup and fail fast if missing or malformed.
3. **Permanent Git Exclusion:** Ensure `.env`, `.env.*` (excluding `.env.example`), key files (`.pem`, `.key`), and credential dumps are permanently ignored in `.gitignore`.
4. **Least-Privilege Credentials & Environment Parity:** Never point local development or test runs at production databases or production credentials. Scope every service token to the minimum permissions required.

## Prohibited Anti-Patterns
- Hardcoding a fallback secret (`process.env.JWT_SECRET || "dev-secret-123"`) in production code.
- Committing real `.env` files or pasting live tokens into documentation, issues, or logs.
- Connecting local scripts or test suites to live production databases.

## Verification & Audit Checklist
- [ ] Zero hardcoded secrets or fallback secret literals in changed files.
- [ ] `.gitignore` excludes all local `.env` and key files; `.env.example` uses dummy values only.
- [ ] Startup config validation fails fast on missing or invalid required variables.
