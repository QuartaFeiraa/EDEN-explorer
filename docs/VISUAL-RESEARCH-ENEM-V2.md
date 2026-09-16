# RUMO ENEM V2 — Visual research notes

Research date: 2026-09-15.

## Internal EDEN reference

EDEN NEXO is the primary internal benchmark for product density and shell discipline:
- compact persistent sidebar;
- grouped navigation;
- compact header/context bar;
- 12–14 px working gaps;
- cards/panels sized by useful content;
- information hierarchy before decoration;
- discreet EDEN family signature.

RUMO must inherit these principles without copying NEXO's product content or palette.

## External references

### 21st.dev
Primary external reference.
- Dashboard guidance: shell + sidebar/header + content region, with density matched to the task rather than screenshot aesthetics.
- Sidebar collections: responsive/collapsible shell patterns, grouped navigation and mobile drawer behavior.
- Bloom/Limelight patterns: useful only as restrained accent references for active navigation and selected actions.

References:
- https://docs.21st.dev/blog/react-dashboard-components
- https://21st.dev/community/components/explore/sidebar-ui
- https://21st.dev/community/components/explore/responsive-sidebar

### Cult UI
Use interaction ideas, not framework dependencies. RUMO is vanilla HTML/CSS/JS.
- Direction-aware tabs: inspiration for clear section transitions.
- Expandable toolbar: inspiration for compact multi-step workflows where they are actually needed.
- Side panel: inspiration for secondary detail surfaces without abandoning the current context.

References:
- https://www.cult-ui.com/docs/components/direction-aware-tabs
- https://www.cult-ui.com/docs/components/toolbar-expandable
- https://www.cult-ui.com/docs/components/side-panel

## Decisions applied

1. Reduce the application content width from the broad 1320/1440 presentation to ~1180 px.
2. Reduce sidebar width and navigation vertical rhythm.
3. Split navigation into semantic groups without adding extra routes.
4. Restore official EDEN symbol + lowercase `eden` in the sidebar footer.
5. Replace the full-width ENEM area list with a compact two-column curriculum surface on desktop.
6. Move cognitive axes into a supporting side panel.
7. Add a compact real-data ENEM snapshot: question count, mapped topics, attempts and current accuracy.
8. Keep gradients concentrated in active state, primary action and restrained accents.
9. Preserve Iconoir as the single icon language.
10. Validate 1366 px desktop plus 390 px and 360 px mobile with browser smoke tests.
