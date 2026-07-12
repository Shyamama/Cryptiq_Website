import React, { useEffect, useRef } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageMeta from "@/components/PageMeta";
import LatticeCanvas from "@/components/landing/LatticeCanvas";
import HUDNav from "@/components/landing/HUDNav";
import HeroSection from "@/components/landing/HeroSection";
import ProtocolSection from "@/components/landing/ProtocolSection";
import ThreatSection from "@/components/landing/ThreatSection";
import EncryptionVisual from "@/components/landing/EncryptionVisual";
import AuditCTA from "@/components/landing/AuditCTA";
import ContactSection from "@/components/landing/ContactSection";
import DataFooter from "@/components/landing/DataFooter";

export default function Home() {
  // Ref, not state — the lattice reads it once per animation frame, so
  // scroll position never triggers a React re-render of the page tree.
  const progressRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      // Clamp at 0 — mobile rubber-band overscroll at the top reports
      // negative scrollY, which would otherwise jolt the lattice.
      const scrollY = Math.max(0, window.scrollY);
      const trigger = window.innerHeight * 0.6;
      progressRef.current = Math.min(1, scrollY / trigger);
    };
    onScroll(); // initialize on mount so mid-page reloads start correct
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E2E2]">
      <PageMeta
        title="CryptiQ — Post-Quantum Security Made Easy"
        description="CryptiQ finds the vulnerable encryption across your company and migrates it to quantum-safe NIST standards (ML-KEM, ML-DSA, SLH-DSA), with your team approving every change."
      />
      <ErrorBoundary>
        <LatticeCanvas progressRef={progressRef} />
      </ErrorBoundary>
      <HUDNav />
      <HeroSection />
      <ProtocolSection />
      <ThreatSection />
      <EncryptionVisual />
      <AuditCTA />
      <ContactSection />
      <DataFooter />
    </div>
  );
}