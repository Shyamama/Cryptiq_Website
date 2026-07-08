import React from "react";
import { motion } from "framer-motion";

const IMG = "https://media.base44.com/images/public/6a4d523b69df12a52591bae3/44e6a4fe5_generated_407457e2.png";

export default function EncryptionVisual() {
  return (
    <section className="relative z-10 py-24 md:py-40">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 mb-12 opacity-60">
            <img
              src={IMG}
              alt="Quantum encryption crystalline polyhedron with carbon fiber and titanium textures"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <p className="font-mono text-[10px] tracking-widest text-emerald-400 text-center max-w-lg font-medium">
              NIST FIPS 203 · FIPS 204 · FIPS 205 COMPLIANT
            </p>
          </div>
          <p className="font-mono text-[9px] tracking-wider text-emerald-400/70 mt-2">
            CRYSTALS-KYBER · CRYSTALS-DILITHIUM · SPHINCS+
          </p>
        </motion.div>
      </div>
    </section>
  );
}