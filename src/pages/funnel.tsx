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
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  return (
    <>
      <SEO
        title="Travel Advantage - Acceso Exclusivo a Viajes Premium"
        description="Accede a precios exclusivos en viajes y experiencias que no están disponibles al público. Ahorra en hoteles, vuelos, cruceros y más."
        image="/og-share-image.PNG"
      />

      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
        <FunnelHero />
        <ValueProposition />
        <FunnelSegmentation onSegmentSelect={setSelectedSegment} />
        <SocialProof />
        <FunnelTestimonials />
        <FunnelForm selectedSegment={selectedSegment} />
        <FunnelFooter />
      </main>
    </>
  );
}