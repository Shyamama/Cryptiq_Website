// Submits every indexable URL to IndexNow (https://www.indexnow.org) so
// participating engines — Bing, Yandex, Seznam, Naver — recrawl promptly.
// Google does not consume IndexNow; submit the sitemap in Search Console
// instead (docs/SEO.md). Run after a production deploy:
//
//   npm run seo:submit            # submit
//   npm run seo:submit -- --dry-run   # print payload without sending
//
// Ownership proof: public/<key>.txt is deployed at the site root and its
// content equals the key, per the IndexNow spec.
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../sitemap.config.mjs'
import { collectRoutes } from './lib/routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const siteUrl = config.siteUrl.replace(/\/+$/, '')

const keyFile = (await readdir(publicDir)).find((f) => /^[a-f0-9]{16,128}\.txt$/i.test(f))
if (!keyFile) {
  throw new Error('submit-indexnow: no IndexNow key file (hex-named .txt) found in public/')
}
const key = (await readFile(path.join(publicDir, keyFile), 'utf8')).trim()
if (key !== path.basename(keyFile, '.txt')) {
  throw new Error(`submit-indexnow: ${keyFile} content must equal its basename`)
}

const routes = await collectRoutes()
const payload = {
  host: new URL(siteUrl).host,
  key,
  keyLocation: `${siteUrl}/${keyFile}`,
  urlList: routes.map((r) => siteUrl + r.loc),
}

if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify(payload, null, 2))
  process.exit(0)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
})

console.log(
  `submit-indexnow: HTTP ${res.status} ${res.statusText} — submitted ${payload.urlList.length} URLs for ${payload.host}`,
)
if (!res.ok) {
  console.error(await res.text())
  process.exit(1)
}
