# EDEN RUMO — Design Contract

This file is the visual/product source of truth for RUMO.

## Product identity

RUMO is primarily a **preparation platform for ENEM**, with important concursos as the second major axis. Planning remains a core engine, but it serves preparation rather than defining the product.

The product must feel intelligent, calm, reliable, mature and useful before decorative. Avoid generic task-manager, habit-tracker and generic SaaS-dashboard language.

## Primary hierarchy

The interface must answer quickly:
1. What should I study now?
2. What do I still need to master for the ENEM or my selected exam?
3. What am I getting wrong?
4. What should return as revision?
5. Am I improving?

Primary navigation:
`Hoje · ENEM · Questões · Redação · Simulados · Concursos · Revisões`

ENEM is the dominant product entry. Concursos remains a first-class product area, not a hidden legacy feature.

## ENEM experience

- Use the official Inep ENEM matrix as the structural reference.
- Represent the four objective-test areas plus Redação clearly.
- Question practice must show the answer/explanation only after submission.
- Simulations must withhold feedback until completion.
- Redação must support themes, drafting and the five competencies without pretending to provide an official score.
- Real performance data is preferred to decorative metrics.
- Weaknesses, errors and due reviews should feed future study direction.

## Visual direction — NEXO density, RUMO identity

RUMO inherits the **product discipline** that worked in EDEN NEXO, not NEXO's exact colors or content:
- persistent desktop application shell;
- compact sidebar with grouped navigation;
- compact top context/header;
- useful information above decorative space;
- 12–14 px structural gaps for dense working surfaces;
- panels sized by content instead of landing-page whitespace;
- real metrics, short labels and clear next actions;
- responsive drawer on mobile instead of duplicating navigation systems.

The ENEM overview must behave like a working product dashboard, not a marketing hero. The four objective areas and Redação should be scan-friendly and compact; cognitive axes are supporting information, not the dominant visual block.

## Gradient and motion

21st.dev is the primary external visual reference. The Bloom Field / Limelight ideas may inform RUMO, but they are deliberately restrained:
- gradients belong to primary action, selected navigation, small accent lines and controlled hero emphasis;
- no full-screen glow clouds, dot-grid backgrounds, purple/black AI styling or ornamental effects without product purpose;
- motion must use cheap compositor-friendly properties where practical and respect `prefers-reduced-motion`.

## Icon system

RUMO uses **Iconoir** as the approved product icon language:
- consistent stroke geometry;
- embedded SVGs rather than a runtime icon CDN;
- no emoji as UI icons;
- no mixed icon families;
- avoid Lucide as the default visual language for RUMO.

Third-party icon attribution is recorded in `THIRD_PARTY_NOTICES.md`.

## EDEN family signature

The EDEN family mark is mandatory but discreet:
- use the approved EDEN symbol plus lowercase `eden`;
- `eden` uses Plus Jakarta Sans;
- keep it in a stable institutional location such as the sidebar footer or product information area;
- never leave `EDEN` as loose microtext or place the family signature where it competes with RUMO;
- legal links live under the family signature with subdued styling.

## Typography and spacing

- RUMO working surfaces use Plus Jakarta Sans with system fallbacks.
- Desktop application base text targets **15–16 px**. Navigation targets about **14 px**. Forms and long reading/editing surfaces target **15–16 px**.
- Essential text must not use microtype. Text below 12 px is reserved only for short metadata/kickers and cannot carry instructions, choices, errors or primary information.
- Question alternatives, selection cards and account forms must remain comfortably readable on a 1366/1440 desktop without browser zoom.
- Desktop content should normally stay around 1180–1220 px rather than stretching across ultrawide screens.
- Prefer two-column information density when it improves scanning; collapse cleanly to one column on mobile.
- Avoid empty vertical bands created only to make a screen feel "premium".

## Selection surfaces

Cards that represent a real choice must look interactive and intentional:
- clear border and hover/focus state;
- selected state uses restrained accent tint and border rather than glow;
- title around 14–16 px and supporting copy around 12.5–14 px;
- no arbitrary oversized cards, giant shadows or decorative icons that do not help the decision;
- selection behavior must also be understandable by keyboard/focus, not only hover.

## Account experience

A RUMO account is a first-class product surface, not a tiny utility:
- guest state must clearly expose **Entrar / Criar conta**;
- signed-in state displays the user identity and a clear account entry point;
- login/signup fields use readable desktop sizing and proper autocomplete semantics;
- signup distinguishes new-password from current-password and uses a stronger local minimum password length;
- explain that the account synchronizes plan/progress across devices without implying more than the backend actually stores;
- account settings, sync and logout actions use text labels instead of emoji UI;
- guest/local mode may remain useful, but account benefits and persistence must be clear.

## Mobile / PWA

RUMO must be fully usable on phone and as an installed PWA:
- no horizontal overflow at 360 px and above;
- comfortable touch targets;
- no hover-only actions;
- question answering and essay writing must work on small screens;
- private API/user data is never cached by the service worker;
- new releases must invalidate stale shell/code caches;
- decorative motion must have a reduced-motion fallback.

## States

Important surfaces require intentional loading, empty, degraded, error, success and guest/local states where supported. A failed optional source must not break the rest of RUMO.

## Anti-vibe guardrails

Avoid generic bento layouts, arbitrary three-card rows, excessive shadows/rounding, rainbow statuses, emoji product iconography, decorative terminals, fake charts, fake testimonials, fabricated urgency, huge marketing typography inside the app and visual effects without product purpose.

## Change ownership

Security/backend work must preserve the approved product language. Visual changes require explicit review. 21st.dev is the first external reference, followed by Cult UI, Origin UI and Skiper UI; references are patterns to adapt, not templates to paste blindly.
