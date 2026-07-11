# SEO runbook

How search visibility works on this site, and the manual steps that need a human with account access.

## What the build produces

`npm run build` runs the full pipeline:

1. **prebuild** — `scripts/validate-content.mjs`: every file in `content/glossary/` must validate against `content/schema/glossary-term.schema.json` plus referential rules (slug = filename, `related` slugs exist or are planned in `content/glossary-plan.json`, final NIST naming, no placeholders). Errors fail the build.
2. **build** — `vite build` produces the SPA in `dist/`.
3. **postbuild** — two scripts, in order:
   - `scripts/prerender.mjs`: server-renders `/glossary` and every `/glossary/<slug>` route into `dist/glossary/**/index.html` with per-page `<title>`, meta description, canonical, Open Graph tags, and JSON-LD (`DefinedTerm`, `FAQPage`, `BreadcrumbList`). Vercel serves these static files before the SPA rewrite, so crawlers get complete HTML without executing JavaScript; the client bundle hydrates them (`src/main.jsx`).
   - `scripts/generate-seo.mjs`: writes `dist/sitemap.xml` (static routes from `sitemap.config.mjs` + content routes with real `lastmod` dates), `dist/robots.txt`, `dist/llms.txt` (site summary + glossary link list, base prose in `content/llms-base.md`), and `dist/llms-full.txt` (full entry text for AI crawlers).

## Adding a glossary entry

1. Add the term to `content/glossary-plan.json` (slug, category, related graph, editorial brief).
2. Write `content/glossary/<slug>.json` conforming to the schema. Use `content/glossary/ml-kem.json` as the exemplar; verify every fact against primary sources.
3. `npm run validate:content` until clean.
4. `npm run build` — the page, sitemap entry, and llms.txt entries all derive from the content file automatically. Nothing else to wire.
5. Deploy, then `npm run seo:submit`.

## Google Search Console (manual, needs Google account)

Google does not participate in IndexNow — Search Console is the only channel.

1. Go to [search.google.com/search-console](https://search.google.com/search-console) and add a property. Prefer a **Domain property** for `cryp-iq.com` (covers www/non-www, http/https). Verification is a DNS TXT record at the domain registrar; Search Console shows the exact value.
2. Once verified: **Sitemaps → Add a new sitemap** → submit `https://www.cryp-iq.com/sitemap.xml`.
3. For the highest-value pages (`/`, `/glossary`, a few key terms), use **URL Inspection → Request Indexing** to skip the discovery queue.
4. Expect the glossary to be crawled over days-to-weeks. Watch **Pages → Why pages aren't indexed** for `Crawled - currently not indexed` (normal early on) vs real problems (`Duplicate without user-selected canonical`, soft 404s).

## Bing Webmaster Tools (manual, needs Microsoft account)

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters) and add the site. Fastest path: **Import from Google Search Console** (reuses the GSC verification, imports the sitemap).
2. If importing isn't used, verify via DNS CNAME or the meta tag, then submit `https://www.cryp-iq.com/sitemap.xml` under **Sitemaps**.
3. IndexNow submissions (below) appear under **IndexNow** in the left nav once the key is live.

## IndexNow (automated)

The ownership key file lives at `public/16997e34a20de1d49a3834c41b1b7825.txt` and deploys to the site root. After every production deploy that adds or changes pages:

```bash
npm run seo:submit              # POSTs the full URL list to api.indexnow.org
npm run seo:submit -- --dry-run # inspect the payload first
```

HTTP `200`/`202` means accepted. This notifies Bing, Yandex, Seznam, Naver, and other IndexNow participants — **not Google**. The key is not a secret (it must be publicly fetchable); committing it is correct. If it ever needs rotating, generate 32 hex chars, replace the file (content = filename without `.txt`), redeploy.

## Post-deploy checklist

```bash
curl -s https://www.cryp-iq.com/sitemap.xml | head -20        # glossary URLs present
curl -s https://www.cryp-iq.com/robots.txt                     # Sitemap: line
curl -s https://www.cryp-iq.com/llms.txt | head -30            # glossary section present
curl -s https://www.cryp-iq.com/16997e34a20de1d49a3834c41b1b7825.txt  # key resolves
curl -s https://www.cryp-iq.com/glossary/ml-kem | grep -o '<title>[^<]*</title>'  # prerendered title, not the SPA default
npm run seo:submit
```

Validate structured data with the [Rich Results Test](https://search.google.com/test/rich-results) on a term URL (expect FAQ + Breadcrumb detection) and [validator.schema.org](https://validator.schema.org/) for the full graph.
