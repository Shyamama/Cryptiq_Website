import React from "react";
import { motion } from "framer-motion";

const EVENTS = [
  { year: "1994", title: "Peter Shor publishes his quantum factoring algorithm" },
  { year: "2001", title: "IBM demonstrates Shor's algorithm on a 7-qubit system (factors 15)" },
  { year: "2016", title: "NIST launches the Post-Quantum Cryptography standardization process" },
  { year: "2019", title: "Google achieves quantum supremacy with the Sycamore processor" },
  { year: "2022", title: "NIST selects the algorithms now standardized as ML-KEM and ML-DSA" },
  { year: "2023", title: "IBM unveils 1,121-qubit Condor processor" },
  { year: "2024", title: "NIST publishes FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA) as final standards" },
  { year: "2025", title: "CISA mandates federal agencies submit PQC transition plans" },
  { year: "2025", title: "NIST selects HQC as a fifth PQC algorithm, a backup to ML-KEM" },
  { year: "2026", title: "CryptiQ helping organizations inventory and migrate assets at scale" },
];

export default function Timeline() {
  return (
    <section className="relative z-10 py-32 md:py-48">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <p className="font-mono text-[10px] tracking-widest text-foreground/60 mb-4">
            THE QUANTUM TIMELINE
          </p>
          <h2 className="font-mono text-xl md:text-2xl font-light tracking-tight">
            Three decades of
            <span className="text-foreground/70"> a closing window.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-foreground/15 md:-translate-x-px" />

          <div className="space-y-12">
            {EVENTS.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12"
              >
                {/* Dot */}
                <div className="absolute left-3 md:left-1/2 top-1 w-2.5 h-2.5 rounded-full border border-foreground/30 bg-[#080808] md:-translate-x-1/2 z-10" />

                <div className="md:col-span-1">
                  <span className="font-mono text-sm tracking-widest text-brand block mb-1">
                    {event.year}
                  </span>
                </div>
                <div className="md:col-span-1">
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">
                    {event.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}