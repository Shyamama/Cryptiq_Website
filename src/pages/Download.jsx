import React, { useEffect, useRef } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageMeta from "@/components/PageMeta";
import LatticeCanvas from "@/components/landing/LatticeCanvas";
import HUDNav from "@/components/landing/HUDNav";
import DataFooter from "@/components/landing/DataFooter";

const DMG_PATH = "/downloads/CryptiQ-Personal-0.3.0.dmg";
const DMG_SHA256 = "5a96dacb202b63c32244476bb4fd85f5848b4f95291c83f3eb253de5dfb57d9d";

const SCANS = [
  { id: "01", label: "SSH KEYS & KNOWN HOSTS", status: "AUTO-FIXABLE" },
  { id: "02", label: "GPG KEYRING", status: "MANUAL" },
  { id: "03", label: "DISK ENCRYPTION (FILEVAULT)", status: "MANUAL" },
  { id: "04", label: "WI-FI SECURITY MODE", status: "AUTO-FIXABLE" },
  { id: "05", label: "LOGIN KEYCHAIN CERTIFICATES", status: "MANUAL" },
  { id: "06", label: "OS TLS STACK", status: "MANUAL" },
  { id: "07", label: "GIT COMMIT SIGNING", status: "MANUAL" },
];

export default function Download() {
  // Ref, not state, matching the pattern in every other page: the lattice
  // reads scroll progress once per animation frame, never via React state.
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
        title="Download CryptiQ Personal for macOS"
        description="Download CryptiQ Personal: scan every cryptographic asset on your laptop and migrate what a quantum computer could break, with full control over every change."
      />
      <ErrorBoundary>
        <LatticeCanvas progressRef={progressRef} />
      </ErrorBoundary>
      <HUDNav />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="font-mono text-[11px] tracking-widest text-foreground/60 mb-8">
            03 // CRYPTIQ PERSONAL
          </p>
          <h1 className="font-mono text-3xl md:text-5xl font-light tracking-tight leading-tight mb-8">
            Your laptop,
            <br />
            <span className="text-foreground/70">quantum-safe.</span>
          </h1>
          <p className="font-body text-base text-foreground/70 leading-relaxed max-w-2xl mb-12">
            One scan finds every cryptographic asset on your machine: SSH keys, GPG keys, disk
            encryption, Wi-Fi, certificates. What can be migrated safely goes into a queue you
            approve. What can't be migrated by any app (a vendor's certificate, a server's host
            key) is marked Manual with the exact steps to fix it yourself.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={DMG_PATH}
              download
              className="font-mono text-xs tracking-wider bg-brand text-black px-6 py-3.5 hover:bg-brand/90 transition-colors"
            >
              DOWNLOAD FOR MACOS
            </a>
            <span className="font-mono text-[11px] text-foreground/50">
              v0.3.0 · Apple Silicon · macOS 12+ · 3.2 MB
            </span>
          </div>
          <p className="font-mono text-[10px] text-foreground/30 mt-6 break-all">
            SHA-256 {DMG_SHA256}
          </p>
        </div>
      </section>

      {/* What it scans */}
      <section className="relative z-10 py-16 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-8">
            WHAT IT SCANS ON YOUR MACHINE
          </p>
          <div className="space-y-3">
            {SCANS.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 font-mono text-[11px] text-foreground/50"
              >
                <span className="text-foreground/40 w-8">{s.id}</span>
                <span className="flex-1">{s.label}</span>
                <span className={s.status === "AUTO-FIXABLE" ? "text-brand/90" : "text-foreground/40"}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-foreground/40 mt-8 leading-relaxed max-w-2xl">
            Nothing is migrated without your approval, and every applied change keeps a snapshot
            so it can be rolled back with one click. Nothing scanned ever leaves your laptop: the
            inventory lives in a local database, not on our servers.
          </p>
        </div>
      </section>

      {/* First launch */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="font-mono text-[10px] tracking-widest text-foreground/50 mb-6">
            FIRST LAUNCH ON MACOS
          </p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-2xl mb-6">
            This build isn't notarized by Apple yet, so Gatekeeper will flag it once. This is a
            one-time step, not a sign anything is wrong.
          </p>
          <ol className="space-y-3 font-mono text-[13px] text-foreground/60 leading-relaxed">
            <li>1. Open the downloaded .dmg and drag CryptiQ Personal to Applications.</li>
            <li>
              2. Launch it. macOS will say it "cannot be opened" or is from an "unidentified
              developer."
            </li>
            <li>
              3. Open System Settings, then Privacy &amp; Security, scroll down, and click
              <span className="text-foreground/90"> Open Anyway</span> next to CryptiQ Personal.
            </li>
            <li>4. Launch it again and confirm Open.</li>
          </ol>
        </div>
      </section>

      <DataFooter />
    </div>
  );
}
