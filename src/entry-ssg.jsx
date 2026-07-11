import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import AppRoutes from './AppRoutes'

// Build-time SSG entry, consumed only by scripts/prerender.mjs. Renders the
// same route tree the client hydrates (src/main.jsx), so prerendered markup
// and first client render agree. Deliberately does not import index.css —
// styles arrive via the built stylesheet linked from the HTML shell.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
}
