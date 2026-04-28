import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { CheckCircle2, ArrowRight, MessageCircle, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function Gracias() {
  const router = useRouter();
  const referralCode = typeof router.query.ref === "string" ? router.query.ref : null;
  const [mwrLink, setMwrLink] = useState("");

  useEffect(() => {
    const fetchMwrLink = async () => {
      if (!referralCode || typeof referralCode !== "string") {
        setMwrLink(`https://mwr.hubia.vip/leads-registro`);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("mwr_custom_link, username")
        .eq("username", referralCode)
        .single();

      if (data?.mwr_custom_link) {
        setMwrLink(data.mwr_custom_link);
      } else {
        setMwrLink(`https://mwr.hubia.vip/leads-registro?ref=${referralCode}`);
      }
    };

    fetchMwrLink();
  }, [referralCode]);

  useEffect(() => {
    // Auto-redirect to VSL after 5 seconds if user doesn't click
    const timer = setTimeout(() => {
      router.push(`/vsl?ref=${referralCode || ""}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, referralCode]);

  const handleCTA = () => {
    router.push(`/vsl?ref=${referralCode || ""}`);
  };

  const handleWhatsApp = () => {
    // Default WhatsApp number - can be customized per referral
    const whatsappNumber = "1234567890"; // Replace with actual number
    const message = "Hola, acabo de registrarme y quiero activar mi acceso ahora";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <SEO 
        title="¡Acceso Listo! - Viaja Ligero" 
        description="Tu acceso está listo. Activa ahora y descubre cómo viajar más pagando menos" 
      />

      {/* FULL SCREEN CONTAINER */}
      <div className="min-h-screen bg-[#1A1F3A] overflow-auto">
        
        {/* CENTERED CONTENT */}
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          
          <div className="w-full px-6 text-center text-white space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-[#4FD1C5]" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/60 text-sm font-medium">
                Basado en tus respuestas
              </p>
              
              <h1 className="text-[#4FD1C5] text-[36px] leading-tight font-bold">
                Tu acceso personalizado está listo
              </h1>
              
              <p className="text-lg text-white/90">
                Activa tu acceso ahora y descubre cómo viajar más pagando menos
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#4FD1C5]" />
                </div>
                <p className="text-white/90 text-base">
                  Accede a precios ocultos en hoteles y vuelos
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#4FD1C5]" />
                </div>
                <p className="text-white/90 text-base">
                  Viaja pagando menos o incluso gratis
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#4FD1C5]" />
                </div>
                <p className="text-white/90 text-base">
                  Descubre cómo generar ingresos viajando
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-6"
                onClick={() => window.open(mwrLink, "_blank")}
              >
                <Zap className="mr-2 h-5 w-5" />
                Quiero mi acceso
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-6"
                onClick={() => window.open(mwrLink, "_blank")}
              >
                Activar mi membresía
              </Button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}