# AGENTS.md

## Project context

Marketing site for CryptiQ (post-quantum cryptographic migration). Vite + React 18 SPA, Tailwind + shadcn/ui, deployed on Vercel at https://www.cryp-iq.com. No backend and no auth — the only network call is the contact form POST to Web3Forms. Start with `README.md` for setup and scripts.

## Key files

- `src/AppRoutes.jsx`: route tree (`/`, `/about`, `/glossary`, `/glossary/:slug`, catch-all 404), shared by the client router (`src/App.jsx`) and the SSG entry (`src/entry-ssg.jsx`). Add static routes here AND to `sitemap.config.mjs`.
- `src/pages/` + `src/components/landing/`, `src/components/about/`: page content.
- `src/components/landing/LatticeCanvas.jsx`: canvas background animation. Scroll progress reaches it via a React ref (`progressRef`), NOT state — keep scroll handling out of React re-renders.
- `src/components/ui/`: shadcn/ui library. Kept intentionally even where unused — don't delete, don't hand-edit generated components.
- `content/glossary/*.json`: glossary entries (one file per term) rendered by `src/pages/GlossaryTerm.jsx`. Must validate against `content/schema/glossary-term.schema.json` — `npm run validate:content` runs automatically before builds. `content/glossary-plan.json` is the canonical taxonomy + editorial briefs; add a term there first.
- `scripts/prerender.mjs`: postbuild SSG — writes `dist/glossary/**/index.html` with per-page head + JSON-LD. `src/main.jsx` hydrates prerendered pages. Keep glossary pages free of framer-motion entrance animations (SSR markup must match first client render, and content must not be hidden at load).
- `sitemap.config.mjs`: static SPA routes for `sitemap.xml`/`robots.txt`; glossary routes derive from `content/glossary/` automatically (`scripts/lib/routes.mjs`).
- `content/llms-base.md`: base prose for generated `dist/llms.txt` + `dist/llms-full.txt`.
- `index.html`: SEO/OG meta between `<!-- seo:start -->`/`<!-- seo:end -->` markers is replaced per-page by the prerenderer — don't remove the markers. Canonical is set per-route by `src/components/CanonicalUrl.jsx`; title/description per-route by `src/components/PageMeta.jsx`.
- `docs/SEO.md`: search/indexing runbook (GSC, Bing, IndexNow via `npm run seo:submit`).

## Conventions

- Dark theme only (`#080808` background); monospace HUD aesthetic — match `font-mono` + `text-foreground/NN` opacity idiom of neighboring components.
- Accent colors come from the CSS tokens at the top of `src/index.css` (`--accent-rgb` gold, `--accent-threat-rgb` crimson, `--accent-glow-rgb`, `--selection-rgb`), exposed as Tailwind `brand`/`threat` utilities. Never hardcode an accent hue in a component; to retheme the site, change only the token values.
- No em-dashes (—) in user-facing copy, including glossary JSON, meta descriptions, and `content/llms-base.md`. Rewrite with commas, colons, parentheses, or separate sentences. Title-separator dashes in `<title>` patterns (`Page — CryptiQ`) are the one exception.
- Algorithm naming: use final NIST names (ML-KEM, ML-DSA, SLH-DSA), never CRYSTALS-Kyber/Dilithium/SPHINCS+ as primary names (historical mentions and aliases are fine; the content validator enforces this for glossary entries).
- Respect `prefers-reduced-motion` in any new animation (see `MotionConfig` in `App.jsx` and the static-frame path in `LatticeCanvas.jsx`).
- Before finishing: `npm run build && npm run lint && npm run typecheck` must all pass.
