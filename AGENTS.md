# EDEN RUMO — Engineering Contract

These rules apply to every automated or human change in this repository.

## Priority order

1. Seguro
2. Bom
3. Bonito
4. Barato

A feature that violates a higher priority does not ship because it improves a lower one.

## Protected baseline

- Golden functional baseline: RUMO v9 stable.
- Current hardening line: `rumo-v9-product-hardening`.
- Do not merge the divergent post-v9 `master` history blindly.
- Preserve working behavior first; add changes in small, reversible commits.

## Architecture

- Cloud only. Do not require the user's PC to stay online.
- Free/open-source first and no vendor lock-in where practical.
- Supabase is the authenticated system of record for the current product.
- Browser code is untrusted.
- Vercel functions are trusted adapters only when privileged work is necessary.
- Keep guest/local-first usefulness where it already exists.
- Provider-specific integrations must sit behind adapters so they can be replaced.

Read `ARCHITECTURE.md`, `SECURITY.md`, `PRIVACY.md` and `DESIGN.md` before changing cross-cutting behavior.

## Security requirements

- Never commit server secrets, service-role keys, tokens or credentials.
- Publishable Supabase keys may exist in the browser; secret/service-role keys may not.
- Any public-schema table exposed to the Data API needs intentional grants and RLS.
- New write policies must enforce ownership, not only `TO authenticated`.
- Dynamic HTML, URLs and CSS tokens originating outside trusted code must be escaped/validated/allowlisted.
- Destructive or privileged endpoints must validate method, origin, authentication, active session where relevant, bounded input and failure behavior.
- `SECURITY DEFINER` functions require an empty/fixed `search_path`, fully-qualified references and explicit EXECUTE grants.
- Do not cache `/api/`, Supabase responses, auth tokens or user-specific data in the service worker.
- Pin dependencies used at runtime or CI.

## Database changes

- Every production DDL change must have a migration tracked in `supabase/migrations/`.
- Check for existing data that would violate new constraints before applying them.
- Run Supabase Security Advisor after DDL changes.
- Do not remove an index only because it is currently reported as unused on a young product.

## Product logic

- The adaptive plan must be deterministic enough to test and must avoid repeatedly scheduling the same high-score topic when reasonable alternatives exist.
- Due reviews and weak performance may override rotation because they represent genuine learning priority.
- Plan generation must be idempotent across retries/tabs/devices.
- User-entered or PDF-derived content is untrusted input.
- AI output, if reintroduced later, is untrusted input and cannot directly mutate catalog/state without deterministic validation.

## Cost controls

The stable product must remain useful at R$0 recurring cost. Do not activate paid AI, OCR, push infrastructure, billing or third-party APIs as a hidden dependency. Any paid feature needs an explicit cost/failure analysis first.

## Release gate

A change is not done until:
- JavaScript syntax checks pass;
- hardening contracts pass;
- Chromium desktop/mobile smoke tests pass;
- degraded Supabase behavior remains usable;
- security advisor has no new security lint;
- no browser secret was introduced;
- visual behavior remains unchanged unless the visual change was explicitly requested.
