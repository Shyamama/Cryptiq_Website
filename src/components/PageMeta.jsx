import { useEffect } from "react";

// Client-side counterpart of the prerendered <head>: one index.html serves all
// SPA-navigated routes, so title/description must track the route in JS.
// Prerendered static pages (scripts/prerender.mjs) carry the same values in
// real <head> markup for crawlers; this keeps them correct after client-side
// navigation. Same pattern as CanonicalUrl.jsx.
export default function PageMeta({ title, description }) {
  useEffect(() => {
    document.title = title;
    let meta = /** @type {HTMLMetaElement | null} */ (
      document.head.querySelector('meta[name="description"]')
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);

  return null;
}
