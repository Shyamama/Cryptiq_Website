import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Prerendered routes (scripts/prerender.mjs) arrive with server markup in
// #root and must hydrate; the SPA shell arrives empty and mounts fresh.
const container = document.getElementById('root')

if (container.hasChildNodes()) {
  hydrateRoot(container, <App />)
} else {
  createRoot(container).render(<App />)
}
