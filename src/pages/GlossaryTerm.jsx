import React from "react";
import { Link, useParams } from "react-router-dom";
import HUDNav from "@/components/landing/HUDNav";
import DataFooter from "@/components/landing/DataFooter";
import PageMeta from "@/components/PageMeta";
import PageNotFound from "@/lib/PageNotFound";
import { categoryLabel, getTerm, glossaryTerms } from "@/lib/content";

// Backtick spans in content prose render as inline code, e.g. `X25519MLKEM768`.
// Plain-text split — content is trusted repo JSON, but we still never inject HTML.
function renderInline(text) {
  const parts = text.split("`");
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="font-mono text-[0.85em] text-foreground/90 bg-white/5 px-1.5 py-0.5 rounded-sm"
      >
        {part}
      </code>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export default function GlossaryTerm() {
  const { slug } = useParams();
  const term = getTerm(slug);

  if (!term) return <PageNotFound />;

  const related = term.related
    .map((s) => glossaryTerms.find((t) => t.slug === s))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E2E2]">
      <PageMeta
        title={`${term.term} — CryptiQ Glossary`}
        description={term.shortDefinition}
      />
      <HUDNav />

      <main className="relative z-10 pt-32 pb-24 md:pt-44">
        <article className="max-w-3xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-between mb-10"
          >
            <p className="font-mono text-[11px] tracking-widest text-foreground/50">
              <Link
                to="/glossary"
                className="hover:text-foreground/80 transition-colors"
              >
                GLOSSARY
              </Link>
              <span className="text-foreground/30"> // </span>
              {categoryLabel(term.category)}
            </p>
            <p className="font-mono text-[10px] tracking-widest text-foreground/30">
              UPDATED {term.dateModified}
            </p>
          </nav>

          {/* Term */}
          <header className="mb-12">
            <h1 className="font-mono text-3xl md:text-5xl font-light tracking-tight leading-tight">
              {term.term}
            </h1>
            {term.acronym && term.acronym !== term.term && (
              <p className="font-mono text-xs text-foreground/50 mt-4">
                {term.acronym}
              </p>
            )}
            {term.aliases?.length > 0 && (
              <p className="font-mono text-[10px] tracking-widest text-foreground/40 mt-3">
                ALSO: {term.aliases.join(" · ")}
              </p>
            )}
          </header>

          {/* Definition lead */}
          <div className="space-y-5 mb-14">
            {term.definition.map((p, i) => (
              <p
                key={i}
                className={`font-body leading-relaxed ${
                  i === 0
                    ? "text-base text-foreground/90"
                    : "text-base text-foreground/70"
                }`}
              >
                {renderInline(p)}
              </p>
            ))}
          </div>

          {/* Sections */}
          {term.sections.map((section, i) => (
            <section key={section.heading} className="mb-14">
              <h2 className="font-mono text-sm text-foreground/90 tracking-wide mb-5">
                <span className="text-foreground/40 mr-3">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="font-body text-base text-foreground/70 leading-relaxed"
                  >
                    {renderInline(p)}
                  </p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-5 space-y-2 border-l border-white/10 pl-5">
                  {section.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="font-body text-base text-foreground/60 leading-relaxed"
                    >
                      {renderInline(b)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* FAQ */}
          <section className="mb-14 border-t border-white/10 pt-10">
            <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-8">
              FREQUENTLY ASKED
            </p>
            <div className="space-y-8">
              {term.faq.map((f) => (
                <div key={f.question}>
                  <h3 className="font-mono text-sm text-foreground/90 mb-3">
                    {f.question}
                  </h3>
                  <p className="font-body text-base text-foreground/70 leading-relaxed">
                    {renderInline(f.answer)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CryptiQ angle */}
          <aside className="mb-14 border border-white/10 bg-[#0A0A0A] p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-4">
              WHERE CRYPTIQ FITS
            </p>
            <p className="font-body text-base text-foreground/70 leading-relaxed mb-6">
              {renderInline(term.cryptiqAngle)}
            </p>
            <a
              href="/#contact"
              className="inline-block font-mono text-xs tracking-widest text-foreground/80 hover:text-foreground border border-white/20 hover:border-white/30 px-6 py-3 transition-colors"
            >
              REQUEST AN AUDIT →
            </a>
          </aside>

          {/* Related terms */}
          {related.length > 0 && (
            <section className="mb-14">
              <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-6">
                RELATED ENTRIES
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/glossary/${r.slug}`}
                    className="group border border-white/10 hover:border-white/25 px-4 py-3 transition-colors"
                  >
                    <p className="font-mono text-xs text-foreground/80 group-hover:text-foreground transition-colors">
                      {r.term}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-foreground/40 mt-1">
                      {categoryLabel(r.category)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Sources */}
          <section className="border-t border-white/10 pt-8">
            <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-5">
              SOURCES
            </p>
            <ul className="space-y-2">
              {term.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs text-foreground/60 hover:text-foreground/90 transition-colors"
                  >
                    {s.title}
                    {s.publisher && (
                      <span className="text-foreground/40"> · {s.publisher}</span>
                    )}{" "}
                    ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>

      <DataFooter />
    </div>
  );
}
