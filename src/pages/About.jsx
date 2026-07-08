import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LatticeCanvas from "@/components/landing/LatticeCanvas";
import HUDNav from "@/components/landing/HUDNav";
import Timeline from "@/components/about/Timeline";

import DataFooter from "@/components/landing/DataFooter";

export default function About() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const trigger = window.innerHeight * 0.4;
      const progress = Math.min(1, scrollY / trigger);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E2E2]">
      <LatticeCanvas scrollProgress={scrollProgress} />
      <HUDNav />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="font-mono text-[10px] tracking-widest text-foreground/60 mb-8">
              02 // ORIGIN
            </p>
            <h1 className="font-mono text-2xl md:text-4xl font-light tracking-tight leading-tight mb-8">
              Founded on a single premise:
              <br />
              <span className="text-foreground/70">
                you can't protect what you can't see.
              </span>
            </h1>
            <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-2xl">
              CryptiQ was founded to solve a practical problem: organizations know quantum
              computing threatens their encryption, but most can't inventory their own
              cryptographic assets, let alone migrate them. We provide asset inventory, data
              management, CBOM reporting, and migration support to guide enterprises through
              the post-quantum transition — step by step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: "847", label: "MIGRATIONS COMPLETE" },
              { value: "14", label: "COUNTRIES" },
              { value: "0", label: "BREACHES POST-MIGRATION" },
              { value: "<4h", label: "AVERAGE DOWNTIME" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="font-mono text-2xl md:text-3xl font-light text-foreground/90">
                  {stat.value}
                </p>
                <p className="font-mono text-[9px] tracking-widest text-foreground/50 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Timeline />
      <DataFooter />
    </div>
  );
}