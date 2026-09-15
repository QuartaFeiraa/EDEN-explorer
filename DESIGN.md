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

## Visual direction — ENEM v10

The v9 shell remains the engineering foundation, but the ENEM pivot explicitly authorizes controlled visual evolution.

Current approved direction:
- **21st.dev Bloom Field** as inspiration for organic bloom gradients;
- **21st.dev Limelight Nav** as inspiration for focused active-navigation light;
- gradients use the RUMO navy/cobalt/cyan palette and remain concentrated in hero, active navigation and primary action;
- no generic purple/black AI aesthetic, rainbow gradients, decorative glow clouds across every surface, dot grids or excessive glass;
- animations must use cheap compositor-friendly transforms where practical and respect `prefers-reduced-motion`;
- typography stays content-first, with large readable hierarchy and no microtext for essential information;
- lists/rows are preferred when they communicate curriculum or progression better than card grids;
- borders, radius and shadows remain restrained.

## Icon system

RUMO uses **Iconoir** as the approved product icon language for the ENEM v10 navigation:
- consistent 24x24 stroke geometry;
- embedded SVGs rather than a runtime icon CDN;
- no emoji as UI icons;
- no mixed icon families;
- avoid Lucide as the default visual language for RUMO.

Third-party icon attribution is recorded in `THIRD_PARTY_NOTICES.md`.

## Brand

- Product name: `RUMO`.
- EDEN is a discreet family signature.
- Prefer direction, route, progress, preparation and mastery metaphors.
- Do not let branding compete with study content.

## Mobile / PWA

RUMO must be fully usable on phone and as an installed PWA:
- no horizontal overflow;
- comfortable touch targets;
- no hover-only actions;
- question answering and essay writing must work on small screens;
- private API/user data is never cached by the service worker;
- new releases must invalidate stale shell/code caches;
- decorative motion must have a reduced-motion fallback.

## States

Important surfaces require intentional loading, empty, degraded, error, success and guest/local states where supported. A failed optional source must not break the rest of RUMO.

## Anti-vibe guardrails

Avoid generic bento layouts, unnecessary card grids, excessive shadows/rounding, rainbow statuses, emoji product iconography, decorative terminals, fake charts, fake testimonials, fabricated urgency and visual effects without product purpose.

## Change ownership

Security/backend work must preserve the approved product language. Future visual changes require explicit review. Current EDEN reference libraries remain inspiration, not templates to copy blindly.
