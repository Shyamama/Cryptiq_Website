// Generates dist/sitemap.xml and dist/robots.txt from sitemap.config.mjs.
// Runs as the npm postbuild step. Writes into dist/ because Vite copies
// public/ during the build — anything written to public/ afterwards would
// never reach the deploy artifact.
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../sitemap.config.mjs'

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')

if (!existsSync(distDir)) {
  console.error(`generate-seo: ${distDir} not found — run \`vite build\` first.`)
  process.exit(1)
}

const siteUrl = config.siteUrl.replace(/\/+$/, '')
const lastmod = new Date().toISOString()

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[c])

const urlEntry = (route) => {
  const fields = [
    `    <loc>${escapeXml(siteUrl + route.loc)}</loc>`,
    config.autoLastmod && `    <lastmod>${lastmod}</lastmod>`,
    route.changefreq && `    <changefreq>${route.changefreq}</changefreq>`,
    route.priority != null && `    <priority>${route.priority.toFixed(1)}</priority>`,
  ].filter(Boolean)
  return `  <url>\n${fields.join('\n')}\n  </url>`
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...config.routes.map(urlEntry),
  '</urlset>',
  '',
].join('\n')

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

const robots = [
  ...config.robotsTxtOptions.policies.map(policyBlock),
  `# Host\nHost: ${siteUrl}`,
  `# Sitemaps\nSitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n\n')

await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)
await writeFile(path.join(distDir, 'robots.txt'), robots)
console.log(`generate-seo: wrote sitemap.xml (${config.routes.length} urls) and robots.txt to dist/`)
