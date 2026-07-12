import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    index: "01",
    label: "INVENTORY",
    title: "Cryptographic Asset Discovery",
    description:
      "We enumerate every cryptographic asset across your infrastructure: certificates, keys, protocols, and hidden dependencies. Every RSA, ECC, and Diffie-Hellman instance is catalogued and classified by exposure and criticality.",
  },
  {
    index: "02",
    label: "REPORT",
    title: "CBOM & Risk Assessment",
    description:
      "We organize and manage your cryptographic data into a Cryptography Bill of Materials (CBOM). You receive a comprehensive report detailing your quantum vulnerability exposure, prioritized by risk, with clear migration recommendations.",
  },
  {
    index: "03",
    label: "MIGRATE",
    title: "Post-Quantum Migration Support",
    description:
      "We help you migrate assets to NIST-standardized post-quantum algorithms. Our team supports the transition in controlled phases, ensuring compatibility and minimizing disruption to your operations.",
  },
];

export default function ProtocolSection() {
  return (
    <section className="relative z-10 py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="font-mono text-[11px] tracking-widest text-foreground/60 mb-4">
            MIGRATION PROTOCOL
          </p>
          <h2 className="font-mono text-xl md:text-2xl font-light tracking-tight mb-24">
            Three phases to a
            <span className="text-foreground/70"> quantum-resistant infrastructure.</span>
          </h2>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start"
            >
              <div className="md:col-span-3">
                <span className="font-mono text-6xl md:text-7xl font-light text-foreground/35">
                  {step.index}
                </span>
                <p className="font-mono text-[11px] tracking-widest text-brand/90 font-medium mt-2">
                  {step.label}
                </p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-mono text-lg font-light tracking-tight mb-4 text-foreground">
                  {step.title}
                </h3>
                <p className="font-body text-base text-foreground/80 leading-relaxed max-w-xl">
                  {step.description}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="mt-12 flex items-center gap-3 text-foreground/30">
                    <div className="h-px flex-1 bg-foreground/15" />
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}