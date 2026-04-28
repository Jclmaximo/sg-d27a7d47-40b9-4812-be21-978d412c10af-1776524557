import { useState } from "react";
import { SEO } from "@/components/SEO";
import { FunnelHero } from "@/components/FunnelHero";
import { ValueProposition } from "@/components/ValueProposition";
import { FunnelSegmentation } from "@/components/FunnelSegmentation";
import { SocialProof } from "@/components/SocialProof";
import { FunnelTestimonials } from "@/components/FunnelTestimonials";
import { FunnelForm } from "@/components/FunnelForm";
import { FunnelFooter } from "@/components/FunnelFooter";

export default function FunnelPage() {
  const [selectedSegment, setSelectedSegment] = useState<"save" | "earn" | "both" | null>(null);

  const handleCTAClick = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <SEO
        title="Travel Advantage - Acceso Exclusivo a Viajes Premium"
        description="Accede a precios exclusivos en viajes y experiencias que no están disponibles al público. Ahorra en hoteles, vuelos, cruceros y más."
        image="/og-share-image.PNG"
      />

      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
        <FunnelHero onCTAClick={handleCTAClick} />
        <ValueProposition />
        <FunnelSegmentation onSelect={setSelectedSegment} />
        <SocialProof />
        <FunnelTestimonials />
        <div id="form-section">
          <FunnelForm />
        </div>
        <FunnelFooter />
      </main>
    </>
  );
}