import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { CheckCircle2, ArrowRight, MessageCircle, Check } from "lucide-react";

export default function Gracias() {
  const router = useRouter();
  const referralCode = typeof router.query.ref === "string" ? router.query.ref : null;

  useEffect(() => {
    // Auto-redirect after 10 seconds (longer to give time to read)
    const timer = setTimeout(() => {
      if (referralCode) {
        router.push(`/ambassador/${referralCode}`);
      } else {
        router.push("/");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [router, referralCode]);

  const handleMainCTA = () => {
    if (referralCode) {
      router.push(`/ambassador/${referralCode}`);
    } else {
      router.push("/");
    }
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
      <div className="fixed inset-0 bg-[#1A1F3A] overflow-hidden">
        
        {/* CENTERED CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          
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
              <button
                onClick={handleMainCTA}
                className="w-full h-16 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-2xl shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <span>ACTIVAR MI ACCESO AHORA</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={handleWhatsApp}
                className="w-full h-14 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 text-white font-medium text-base rounded-2xl shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar por WhatsApp
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}