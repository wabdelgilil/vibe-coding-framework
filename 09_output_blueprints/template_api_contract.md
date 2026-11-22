# Blueprint: API & Schema Contract (`docs/specs/<slug>/contract.md`)

> **Pillar:** [09_output_blueprints](README.md) | **Hub:** [INDEX.md](../INDEX.md)

```markdown
# Contract: <Endpoint / Event / Interface Name>

> **Version:** v1 | **Auth Required:** Yes/No | **Required Role/Scope:** <Role> | **Rate Limit:** <Limit>

## 1. Endpoint / Trigger
- **Method & Path (or Event Topic):** `<METHOD> /api/v1/<resource>`
- **Idempotency:** <Required via `Idempotency-Key` header / N/A>
- **Pagination:** <Cursor / Bounded offset, max page size>

## 2. Request Schema
| Field | Type | Required | Validation Constraints |
| :--- | :--- | :-: | :--- |
| `<field>` | `<type>` | Yes | `<min/max/format>` |

## 3. Success Response (`200` / `201`)
```json
{
  "data": {},
  "meta": { "nextCursor": null }
}
```

## 4. Error Contracts
| Status | Error Code | Condition |
| :-: | :--- | :--- |
| `400` | `VALIDATION_ERROR` | Schema or invariant violation |
| `401` / `403` | `UNAUTHENTICATED` / `FORBIDDEN` | Missing token or insufficient role/tenant scope |
| `404` / `409` | `NOT_FOUND` / `CONFLICT` | Missing resource or state/version conflict |
```
