# EDEN RUMO — Architecture Contract

## Product principle

RUMO evolves from the proven v9 stable product instead of being rewritten. The preferred change is the smallest coherent change that improves the product while preserving existing behavior.

Priorities: **Bom + Bonito + Barato**, cloud-only, free/open-source first, secure by default, portable data and no unnecessary vendor lock-in.

## Runtime layers

### 1. Stable shell

`index.html` + `script.js` + `app/bootstrap.js` own the initial render and boot contract. Critical modules load before `rumo:booted`; optional modules degrade independently; Radar and courses remain lazy where possible.

A non-critical feature must not be allowed to prevent the stable shell from becoming usable.

### 2. Browser application

`window.RUMO` is the current compatibility boundary for the v9 codebase. New modules should consume that boundary rather than creating a second Supabase client, second session state or duplicate navigation state without a demonstrated need.

Guest mode remains useful without an account. Local state is allowed for guest preferences/progress that do not require server authority. Authenticated state syncs through Supabase and RLS.

### 3. Data layer

Supabase/Postgres is the system of record for authenticated user state and shared catalogue data. Ownership belongs in the database through foreign keys, grants, constraints and RLS—not only in frontend filtering.

Every schema change is migration-driven. Browser roles use least privilege. Server-only tables remain inaccessible to browser roles even when RLS also denies access.

### 4. Server capabilities

Vercel functions are adapters for capabilities that require secrets or trusted execution: billing, webhooks, scheduled refresh, push delivery, privileged content operations and AI gateway access.

Server code must share small infrastructure helpers instead of copying credential/header logic between endpoints. Provider-specific code stays behind adapters so Mercado Pago, Vercel AI Gateway, R2 or any later provider can be replaced without rewriting the product domain.

### 5. External providers

Provider data is never the only representation of product state. Persist provider identifiers plus normalized local state needed for reconciliation/export. Do not couple frontend components directly to provider response shapes.

## Change strategy

- No big-bang framework migration while the stable product is being productized.
- No rewrite solely to make the stack look modern.
- Introduce shared modules only when they remove repeated risk or repeated logic.
- Port post-v9 features one capability at a time and put each behind the stable regression suite.
- Security/architecture refactors must be behavior-preserving unless a behavior is explicitly unsafe.
- Visual changes are out of scope for backend/security work unless required for accessibility, correctness or a security state.

## Failure model

RUMO should remain useful when an optional service fails.

- Supabase unavailable: guest/local shell should still render where applicable.
- AI unavailable: core study and planning remain usable.
- Push unavailable: no impact on interactive study flows.
- Billing unavailable: no accidental entitlement grant/revoke; show/retry later at the product layer.
- Radar refresh unavailable: last verified catalogue remains visible with verification metadata.

## Portability

- User-owned data must be exportable in a documented, non-proprietary format before destructive account deletion is considered complete.
- Prefer SQL/Postgres primitives over provider-only database features where the value is equivalent.
- Storage paths and metadata belong in our database; object storage is replaceable.
- Scheduled jobs must be callable through authenticated HTTP contracts rather than depending exclusively on one scheduler implementation.

## Definition of done

A backend change is done when code, database migration, tests, degraded behavior and rollback implications are all accounted for. A feature that only works on the happy path is not product-ready.
