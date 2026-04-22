import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Play, Check, ArrowRight, MessageCircle, Sparkles, Plane, DollarSign, Users } from "lucide-react";

export default function VSL() {
  const router = useRouter();
  const [mwrLink, setMwrLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchMwrLink = async () => {
      const { ref } = router.query;
      if (ref && typeof ref === "string") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("mwr_link")
          .eq("username", ref)
          .single();

        if (profile?.mwr_link) {
          setMwrLink(profile.mwr_link);
        }
      }
    };

    if (router.isReady) {
      fetchMwrLink();
    }
  }, [router.isReady, router.query]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hola, acabo de ver mi acceso personalizado y quiero más información sobre la membresía"
    );
    window.open(`https://wa.me/+525588924567?text=${message}`, "_blank");
  };

  const handleCTA = () => {
    // TODO: Redirect to checkout page
    window.location.href = "/checkout";
  };

  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("ref");
    if (code) {
      setReferralCode(code);
    }
  }, []);

  return (
    <>
      <SEO
        title="Tu Acceso Personalizado - Viaja Ligero"
        description="Descubre cómo viajar más pagando menos con acceso a tarifas ocultas y beneficios exclusivos"
      />

      <div className="min-h-screen bg-[#1A1F3A] text-white">
        
        {/* HERO SECTION */}
        <section className="px-6 pt-12 pb-16">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Headlines */}
            <div className="space-y-4 text-center">
              <h1 className="text-[36px] leading-[1.2] font-bold">
                Cómo viajar más pagando menos (incluso gratis)
              </h1>
              
              <p className="text-lg text-white/80">
                Accede a tarifas ocultas, beneficios exclusivos y oportunidades para viajar sin costo
              </p>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10">
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                poster="/public/v2_36e909d4-63ca-4d40-a583-13d8d68e0f1d.mp4"
              >
                <source src="/v2_36e909d4-63ca-4d40-a583-13d8d68e0f1d.mp4" type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

            {/* Hero CTA */}
            <button
              onClick={() => window.location.href = mwrLink || "https://www.mwrlife.com/"}
              className="w-full h-16 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-2xl shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97] flex items-center justify-center gap-2"
            >
              <span>QUIERO MI ACCESO</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        </section>

        {/* BENEFICIOS CLAVE */}
        <section className="px-6 py-16 bg-white/5">
          <div className="max-w-2xl mx-auto space-y-8">
            
            <h2 className="text-[28px] font-bold text-center">
              ¿Qué obtienes con tu membresía?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-[#4FD1C5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ahorra hasta 70%</h3>
                  <p className="text-white/70 text-sm">
                    Obtén descuentos exclusivos en hoteles, vuelos y experiencias de viaje
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#4FD1C5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Precios ocultos</h3>
                  <p className="text-white/70 text-sm">
                    Accede a tarifas no disponibles al público en plataformas privadas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0">
                  <Plane className="w-6 h-6 text-[#4FD1C5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Viaja gratis</h3>
                  <p className="text-white/70 text-sm">
                    Gana créditos de viaje refiriendo a otras personas al club
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#4FD1C5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Genera ingresos</h3>
                  <p className="text-white/70 text-sm">
                    Conviértete en Lifestyle Ambassador y gana comisiones viajando
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto space-y-8">
            
            <h2 className="text-[28px] font-bold text-center">
              ¿Cómo funciona?
            </h2>

            <div className="space-y-6">
              
              {/* Paso 1 */}
              <div className="relative">
                <div className="absolute -left-3 top-0 w-12 h-12 rounded-full bg-[#4FD1C5] flex items-center justify-center font-bold text-[#1A1F3A] text-lg">
                  1
                </div>
                <div className="ml-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-bold text-xl mb-2">Activas tu membresía</h3>
                  <p className="text-white/70">
                    Completa tu registro y obtén acceso instantáneo a la plataforma exclusiva
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="relative">
                <div className="absolute -left-3 top-0 w-12 h-12 rounded-full bg-[#4FD1C5] flex items-center justify-center font-bold text-[#1A1F3A] text-lg">
                  2
                </div>
                <div className="ml-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-bold text-xl mb-2">Accedes a descuentos privados</h3>
                  <p className="text-white/70">
                    Explora nuestra plataforma con miles de ofertas exclusivas no disponibles al público
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="relative">
                <div className="absolute -left-3 top-0 w-12 h-12 rounded-full bg-[#4FD1C5] flex items-center justify-center font-bold text-[#1A1F3A] text-lg">
                  3
                </div>
                <div className="ml-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-bold text-xl mb-2">Empiezas a viajar más</h3>
                  <p className="text-white/70">
                    Reserva tus viajes con descuentos y genera ingresos refiriendo amigos
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* PRUEBA SOCIAL */}
        <section className="px-6 py-16 bg-white/5">
          <div className="max-w-2xl mx-auto space-y-8">
            
            <div className="text-center">
              <p className="text-[#4FD1C5] font-semibold text-lg mb-2">
                +miles de personas ya están viajando con este sistema
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Testimonio 1 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#4FD1C5]">★</span>
                  ))}
                </div>
                <p className="text-white/90 mb-4">
                  "Ahorré más de $800 USD en mi viaje a Europa. Los descuentos en hoteles son increíbles y reales."
                </p>
                <p className="text-white/60 text-sm font-medium">
                  — María González, México
                </p>
              </div>

              {/* Testimonio 2 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#4FD1C5]">★</span>
                  ))}
                </div>
                <p className="text-white/90 mb-4">
                  "No solo ahorro en mis viajes, también estoy generando ingresos extras compartiendo esto con mis conocidos."
                </p>
                <p className="text-white/60 text-sm font-medium">
                  — Carlos Ruiz, Colombia
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto space-y-8">
            
            <div className="text-center space-y-4">
              <h2 className="text-[32px] font-bold">
                Activa tu acceso hoy
              </h2>
              <p className="text-white/70 text-lg">
                Únete a miles de viajeros que ya están ahorrando y generando ingresos
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = mwrLink || "https://www.mwrlife.com/"}
                className="w-full h-16 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-2xl shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <span>ACTIVAR MI MEMBRESÍA</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full h-14 bg-transparent hover:bg-white/5 active:bg-white/10 border-2 border-[#4FD1C5] text-[#4FD1C5] font-semibold text-base rounded-2xl transition-transform duration-150 ease-in-out active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Hablar por WhatsApp</span>
              </button>

              <p className="text-center text-white/60 text-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4FD1C5] animate-pulse"></span>
                Acceso limitado por tiempo
              </p>
            </div>

          </div>
        </section>

        {/* Spacer bottom */}
        <div className="h-12"></div>

      </div>
    </>
  );
}