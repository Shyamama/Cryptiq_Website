# CryptiQ Website

Marketing site for CryptiQ, a post-quantum cryptographic migration platform: cryptographic asset inventory, CBOM risk reporting, and migration to the NIST post-quantum standards (ML-KEM, ML-DSA, SLH-DSA).

Live at [www.cryp-iq.com](https://www.cryp-iq.com), deployed on Vercel.

## Stack

- [Vite](https://vitejs.dev) + React 18 (JavaScript, single-page app)
- react-router-dom (`/` and `/about`)
- Tailwind CSS with the shadcn/ui component library in `src/components/ui/`
- framer-motion for reveal animations; a hand-rolled 2D canvas lattice background (`src/components/landing/LatticeCanvas.jsx`)
- Contact form posts to [Web3Forms](https://web3forms.com)

## Setup

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/`, then generates `sitemap.xml` + `robots.txt` (postbuild) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check over JS (`jsconfig.json`) |

## SEO files

`scripts/generate-seo.mjs` (run automatically after `npm run build`) writes `dist/sitemap.xml` and `dist/robots.txt` from **`sitemap.config.mjs`** — when adding a route in `src/App.jsx`, add it to that config too. `public/llms.txt` is a static description of the site for AI crawlers. Per-route canonical URLs are set by `src/components/CanonicalUrl.jsx`.

## Deploy

Vercel builds with `npm run build` and serves `dist/`. `vercel.json` provides the SPA fallback rewrite so deep links like `/about` resolve. The primary domain is `https://www.cryp-iq.com`; override the sitemap base URL with a `SITE_URL` env var if the domain changes.
