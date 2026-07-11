// Prerenders the glossary routes to static HTML under dist/. Vercel serves
// files before applying the SPA rewrite, so crawlers (and first paints) get
// complete markup plus per-page <head> without executing JS; the client
// bundle then hydrates the markup (src/main.jsx). Runs as the first
// postbuild step: vite build → prerender → generate-seo.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import config from '../sitemap.config.mjs'
import { loadGlossaryTerms } from './lib/routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const ssrOutDir = path.join(root, '.prerender')
const siteUrl = config.siteUrl.replace(/\/+$/, '')

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c])

// Backticks are inline-code markup for the React renderer; strip them from
// meta/JSON-LD surfaces where they'd read as literal characters.
const plain = (value) => String(value).replace(/`/g, '')

// Escape "<" so a "</script>" inside content can't terminate the JSON-LD tag.
const jsonLdScript = (graph) =>
  `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`

const termUrl = (t) => `${siteUrl}/glossary/${t.slug}`

const breadcrumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item,
  })),
})

const termGraph = (t) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'DefinedTerm',
      '@id': `${termUrl(t)}#term`,
      name: t.term,
      ...(t.aliases?.length ? { alternateName: t.aliases } : {}),
      description: plain(t.shortDefinition),
      url: termUrl(t),
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'CryptiQ Post-Quantum Glossary',
        url: `${siteUrl}/glossary`,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: t.faq.map((f) => ({
        '@type': 'Question',
        name: plain(f.question),
        acceptedAnswer: { '@type': 'Answer', text: plain(f.answer) },
      })),
    },
    breadcrumb([
      ['Home', `${siteUrl}/`],
      ['Glossary', `${siteUrl}/glossary`],
      [t.term, termUrl(t)],
    ]),
  ],
})

const indexGraph = (terms) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'DefinedTermSet',
      '@id': `${siteUrl}/glossary#set`,
      name: 'CryptiQ Post-Quantum Glossary',
      url: `${siteUrl}/glossary`,
      hasDefinedTerm: terms.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.term,
        url: termUrl(t),
      })),
    },
    breadcrumb([
      ['Home', `${siteUrl}/`],
      ['Glossary', `${siteUrl}/glossary`],
    ]),
  ],
})

const headBlock = ({ title, description, url, ogType, graph }) =>
  [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    jsonLdScript(graph),
  ].join('\n    ')

// 1. Bundle the SSG entry for Node. Uses the same vite.config.js as the
//    client build, so aliases and JSX behave identically.
await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-ssg.jsx', outDir: '.prerender', emptyOutDir: true },
})
const { render } = await import(pathToFileURL(path.join(ssrOutDir, 'entry-ssg.js')).href)

const shell = await readFile(path.join(distDir, 'index.html'), 'utf8')
if (!/<!-- seo:start[\s\S]*?seo:end -->/.test(shell)) {
  throw new Error('prerender: seo:start/seo:end markers missing from built index.html')
}
if (!shell.includes('<div id="root"></div>')) {
  throw new Error('prerender: empty #root mount point missing from built index.html')
}

const terms = await loadGlossaryTerms()
const pages = [
  {
    route: '/glossary',
    head: headBlock({
      title: 'Post-Quantum Cryptography Glossary — CryptiQ',
      description:
        'Plain-language reference on post-quantum cryptography: NIST standards like ML-KEM and ML-DSA, quantum threats like harvest-now-decrypt-later, and migration practice.',
      url: `${siteUrl}/glossary`,
      ogType: 'website',
      graph: indexGraph(terms),
    }),
  },
  ...terms.map((t) => ({
    route: `/glossary/${t.slug}`,
    head: headBlock({
      title: `${t.term} — CryptiQ Glossary`,
      description: plain(t.shortDefinition),
      url: termUrl(t),
      ogType: 'article',
      graph: termGraph(t),
    }),
  })),
]

// 2. Render each route into the built shell. Replacement callbacks, not
//    strings — content containing "$&"-style sequences must land verbatim.
for (const page of pages) {
  const appHtml = render(page.route)
  if (!appHtml || appHtml.length < 500) {
    throw new Error(`prerender: suspiciously empty render for ${page.route}`)
  }
  const html = shell
    .replace(/<!-- seo:start[\s\S]*?seo:end -->/, () => page.head)
    .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
  const outDir = path.join(distDir, page.route.slice(1))
  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'index.html'), html)
}

await rm(ssrOutDir, { recursive: true, force: true })
console.log(`prerender: wrote ${pages.length} static pages to dist/glossary/`)
