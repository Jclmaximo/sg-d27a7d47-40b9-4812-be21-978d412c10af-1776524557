import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function GraciasPage() {
  const router = useRouter();
  const { ref } = router.query;

  useEffect(() => {
    // Auto redirect after 7 seconds to ambassador page or home
    const timer = setTimeout(() => {
      if (ref && typeof ref === "string") {
        router.push(`/ambassador/${ref}`);
      } else {
        router.push("/");
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [router, ref]);

  return (
    <>
      <SEO 
        title="¡Registro Exitoso! - Viaja Ligero"
        description="Tu registro ha sido recibido exitosamente"
      />

      <div className="min-h-screen bg-[#1A1F3A] flex items-center justify-center p-6 overflow-hidden">
        <div className="w-full max-w-[390px] text-center text-white space-y-8 animate-in fade-in duration-500">
          
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[#4FD1C5] rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-[#1A1F3A]" strokeWidth={3} />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-[#4FD1C5]">
              ¡Registro Exitoso!
            </h1>
            <p className="text-xl text-white/90">
              Bienvenido a Viaja Ligero
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-4">
            <p className="text-base leading-relaxed">
              Hemos recibido tu información correctamente.
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              Uno de nuestros asesores se pondrá en contacto contigo en las próximas <strong className="text-white font-semibold">24 horas</strong> para completar tu membresía y darte acceso a todas las tarifas exclusivas.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-5 h-5 bg-[#4FD1C5] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-[#1A1F3A]" strokeWidth={3} />
              </div>
              <span>Acceso a 180+ países</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-5 h-5 bg-[#4FD1C5] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-[#1A1F3A]" strokeWidth={3} />
              </div>
              <span>Ahorro de hasta 60% en viajes</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-5 h-5 bg-[#4FD1C5] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-[#1A1F3A]" strokeWidth={3} />
              </div>
              <span>Experiencias de lujo exclusivas</span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4 pt-4">
            <Button
              onClick={() => {
                if (ref && typeof ref === "string") {
                  router.push(`/ambassador/${ref}`);
                } else {
                  router.push("/");
                }
              }}
              className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] text-[#1A1F3A] font-bold text-base rounded-full shadow-lg"
            >
              Volver al inicio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-xs text-white/50">
              Serás redirigido automáticamente en unos segundos...
            </p>
          </div>

        </div>
      </div>
    </>
  );
}