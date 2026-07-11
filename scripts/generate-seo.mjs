// Generates dist/sitemap.xml, dist/robots.txt, dist/llms.txt, and
// dist/llms-full.txt. Static routes come from sitemap.config.mjs; glossary
// routes are derived from content/glossary/ (scripts/lib/routes.mjs). Runs
// as the last postbuild step. Writes into dist/ because Vite copies public/
// during the build — anything written to public/ afterwards would never
// reach the deploy artifact.
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../sitemap.config.mjs'
import { collectRoutes, loadGlossaryTerms } from './lib/routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

if (!existsSync(distDir)) {
  console.error(`generate-seo: ${distDir} not found — run \`vite build\` first.`)
  process.exit(1)
}

const siteUrl = config.siteUrl.replace(/\/+$/, '')
const buildLastmod = new Date().toISOString()

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[c])

const urlEntry = (route) => {
  // Content routes carry a real dateModified; the SPA routes fall back to
  // build time when autoLastmod is on (next-sitemap's behavior).
  const lastmod = route.lastmod ?? (config.autoLastmod ? buildLastmod : null)
  const fields = [
    `    <loc>${escapeXml(siteUrl + route.loc)}</loc>`,
    lastmod && `    <lastmod>${lastmod}</lastmod>`,
    route.changefreq && `    <changefreq>${route.changefreq}</changefreq>`,
    route.priority != null && `    <priority>${route.priority.toFixed(1)}</priority>`,
  ].filter(Boolean)
  return `  <url>\n${fields.join('\n')}\n  </url>`
}

const policyBlock = ({ userAgent, allow, disallow }) => {
  const rule = (directive, value) =>
    [value].flat().filter(Boolean).map((v) => `${directive}: ${v}`)
  return [
    `# ${userAgent}`,
    `User-agent: ${userAgent}`,
    ...rule('Allow', allow),
    ...rule('Disallow', disallow),
  ].join('\n')
}

const routes = await collectRoutes()
const terms = await loadGlossaryTerms()

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(urlEntry),
  '</urlset>',
  '',
].join('\n')

const robots = [
  ...config.robotsTxtOptions.policies.map(policyBlock),
  `# Host\nHost: ${siteUrl}`,
  `# Sitemaps\nSitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n\n')

// llms.txt: base prose from content/llms-base.md with the glossary section
// spliced in at the marker. llms-full.txt additionally inlines the full text
// of every entry for AI crawlers that want content, not links.
const MARKER = '<!-- glossary:insert -->'
const base = await readFile(path.join(root, 'content/llms-base.md'), 'utf8')
if (!base.includes(MARKER)) {
  throw new Error(`generate-seo: '${MARKER}' marker missing from content/llms-base.md`)
}

const termLink = (t) => `- [${t.term}](${siteUrl}/glossary/${t.slug}): ${t.shortDefinition}`

const glossaryLinks = ['## Glossary', '', ...terms.map(termLink)].join('\n')

const termFull = (t) =>
  [
    `### ${t.term}`,
    '',
    ...(t.aliases?.length ? [`Also known as: ${t.aliases.join(', ')}`, ''] : []),
    ...t.definition,
    '',
    ...t.sections.flatMap((s) => [
      `#### ${s.heading}`,
      '',
      ...s.paragraphs,
      ...(s.bullets ? ['', ...s.bullets.map((b) => `- ${b}`)] : []),
      '',
    ]),
    '#### FAQ',
    '',
    ...t.faq.flatMap((f) => [`**${f.question}**`, '', f.answer, '']),
    `Sources: ${t.sources.map((s) => `[${s.title}](${s.url})`).join(' · ')}`,
    '',
    `Read on the site: ${siteUrl}/glossary/${t.slug}`,
  ].join('\n')

const glossaryFull = [
  '## Glossary',
  '',
  `Full text of all ${terms.length} entries follows.`,
  '',
  ...terms.map(termFull),
].join('\n')

await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)
await writeFile(path.join(distDir, 'robots.txt'), robots)
await writeFile(path.join(distDir, 'llms.txt'), base.replace(MARKER, glossaryLinks))
await writeFile(path.join(distDir, 'llms-full.txt'), base.replace(MARKER, glossaryFull))
console.log(
  `generate-seo: wrote sitemap.xml (${routes.length} urls), robots.txt, llms.txt, and llms-full.txt to dist/`,
)
