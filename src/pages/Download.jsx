import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageMeta from "@/components/PageMeta";
import LatticeCanvas from "@/components/landing/LatticeCanvas";
import HUDNav from "@/components/landing/HUDNav";
import DataFooter from "@/components/landing/DataFooter";

const DMG_URL =
  "https://github.com/rishitarapareddy1/CryptiQ-VPN/releases/latest/download/CryptiQ-Personal-0.7.0.dmg";
const DMG_SHA256 =
  "4d70a6e9ba6a3c6241f8832c1e8ff51f88488bf1fa2dbe2e1e42ee824fda5d96";
const REPO_URL = "https://github.com/rishitarapareddy1/CryptiQ-VPN";

const COLUMNS = [
  {
    title: "Nothing leaves your device",
    body: "Your asset inventory, scan history, and remediation log live in a local database on your laptop. CryptiQ servers never see what's on your machine.",
  },
  {
    title: "You approve every change",
    body: "Fixable findings go into a queue — nothing is migrated until you review and apply. Every change keeps a byte-exact snapshot with one-click rollback.",
  },
  {
    title: "Real lattice cryptography",
    body: "Sessions are protected by ML-KEM-768 (FIPS 203) combined with X25519 — an attacker must break both the lattice and the curve. Inspect every parameter in the app's Technical tab.",
  },
];

export default function Download() {
  // Same pattern as About.jsx / Home.jsx — the lattice background reads
  // this ref once per animation frame, never via React re-render.
  const progressRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = Math.max(0, window.scrollY);
      const trigger = window.innerHeight * 0.4;
      progressRef.current = Math.min(1, scrollY / trigger);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E2E2]">
      <PageMeta
        title="Download CryptiQ Personal — quantum-safe protection for your laptop"
        description="Download CryptiQ Personal for macOS. Scan every cryptographic asset on your laptop and convert what a quantum computer could break — with review-and-approve control and one-click rollback."
      />
      <ErrorBoundary>
        <LatticeCanvas progressRef={progressRef} />
      </ErrorBoundary>
      <HUDNav />

      <section className="relative max-w-4xl mx-auto px-6 md:px-12 pt-40 pb-24 z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
          className="font-mono text-xs tracking-widest text-brand mb-6"
        >
          CRYPTIQ PERSONAL FOR MACOS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-mono text-3xl md:text-5xl font-light tracking-tight leading-tight"
        >
          Your laptop,
          <br />
          <span className="text-foreground/70">quantum-safe.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-mono text-xs text-brand max-w-lg mt-5 leading-relaxed"
        >
          CryptiQ Personal is a free, open-source macOS VPN — not CryptiQ's
          core enterprise cryptographic migration platform.{" "}
          <a href={REPO_URL} className="underline hover:text-foreground transition-colors">
            Source on GitHub ↗
          </a>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body text-base text-foreground/70 max-w-lg mt-6 leading-relaxed"
        >
          One scan finds every cryptographic asset on your machine — SSH
          keys, GPG keys, disk encryption, Wi-Fi, certificates — and converts
          what a future quantum computer could break. You approve every
          change. Everything can be rolled back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <a
            href={DMG_URL}
            className="inline-block font-mono text-xs tracking-widest bg-brand text-[#080808] px-8 py-4 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            DOWNLOAD FOR MACOS →
          </a>
          <span className="font-mono text-[11px] text-foreground/40 leading-relaxed">
            v0.7.0 · Apple Silicon · macOS 12+
            <br />
            5.92 MB disk image · WireGuard included, nothing else to install
          </span>
        </motion.div>

        <p className="mt-6 font-mono text-[11px] text-foreground/30 break-all leading-relaxed max-w-xl">
          <span className="text-foreground/50">SHA-256</span> {DMG_SHA256}
          <br />
          Verify:{" "}
          <span className="text-foreground/50">
            shasum -a 256 "CryptiQ-Personal-0.7.0.dmg"
          </span>
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-24 pt-10 border-t border-white/10">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[10px] tracking-widest uppercase text-foreground/40 mb-3">
                {col.title}
              </h3>
              <p className="text-[13px] text-foreground/60 leading-relaxed">
                {col.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border border-white/10 rounded-xl px-8 py-7 max-w-xl">
          <h3 className="text-sm font-medium mb-2">First launch on macOS</h3>
          <p className="text-[13px] text-foreground/60 leading-relaxed">
            This build is not yet notarized by Apple. After dragging CryptiQ
            Personal to Applications,{" "}
            <span className="text-brand">right-click the app → Open → Open</span>{" "}
            the first time. (One-time step; notarized builds are coming.)
          </p>
        </div>
      </section>

      <DataFooter />
    </div>
  );
}
