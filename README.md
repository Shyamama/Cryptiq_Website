# CryptiQ Website

Marketing site for CryptiQ, a post-quantum cryptographic migration platform: cryptographic asset inventory, CBOM risk reporting, and migration to the NIST post-quantum standards (ML-KEM, ML-DSA, SLH-DSA).

Live at [www.cryp-iq.com](https://www.cryp-iq.com), deployed on Vercel.

## Stack

- [Vite](https://vitejs.dev) + React 18 (JavaScript, single-page app with build-time prerendering for content routes)
- react-router-dom (`/`, `/about`, `/glossary`, `/glossary/:slug`)
- Tailwind CSS with the shadcn/ui component library in `src/components/ui/`
- framer-motion for reveal animations; a hand-rolled 2D canvas lattice background (`src/components/landing/LatticeCanvas.jsx`)
- Contact form posts to [Web3Forms](https://web3forms.com)
- Glossary content lives as JSON in `content/glossary/`, validated against a JSON Schema and rendered by a shared template (`src/pages/GlossaryTerm.jsx`)

## Setup

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Validates content (prebuild), builds to `dist/`, prerenders glossary pages, generates `sitemap.xml` / `robots.txt` / `llms.txt` / `llms-full.txt` (postbuild) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check over JS (`jsconfig.json`) |
| `npm run validate:content` | Validate `content/glossary/` against the schema without building |
| `npm run seo:submit` | Submit all URLs to IndexNow (run after a production deploy) |

## SEO

The glossary is the programmatic-SEO surface: each entry is a JSON file in `content/glossary/` conforming to `content/schema/glossary-term.schema.json`, rendered by a shared React template, and **prerendered to static HTML** at build time (`scripts/prerender.mjs`) with per-page meta and JSON-LD — crawlers never depend on JavaScript. The sitemap, `llms.txt`, and IndexNow payload all derive from the content directory automatically; static SPA routes are listed in `sitemap.config.mjs`. Per-route canonicals are set by `src/components/CanonicalUrl.jsx` client-side and baked into the prerendered head.

See **[docs/SEO.md](docs/SEO.md)** for the full runbook: adding an entry, Google Search Console / Bing Webmaster setup, IndexNow submission, and the post-deploy checklist.

## Deploy

Vercel builds with `npm run build` and serves `dist/`. `vercel.json` provides the SPA fallback rewrite so deep links like `/about` resolve. The primary domain is `https://www.cryp-iq.com`; override the sitemap base URL with a `SITE_URL` env var if the domain changes.
