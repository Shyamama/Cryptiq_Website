// Sitemap + robots.txt config, mirroring next-sitemap's config shape
// (https://github.com/iamvishnusankar/next-sitemap). Consumed via
// scripts/lib/routes.mjs by the postbuild SEO scripts.
export default {
  siteUrl: process.env.SITE_URL || 'https://www.cryp-iq.com',
  autoLastmod: true,
  // Static routes only — keep in sync with src/AppRoutes.jsx. The /glossary
  // index and /glossary/* term routes are derived automatically from
  // content/glossary/ by scripts/lib/routes.mjs.
  routes: [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
    { loc: '/download', changefreq: 'monthly', priority: 0.9 },
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
