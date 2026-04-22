import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { CheckCircle2 } from "lucide-react";

export default function GraciasPage() {
  const router = useRouter();
  const { ref } = router.query;

  // Auto redirect after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref && typeof ref === "string") {
        router.push(`/ambassador/${ref}`);
      } else {
        router.push("/");
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [ref, router]);

  return (
    <>
      <SEO 
        title="¡Registro Exitoso! - Viaja Ligero"
        description="Gracias por registrarte. Te contactaremos pronto."
      />

      {/* FULL SCREEN CONTAINER */}
      <div className="fixed inset-0 bg-[#1A1F3A] overflow-hidden">
        
        {/* Content - FULL WIDTH, CENTERED VERTICALLY */}
        <div className="h-full w-full flex items-center justify-center px-6">
          
          <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-500">
            
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto bg-[#4FD1C5] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-[#1A1F3A]" />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[#4FD1C5]">
                ¡Registro Exitoso!
              </h1>
              <p className="text-xl text-white/90">
                ✨ Bienvenido a Viaja Ligero
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
              <p className="text-base leading-relaxed text-white/90">
                Hemos recibido tu información correctamente.
              </p>
              
              <p className="text-base leading-relaxed text-white/70">
                Uno de nuestros asesores se pondrá en contacto contigo en las próximas{" "}
                <span className="font-bold text-white">24 horas</span> para completar tu membresía y darte acceso a todas las tarifas exclusivas.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#4FD1C5] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1F3A]" />
                </div>
                <p className="text-sm text-white/90">Acceso a 180+ países con descuentos</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#4FD1C5] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1F3A]" />
                </div>
                <p className="text-sm text-white/90">Ahorro de hasta 60% en viajes</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#4FD1C5] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1F3A]" />
                </div>
                <p className="text-sm text-white/90">Experiencias de lujo exclusivas</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                if (ref && typeof ref === "string") {
                  router.push(`/ambassador/${ref}`);
                } else {
                  router.push("/");
                }
              }}
              className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-full shadow-lg active:shadow-md transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Volver al inicio
            </button>

            {/* Auto redirect hint */}
            <p className="text-xs text-white/50">
              Serás redirigido automáticamente en unos segundos...
            </p>

          </div>
        </div>
      </div>
    </>
  );
}