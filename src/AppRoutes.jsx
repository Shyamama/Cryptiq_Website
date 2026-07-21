import { Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import CanonicalUrl from './components/CanonicalUrl';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Download from '@/pages/Download';
import Glossary from '@/pages/Glossary';
import GlossaryTerm from '@/pages/GlossaryTerm';

// Router-agnostic route tree: App.jsx mounts it in a BrowserRouter for the
// client, entry-ssg.jsx in a StaticRouter for build-time prerendering. Keep
// route additions in sync with sitemap.config.mjs (static routes only —
// /glossary/* is derived from content/glossary/ automatically).
export default function AppRoutes() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <CanonicalUrl />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<Download />} />
        <Route path="/about" element={<About />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/glossary/:slug" element={<GlossaryTerm />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MotionConfig>
  );
}
