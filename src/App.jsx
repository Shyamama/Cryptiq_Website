import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import CanonicalUrl from './components/CanonicalUrl';
import Home from '@/pages/Home';
import About from '@/pages/About';

function App() {
  return (
    <Router>
      <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <CanonicalUrl />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </MotionConfig>
    </Router>
  )
}

export default App