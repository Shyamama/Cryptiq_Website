# AGENTS.md

## Project context

Marketing site for CryptiQ (post-quantum cryptographic migration). Vite + React 18 SPA, Tailwind + shadcn/ui, deployed on Vercel at https://www.cryp-iq.com. No backend and no auth — the only network call is the contact form POST to Web3Forms. Start with `README.md` for setup and scripts.

## Key files

- `src/App.jsx`: routes (`/`, `/about`, catch-all 404).
- `src/pages/` + `src/components/landing/`, `src/components/about/`: page content.
- `src/components/landing/LatticeCanvas.jsx`: canvas background animation. Scroll progress reaches it via a React ref (`progressRef`), NOT state — keep scroll handling out of React re-renders.
- `src/components/ui/`: shadcn/ui library. Kept intentionally even where unused — don't delete, don't hand-edit generated components.
- `sitemap.config.mjs`: route list for generated `sitemap.xml`/`robots.txt`. Must be updated whenever a route is added to `App.jsx`.
- `public/llms.txt`: static site description for AI crawlers.
- `index.html`: SEO/OG meta. Canonical is set per-route by `src/components/CanonicalUrl.jsx`.

## Conventions

- Dark theme only (`#080808` background); monospace HUD aesthetic — match `font-mono` + `text-foreground/NN` opacity idiom of neighboring components.
- Algorithm naming: use final NIST names (ML-KEM, ML-DSA, SLH-DSA), never CRYSTALS-Kyber/Dilithium/SPHINCS+.
- Respect `prefers-reduced-motion` in any new animation (see `MotionConfig` in `App.jsx` and the static-frame path in `LatticeCanvas.jsx`).
- Before finishing: `npm run build && npm run lint && npm run typecheck` must all pass.
