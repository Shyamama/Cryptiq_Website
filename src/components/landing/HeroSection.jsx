import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  // Fade the hero out over the first half viewport of scroll. Motion
  // values update outside React rendering (no re-render per scroll) and
  // self-initialize on mount, so a mid-page reload starts already faded.
  // Same curve as the previous max(0, 1 - progress * 1.2) with its
  // 0.6 * viewport trigger: fully transparent at 0.5 * viewport.
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, window.innerHeight * 0.5], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center z-10">
      <motion.div className="text-center px-6" style={{ opacity }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 2 }}
          className="font-mono text-xs tracking-widest text-foreground/60 mb-12"
        >
          POST-QUANTUM CRYPTOGRAPHIC MIGRATION
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="font-mono text-2xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight max-w-4xl mx-auto"
        >
          POST-QUANTUM SECURITY
          <br />
          <span className="text-foreground/70">MADE EASY.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <p className="font-body text-sm text-foreground/70 max-w-md">
            CryptiQ finds the vulnerable encryption across your company and
            migrates it to quantum-safe standards — with your team approving
            every change.
          </p>
          <div className="mt-8 flex items-center gap-2 text-emerald-400/65">
            <div className="w-px h-8 bg-emerald-400/50" />
            <span className="font-mono text-[10px] tracking-widest animate-pulse">SCROLL</span>
            <div className="w-px h-8 bg-emerald-400/50" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}