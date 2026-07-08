import React, { useState, useEffect } from "react";
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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const trigger = window.innerHeight * 0.6;
      const progress = Math.min(1, scrollY / trigger);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E2E2]">
      <LatticeCanvas scrollProgress={scrollProgress} />
      <HUDNav />
      <HeroSection scrollProgress={scrollProgress} />
      <ProtocolSection />
      <ThreatSection />
      <EncryptionVisual />
      <AuditCTA />
      <ContactSection />
      <DataFooter />
    </div>
  );
}