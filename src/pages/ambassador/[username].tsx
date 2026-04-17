import { GetServerSideProps } from "next";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { FunnelHero } from "@/components/FunnelHero";
import { ValueProposition } from "@/components/ValueProposition";
import { FunnelSegmentation } from "@/components/FunnelSegmentation";
import { SocialProof } from "@/components/SocialProof";
import { FunnelTestimonials } from "@/components/FunnelTestimonials";
import { FunnelForm } from "@/components/FunnelForm";
import { FunnelFooter } from "@/components/FunnelFooter";

interface AmbassadorPageProps {
  ambassadorId: string;
  ambassadorName: string;
  username: string;
}

export default function AmbassadorFunnel({ ambassadorId, ambassadorName, username }: AmbassadorPageProps) {
  return (
    <>
      <SEO
        title={`Viaja Ligero - ${ambassadorName}`}
        description="Accede a precios exclusivos en viajes y experiencias que no están disponibles al público"
      />
      
      <div className="min-h-screen bg-background">
        <FunnelHero username={username} />
        <section id="benefits-section" className="scroll-mt-20">
          <ValueProposition />
        </section>
        <FunnelSegmentation onSelect={(type) => console.log('Selected:', type)} />
        <SocialProof />
        <FunnelTestimonials />
        <section id="how-it-works-section" className="scroll-mt-20">
          <FunnelForm ambassadorId={ambassadorId} ambassadorName={ambassadorName} />
        </section>
        <FunnelFooter />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params as { username: string };

  // Fetch ambassador profile by username
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, ambassador_active")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  // If ambassador not found or not active, redirect to main funnel
  if (error || !profile || !profile.ambassador_active) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: {
      ambassadorId: profile.id,
      ambassadorName: profile.full_name || username,
      username: profile.username
    }
  };
};