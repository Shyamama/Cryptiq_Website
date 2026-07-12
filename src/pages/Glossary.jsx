import React from "react";
import { Link } from "react-router-dom";
import HUDNav from "@/components/landing/HUDNav";
import DataFooter from "@/components/landing/DataFooter";
import PageMeta from "@/components/PageMeta";
import { CATEGORIES, glossaryTerms } from "@/lib/content";

export default function Glossary() {
  const newest = glossaryTerms
    .map((t) => t.dateModified)
    .sort()
    .at(-1);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E2E2]">
      <PageMeta
        title="Post-Quantum Cryptography Glossary — CryptiQ"
        description="Plain-language reference on post-quantum cryptography: NIST standards like ML-KEM and ML-DSA, quantum threats like harvest-now-decrypt-later, and migration practice."
      />
      <HUDNav />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-16 md:pt-44 md:pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <p className="font-mono text-[11px] tracking-widest text-foreground/60 mb-8">
            03 // GLOSSARY
          </p>
          <h1 className="font-mono text-2xl md:text-4xl font-light tracking-tight leading-tight mb-8">
            The post-quantum glossary.
          </h1>
          <p className="font-body text-base text-foreground/70 leading-relaxed max-w-2xl">
            The algorithms, standards, threats, and migration practices behind
            the post-quantum transition. Defined precisely, without the hype.
            Written and maintained by the CryptiQ team.
          </p>
          <p className="font-mono text-[10px] tracking-widest text-foreground/40 mt-8">
            {glossaryTerms.length} ENTRIES · UPDATED {newest}
          </p>
        </div>
      </section>

      {/* Entries by category */}
      <section className="relative z-10 pb-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          {CATEGORIES.map((cat) => {
            const entries = glossaryTerms.filter((t) => t.category === cat.id);
            if (entries.length === 0) return null;
            return (
              <div key={cat.id} className="border-t border-white/10 py-12">
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="font-mono text-[10px] tracking-widest text-foreground/50">
                    {cat.label}
                  </h2>
                  <span className="font-mono text-[10px] text-foreground/30">
                    {String(entries.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {entries.map((t) => (
                    <Link
                      key={t.slug}
                      to={`/glossary/${t.slug}`}
                      className="group block"
                    >
                      <p className="font-mono text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                        {t.term}
                      </p>
                      <p className="font-body text-sm text-foreground/50 leading-relaxed mt-2 group-hover:text-foreground/70 transition-colors">
                        {t.shortDefinition}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <DataFooter />
    </div>
  );
}
