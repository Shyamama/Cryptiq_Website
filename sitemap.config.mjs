// Sitemap + robots.txt config, mirroring next-sitemap's config shape
// (https://github.com/iamvishnusankar/next-sitemap). Consumed by
// scripts/generate-seo.mjs in the postbuild step.
export default {
  siteUrl: process.env.SITE_URL || 'https://www.cryp-iq.com',
  autoLastmod: true,
  // Single source of truth for indexable routes — keep in sync with src/App.jsx.
  routes: [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
