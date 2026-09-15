# EDEN RUMO — Engineering Contract

These rules apply to every automated or human change in this repository.

## Priority order

1. Seguro
2. Bom
3. Bonito
4. Barato

A feature that violates a higher priority does not ship because it improves a lower one.

## Active line

- Golden historical baseline: RUMO v9 stable.
- Audited parent: `rumo-v9-product-hardening` at `e34e8d6`.
- Active product line: `rumo-enem-v1`.
- ENEM is the primary product axis; important concursos is the second.
- Do not blindly merge the divergent post-v9 `master` history.
- Preserve reversible commits and a working deploy at every release gate.

## Architecture

- Cloud only; never require a home PC/server.
- Free/open-source first and avoid provider lock-in where practical.
- Supabase is the authenticated system of record.
- Browser code is untrusted.
- Privileged answer/solution access stays server-side.
- Guest mode may use local state, but authenticated history belongs in Supabase.
- Heavy immutable source files must not be stuffed into Postgres when a static/object reference is enough.

Read `ARCHITECTURE.md`, `SECURITY.md`, `PRIVACY.md` and `DESIGN.md` before cross-cutting changes.

## ENEM content rules

- Structural taxonomy must follow official Inep references where applicable.
- Never label an original RUMO question as an official ENEM question.
- Official/adapted content must retain source, year and provenance before publication.
- Browser-readable question rows never include the answer key.
- Solutions stay in a non-client-readable table and are returned only after submission through the answer service.
- Every published question needs a deterministic answer and explanation.
- AI-generated content, if introduced later, must remain draft/unverified until deterministic or human validation.
- Simulations do not reveal per-question feedback before completion.
- Redação tools must not present an unofficial automated score as an official ENEM grade.

## Security requirements

- Never commit secrets, service-role keys, tokens or credentials.
- Publishable Supabase keys may exist in the browser; secret/service-role keys may not.
- Every exposed public-schema table needs intentional grants and RLS.
- User writes must enforce ownership.
- Dynamic HTML, URLs and CSS tokens from external/user data must be escaped or allowlisted.
- Privileged endpoints/functions require bounded input and fail-closed behavior.
- Service-role access belongs only in trusted server runtimes such as Supabase Edge Functions or Vercel server functions.
- Do not cache `/api/`, Supabase responses, auth tokens or user-specific data in the service worker.
- Pin runtime/CI dependencies where practical.

## Database changes

- Every production DDL change must have a matching file in `supabase/migrations/`.
- Check existing data before adding constraints.
- Run Supabase Security Advisor after DDL changes and do not knowingly ship new warnings without documented justification.
- Do not remove indexes solely because a young database reports them unused.

## Learning engine

- The adaptive plan must avoid repeatedly scheduling the same topic when useful alternatives exist.
- Due reviews and weak performance may override rotation.
- Plan generation remains idempotent across retries/tabs/devices.
- ENEM attempts and future diagnostic data should feed study direction rather than become decorative analytics.

## Cost controls

The stable product must remain useful at R$0 recurring cost. Do not silently activate paid AI, OCR, push, billing or third-party APIs. Any paid feature needs explicit cost/failure analysis first.

## Release gate

A change is not done until:
- JavaScript syntax/contracts pass;
- desktop/mobile Chromium smoke tests pass;
- degraded backend behavior remains usable;
- Supabase Security Advisor has no security lint;
- no browser secret was introduced;
- PWA cache version is advanced when application code changes;
- visual changes match the explicitly approved ENEM direction.
