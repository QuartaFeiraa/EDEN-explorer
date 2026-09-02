# EDEN RUMO — Security Baseline

This file is an executable development contract for RUMO. Security-sensitive changes are not accepted merely because they work visually.

## Golden baseline

- Product regression baseline: `RUMO v9 Stable` (`139c11530f6a8acf4b7c075ab19c3c05226fd9e4`).
- All changes must preserve the stable desktop, mobile, degraded-network, persistence, Radar, Essenciais, History and theme flows.
- Production changes must be reversible and backed by a migration or commit.

## Client trust boundary

- The browser is untrusted.
- `sb_publishable_*` is allowed in the client. Secret/service-role credentials are never allowed in HTML, JS bundles, localStorage, sessionStorage or URLs.
- Public Supabase REST calls use the publishable key only as `apikey`; user JWTs belong in `Authorization` when a signed-in user is required.
- Database or remote content rendered as HTML must be escaped or created through DOM text APIs. Dynamic CSS/class tokens require an allowlist.
- Client-side validation is usability only; authorization and data ownership remain enforced by Postgres RLS and grants.

## Supabase / Postgres

- Every exposed table must have RLS enabled before client access is granted.
- SQL grants and RLS are both required: grants define allowed operations, RLS defines allowed rows.
- `anon` and `authenticated` get the minimum operations needed; never grant `TRUNCATE`, `TRIGGER` or `REFERENCES` to browser roles.
- New tables receive no automatic browser privileges. Grants must be explicit in the same migration that introduces access.
- New functions receive no automatic `EXECUTE` for `public`, `anon` or `authenticated`.
- Prefer `security invoker`. Any `security definer` function must use a fixed/empty `search_path`, fully qualified relation names and explicit execute grants.
- DDL must be tracked in `supabase/migrations/`.

## Server endpoints

- Prefer `SUPABASE_SECRET_KEY` (`sb_secret_*`) for privileged server work. Legacy `SUPABASE_SERVICE_ROLE_KEY` is migration-only and must never be introduced into new client code.
- Server secrets are isolated by purpose. Admin, cron, billing, webhook and storage privileges must not silently fall back to the same shared secret.
- Every privileged endpoint must enforce method, authentication, bounded input size, structured validation, no-store responses and failure-safe behavior.
- Webhooks must verify provider signatures and be idempotent. Processing failures must remain retryable; do not acknowledge failed state transitions as successful.
- Billing creation/cancellation must be idempotent and reconcile provider state before local entitlement changes.
- AI output is untrusted input. It cannot directly authorize, charge, delete, publish or mutate high-impact data without deterministic validation.
- Background fetchers must use timeouts, bounded body sizes, URL/protocol allowlists where applicable, and explicit response-status checks.

## Dependencies and supply chain

- No floating production dependency versions.
- A lockfile is required for package-managed server code.
- Avoid runtime CDN dependencies when a bundled/pinned alternative is practical. If a CDN is used, pin the exact version and keep a tested failure mode.
- New third-party services require an abstraction boundary and an export path to avoid lock-in.

## Release gate

A release candidate is eligible only when:

1. JavaScript syntax and security invariants pass.
2. Chromium smoke tests pass on clean state, persisted state, corrupt local state, degraded Supabase and mobile viewport.
3. Stored-XSS regression test passes.
4. Supabase Security Advisor has no unresolved security warning introduced by the change.
5. Any database DDL exists as a reviewed migration.
6. No production secret is present in tracked client files.

## Incident rule

If a secret may have been exposed, treat it as compromised: revoke/rotate it first, then investigate. Do not rely on deleting it from the latest commit because Git history and deployment logs may retain it.
