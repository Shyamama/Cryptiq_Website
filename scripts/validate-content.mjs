// Validates every glossary entry against content/schema/glossary-term.schema.json
// plus referential rules the schema can't express (slug/filename agreement,
// related-slug existence, naming conventions). Runs as prebuild so invalid
// content can never reach a deploy.
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'content/glossary')

const schema = JSON.parse(
  await readFile(path.join(root, 'content/schema/glossary-term.schema.json'), 'utf8'),
)
const ajv = new Ajv2020({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(schema)

const files = (await readdir(contentDir)).filter((f) => f.endsWith('.json')).sort()
const entries = await Promise.all(
  files.map(async (file) => {
    try {
      return { file, term: JSON.parse(await readFile(path.join(contentDir, file), 'utf8')) }
    } catch (err) {
      return { file, parseError: err.message }
    }
  }),
)

const slugs = new Set(entries.filter((e) => e.term).map((e) => e.term.slug))
const errors = []
const warnings = []
const fail = (file, message) => errors.push(`${file}: ${message}`)

// The plan is the canonical taxonomy: related links may point at entries that
// are planned but not written yet (warning), but a slug in neither the content
// dir nor the plan is a typo (error).
const plan = JSON.parse(
  await readFile(path.join(root, 'content/glossary-plan.json'), 'utf8'),
)
const plannedSlugs = new Set(plan.terms.map((t) => t.slug))
if (plannedSlugs.size !== plan.terms.length) {
  errors.push('glossary-plan.json: duplicate slugs in plan')
}
for (const t of plan.terms) {
  for (const r of t.related ?? []) {
    if (!plannedSlugs.has(r)) {
      errors.push(`glossary-plan.json: '${t.slug}' relates to unknown slug '${r}'`)
    }
  }
}

for (const { file, term, parseError } of entries) {
  if (parseError) {
    fail(file, `invalid JSON — ${parseError}`)
    continue
  }
  if (!validate(term)) {
    for (const err of validate.errors) {
      fail(file, `${err.instancePath || '(root)'} ${err.message}`)
    }
  }
  if (term.slug !== path.basename(file, '.json')) {
    fail(file, `slug '${term.slug}' does not match filename`)
  }
  for (const r of term.related ?? []) {
    if (!slugs.has(r)) {
      if (plannedSlugs.has(r)) {
        warnings.push(`${file}: related '${r}' is planned but not written yet`)
      } else {
        fail(file, `related slug '${r}' is neither a content file nor in glossary-plan.json`)
      }
    }
  }
  if (term.related?.includes(term.slug)) {
    fail(file, 'entry lists itself in related')
  }
  // Final NIST names are the display names; historical names belong in
  // aliases and prose (see AGENTS.md conventions).
  if (/CRYSTALS|Kyber|Dilithium|SPHINCS/i.test(`${term.term} ${term.shortDefinition}`)) {
    fail(file, 'term/shortDefinition uses a pre-standardization name — use ML-KEM/ML-DSA/SLH-DSA')
  }
  if (/example\.com|\bTODO\b|PLACEHOLDER|lorem ipsum/i.test(JSON.stringify(term))) {
    fail(file, 'contains placeholder content')
  }
  if (term.datePublished && term.dateModified && term.dateModified < term.datePublished) {
    fail(file, 'dateModified precedes datePublished')
  }
}

if (errors.length > 0) {
  console.error(`validate-content: ${errors.length} error(s) across ${files.length} entries\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
if (warnings.length > 0) {
  console.warn(`validate-content: ${warnings.length} planned-but-unwritten related link(s)`)
}
console.log(`validate-content: ${files.length} entries OK`)
