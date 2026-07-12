import React from "react";
import { Link } from "react-router-dom";

const CAPABILITIES = [
  { id: "01", label: "CRYPTOGRAPHIC INVENTORY", status: "AVAILABLE" },
  { id: "02", label: "CBOM & RISK ASSESSMENT", status: "AVAILABLE" },
  { id: "03", label: "POST-QUANTUM MIGRATION SUPPORT", status: "AVAILABLE" },
  { id: "04", label: "CONTINUOUS VENDOR MONITORING", status: "IN DEVELOPMENT" },
];

export default function DataFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Capabilities status */}
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-6">
              CURRENT CAPABILITIES
            </p>
            <div className="space-y-3">
              {CAPABILITIES.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 font-mono text-[11px] text-foreground/50"
                >
                  <span className="text-foreground/40 w-8">{c.id}</span>
                  <span className="flex-1">{c.label}</span>
                  <span
                    className={
                      c.status === "AVAILABLE"
                        ? "text-brand/90"
                        : "text-foreground/40"
                    }
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links & status */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-6">
                NAVIGATION
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  HOME
                </Link>
                <Link
                  to="/about"
                  className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  ABOUT
                </Link>
                <Link
                  to="/glossary"
                  className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  GLOSSARY
                </Link>
                <a
                  href="#contact"
                  className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  CONTACT
                </a>
                <a
                  href="https://www.linkedin.com/company/cryp-iq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  LINKEDIN ↗
                </a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-foreground/50">
                  QUANTUM THREAT LEVEL
                </span>
              </div>
              <p className="font-mono text-sm text-threat/80">ELEVATED</p>
              <p className="font-mono text-[10px] text-foreground/40 mt-1">
                ESTIMATED Q-DAY: 2028–2032
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-foreground/40">
            © 2026 CryptiQ. ALL RIGHTS RESERVED.
          </span>
          <span className="font-mono text-[10px] text-foreground/30">
            POST-QUANTUM CRYPTOGRAPHIC MIGRATION
          </span>
        </div>
      </div>
    </footer>
  );
}