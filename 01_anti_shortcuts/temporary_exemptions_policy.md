# Temporary Exemptions Policy

> **Pillar:** [01_anti_shortcuts](README.md) | **Hub:** [INDEX.md](../INDEX.md)

## Objective & Scope
Prevent "temporary hacks" from turning into permanent architectural rot by governing the rare cases where a project standard must be temporarily waived.

## Mandatory Standards
1. **Explicit User Approval Required:** An agent MUST NEVER grant itself a rule exemption silently. Every exemption requires explicit user sign-off after objective risk disclosure.
2. **Mandatory 4-Field Exemption Record:** Every approved exemption MUST be recorded in `TECH_DEBT_REGISTER.md` (and the active Feature Spec / Plan) with:
   - Exact rule being exempted and affected files.
   - Technical justification and risk assessment.
   - Concrete remediation plan to restore full compliance.
   - **Hard Expiration Trigger** (specific sprint, milestone, or next MAJOR release).
3. **Automatic Expiration:** Exemptions expire automatically at their stated trigger and MUST either be remediated or formally re-approved by the user.
4. **Non-Exemptible Red Lines:** Security controls (zero hardcoded secrets, server-side authorization, tenant isolation, injection defense) and data-loss protections MUST NEVER be exempted in production code.

## Prohibited Anti-Patterns
- Adding an undocumented workaround with a vague comment like `// temporary fix`.
- Renewing expired exemptions indefinitely without scheduling remediation.
- Granting exemptions for critical security or data-integrity rules.

## Verification & Audit Checklist
- [ ] User explicitly approved the exemption after reviewing the risks.
- [ ] Exemption logged in `TECH_DEBT_REGISTER.md` with justification, remediation plan, and expiration trigger.
- [ ] Confirmed no non-exemptible security or data-integrity red line was waived.
