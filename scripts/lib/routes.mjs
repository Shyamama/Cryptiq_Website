// Shared route derivation for the postbuild SEO scripts (prerender,
// generate-seo, submit-indexnow). Static routes come from sitemap.config.mjs;
// glossary routes are derived from content/glossary/ so adding a content file
// automatically adds its page to the sitemap, llms.txt, and IndexNow payload.
//
// This reads the JSON with fs while src/lib/content.js uses import.meta.glob —
// two loaders, one directory, because Vite globs don't exist in plain Node.
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../../sitemap.config.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const contentDir = path.join(projectRoot, 'content/glossary')

export async function loadGlossaryTerms() {
  const files = (await readdir(contentDir)).filter((f) => f.endsWith('.json')).sort()
  return Promise.all(
    files.map(async (file) => {
      const term = JSON.parse(await readFile(path.join(contentDir, file), 'utf8'))
      if (term.slug !== path.basename(file, '.json')) {
        throw new Error(`routes: slug '${term.slug}' does not match filename '${file}'`)
      }
      return term
    }),
  )
}

export async function collectRoutes() {
  const terms = await loadGlossaryTerms()
  const newest = terms.map((t) => t.dateModified).sort().at(-1)
  return [
    ...config.routes,
    { loc: '/glossary', changefreq: 'weekly', priority: 0.8, lastmod: newest },
    ...terms.map((t) => ({
      loc: `/glossary/${t.slug}`,
      changefreq: 'monthly',
      priority: 0.6,
      // Real content dates, not build time — search engines ignore lastmod
      // values that don't match reality.
      lastmod: t.dateModified,
    })),
  ]
}
