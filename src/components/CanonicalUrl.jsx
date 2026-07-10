import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// One index.html serves every SPA route, so a static <link rel="canonical">
// would mark /about as a duplicate of the homepage. Keep the tag accurate
// per route instead. Base URL must match siteUrl in sitemap.config.mjs.
const SITE_URL = "https://www.cryp-iq.com";

export default function CanonicalUrl() {
  const { pathname } = useLocation();

  useEffect(() => {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = pathname === "/" ? `${SITE_URL}/` : SITE_URL + pathname;
  }, [pathname]);

  return null;
}
