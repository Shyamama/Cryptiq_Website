// Build-time loader for the glossary content collection. Every JSON file in
// content/glossary/ conforms to content/schema/glossary-term.schema.json
// (enforced by scripts/validate-content.mjs in the prebuild step), so pages
// can render fields without defensive checks.
//
// Lives in src/lib rather than src/pages so it stays outside the jsconfig
// typecheck scope: import.meta.glob comes from Vite's client types, which the
// typecheck config does not load for page files.
/**
 * @typedef {Object} GlossaryEntry
 * @property {string} slug
 * @property {string} term
 * @property {string} [acronym]
 * @property {string[]} [aliases]
 * @property {'threat'|'standard'|'algorithm'|'foundation'|'at-risk'|'migration'} category
 * @property {string} shortDefinition
 * @property {string[]} definition
 * @property {{heading: string, paragraphs: string[], bullets?: string[]}[]} sections
 * @property {{question: string, answer: string}[]} faq
 * @property {string[]} related
 * @property {{title: string, url: string, publisher?: string}[]} sources
 * @property {string} cryptiqAngle
 * @property {string} datePublished
 * @property {string} dateModified
 */

const modules = import.meta.glob('../../content/glossary/*.json', {
  eager: true,
  import: 'default',
})

// Display order for the /glossary index — threat first, practice last.
export const CATEGORIES = [
  { id: 'threat', label: 'THE QUANTUM THREAT' },
  { id: 'standard', label: 'STANDARDS & MANDATES' },
  { id: 'algorithm', label: 'ALGORITHMS' },
  { id: 'foundation', label: 'MATHEMATICAL FOUNDATIONS' },
  { id: 'at-risk', label: 'AT-RISK CRYPTOGRAPHY' },
  { id: 'migration', label: 'MIGRATION PRACTICE' },
]

export const glossaryTerms = /** @type {GlossaryEntry[]} */ (
  Object.values(modules)
).sort((a, b) => a.term.localeCompare(b.term))

export const getTerm = (slug) => glossaryTerms.find((t) => t.slug === slug)

export const categoryLabel = (id) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id.toUpperCase()
