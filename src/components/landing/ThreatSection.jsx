import React from "react";
import { motion } from "framer-motion";

const HERO_IMG = "https://media.base44.com/images/public/6a4d523b69df12a52591bae3/92afb56ce_generated_19418a10.png";
const DATA_IMG = "https://media.base44.com/images/public/6a4d523b69df12a52591bae3/26eafbdb6_generated_b14673e5.png";

export default function ThreatSection() {
  return (
    <section className="relative z-10 py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <p className="font-mono text-[11px] tracking-widest text-foreground/60 mb-4">
            THREAT LANDSCAPE
          </p>
          <h2 className="font-mono text-xl md:text-2xl font-light tracking-tight max-w-2xl">
            Harvest now,
            <span className="text-threat/85"> decrypt later.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-video mb-8 overflow-hidden">
              <img
                src={HERO_IMG}
                alt="N-dimensional lattice structure with intersecting light lines and obsidian vertices"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <p className="font-mono text-[11px] tracking-widest text-foreground/70 mb-3">
              CLASSICAL VULNERABILITY
            </p>
            <p className="font-body text-base text-foreground/70 leading-relaxed">
              RSA-2048 and elliptic curve cryptography rely on the computational difficulty
              of integer factorization and discrete logarithms. Shor's algorithm renders
              both solvable on a sufficiently powerful quantum computer, and your
              encrypted data is being collected now for decryption later.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="aspect-video mb-8 overflow-hidden">
              <img
                src={DATA_IMG}
                alt="Abstract data folding into geometric origami with matte metallic textures"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <p className="font-mono text-[11px] tracking-widest text-foreground/70 mb-3">
              THE POST-QUANTUM PATH
            </p>
            <p className="font-body text-base text-foreground/70 leading-relaxed">
              NIST has standardized lattice-based algorithms (ML-KEM,
              ML-DSA, and SLH-DSA) that resist both classical and quantum attacks.
              We help you understand where you're exposed and migrate your assets to
              these new standards.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}