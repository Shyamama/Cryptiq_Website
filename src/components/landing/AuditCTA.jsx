import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LINES = [
  "$ cryptiq --init-audit",
  "→ scanning cryptographic dependencies...",
  "→ RSA-2048 instances found: 847",
  "→ ECC P-256 instances found: 312",
  "→ quantum vulnerability index: CRITICAL",
  "→ recommended action: IMMEDIATE MIGRATION",
  "",
  "$ _"
];

export default function AuditCTA() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < LINES.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 400);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <section className="relative z-10 py-32 md:py-48">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          onViewportEnter={() => setVisibleLines(1)}
        >
          <p className="font-mono text-[10px] tracking-widest text-foreground/60 mb-4">
            INITIATE
          </p>
          <h2 className="font-mono text-xl md:text-2xl font-light tracking-tight mb-16">
            Begin your
            <span className="text-foreground/70"> security audit.</span>
          </h2>

          <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-foreground/20" />
              <div className="w-2 h-2 rounded-full bg-foreground/20" />
              <span className="ml-3 font-mono text-[9px] text-foreground/40 tracking-widest">
                CRYPTIQ_TERMINAL v4.2.1
              </span>
            </div>

            <div className="font-mono text-xs leading-6 text-foreground/70 min-h-[200px]">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} className={`${
                  line.includes("CRITICAL") ? "text-foreground/90" :
                  line.startsWith("$") ? "text-foreground/80" : ""
                }`}>
                  {line}
                  {i === visibleLines - 1 && line.endsWith("_") && (
                    <span className="animate-pulse">▌</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="mailto:rishi@cryp-iq.com"
                className="font-mono text-xs tracking-widest text-foreground/80 hover:text-foreground transition-colors border border-white/20 px-6 py-3 hover:border-white/30"
              >
                REQUEST AUDIT →
              </a>
              <span className="font-mono text-[9px] text-foreground/40">
                RESPONSE TIME: &lt; 24H
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}