import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function HUDNav() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll(); // initialize on mount so mid-page reloads start correct
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-black/60 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link to="/" className="font-mono text-xs tracking-widest text-foreground/70 hover:text-foreground transition-colors">
          CryptiQ
        </Link>
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`font-mono text-xs tracking-wider transition-colors ${
              isActive("/") ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            HOME
          </Link>
          <a
            href="/#contact"
            className="font-mono text-xs tracking-wider text-foreground/80 border border-white/20 px-4 py-2 hover:text-brand hover:border-brand/40 transition-colors"
          >
            REQUEST A DEMO
          </a>
          <Link
            to="/about"
            className={`font-mono text-xs tracking-wider transition-colors ${
              isActive("/about") ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            ABOUT
          </Link>
          <Link
            to="/glossary"
            className={`font-mono text-xs tracking-wider transition-colors ${
              location.pathname.startsWith("/glossary") ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            GLOSSARY
          </Link>
          <a
            href="/#contact"
            className="font-mono text-xs tracking-wider text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            CONTACT
          </a>
        </div>
      </div>
    </nav>
  );
}