# EDEN RUMO — Design Contract

This file is the visual/product design source of truth for RUMO. It records approved direction so implementation changes do not slowly turn the product into a generic dashboard.

## Product identity

RUMO is a study-direction product for people preparing for concursos, university goals and certifications. Its job is to turn a large objective into a clear next step, preserve consistency and make progress legible.

The product must feel:
- intelligent, calm and reliable;
- mature rather than childish;
- premium without visual excess;
- focused on direction, progress, route and milestones;
- useful before it is decorative.

Avoid turning RUMO into a generic task manager, habit tracker or noisy gamified app.

## Visual hierarchy

The screen should answer these questions quickly:
1. What is my current objective?
2. What should I do now?
3. What is weakening and needs to return?
4. Am I progressing at the pace I planned?

The current v9 shell is the protected visual baseline until a new design is explicitly approved. Backend or security work must not silently change layout, spacing, typography, colors, navigation or interaction patterns.

## Brand

- Primary product name: `RUMO`.
- EDEN appears as a discreet family signature, not as the dominant product name.
- Prefer route/progress metaphors over generic productivity metaphors.
- Do not add fake testimonials, fake activity, fake urgency or fabricated social proof.

## Anti-vibecoding rules

Do not introduce visual patterns simply because they are fashionable or easy to generate. In particular avoid:
- aggressive gradients and decorative glow/orbs;
- generic bento dashboards;
- unnecessary card grids;
- excessive rounded containers and shadows;
- rainbow status colors;
- emoji as product iconography;
- terminal/code-window decoration unrelated to the task;
- microtext that harms mobile readability;
- novelty animation that does not explain state or action;
- fake charts or placeholder metrics presented as real data.

Current legacy typography is an implementation detail, not a permanent design decision. Any typography redesign must be reviewed as a visual change rather than being slipped into engineering work.

## Mobile / PWA

RUMO must remain fully usable on a phone. Minimum expectations:
- no horizontal overflow;
- touch targets remain comfortable;
- primary actions do not depend on hover;
- modals remain operable on small screens;
- offline shell does not expose or cache private API responses;
- the installed PWA must update without leaving stale application code behind.

## States

Every important surface should have intentional states for:
- loading;
- empty data;
- degraded network/backend;
- error;
- success;
- guest/local mode when supported.

A broken data source must not make the whole application unusable.

## Ownership of changes

Visual changes require explicit design review. Engineering may improve semantics, accessibility, security, performance and state handling without changing the approved visual language.

References for future visual work should prioritize the established EDEN reference set (Cult UI, OriginKit and Skiper UI), but references are inspiration, not permission to copy incompatible patterns.
