# Agent guide

Ask questions when requirements are unclear. Do not write tests unless asked.

## Project shape

This is a static GitHub Pages repo. The root `index.html` is the portfolio landing page, `styles.css` holds its shared visual language, and each project can live in its own subdirectory with a standalone `index.html`.

## Before editing

- Read `index.html`, `styles.css`, and the target project page before changing UI.
- Keep changes surgical; do not refactor unrelated markup or styles.
- Preserve the quiet maker/workshop notebook tone: practical, measured, not SaaS-like.

## Design rules

- Use the existing warm paper palette and Hanken Grotesk / Fragment Mono type system on the portfolio page.
- One accent only; keep accent usage sparse.
- Prefer concrete maker language and dimensions over marketing copy.
- Maintain semantic HTML, keyboard navigation, visible focus states, and `prefers-reduced-motion` support.

## Verification

- Run `just check` before reporting completion when `just` is available.
- If `just` is not available, run the equivalent checks from `Justfile` manually.
- Use `gh` for GitHub/repo operations when needed.
