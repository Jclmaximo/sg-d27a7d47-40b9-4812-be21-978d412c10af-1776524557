import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import { leadsService } from "@/services/leadsService";
import { useToast } from "@/hooks/use-toast";

export default function LeadsRegistro() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "", q4: "" });
  const [formData, setFormData] = useState({ nombre: "", whatsapp: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const referralCode = typeof router.query.ref === "string" ? router.query.ref : null;

  const progress = step <= 4 ? (step / 4) * 100 : 100;

  const handleAnswer = (question: string, value: string) => {
    setAnswers({ ...answers, [question]: value });
    setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else if (step === 4) {
        setStep(5);
        setTimeout(() => setStep(6), 2500);
      }
    }, 300);
  };

  const getLoaderText = () => {
    if (answers.q3 === "dinero") return "Detectamos que quieres viajar más sin afectar tus finanzas";
    if (answers.q3 === "tiempo") return "Detectamos que buscas optimizar tu tiempo para viajar más";
    if (answers.q4 === "ingresos" || answers.q4 === "ambas") return "Detectamos que te interesa generar ingresos mientras viajas";
    return "Detectamos que estás listo para viajar más por menos";
  };

  const getResultMessage = () => {
    if (answers.q4 === "ingresos" || answers.q4 === "ambas") {
      return { headline: "Puedes viajar incluso sin pagar", cta: "VER CÓMO FUNCIONA" };
    }
    if (answers.q3 === "dinero") {
      return { headline: "Puedes viajar más gastando mucho menos", cta: "VER CÓMO FUNCIONA" };
    }
    if (answers.q3 === "tiempo") {
      return { headline: "Puedes viajar mejor sin perder tiempo", cta: "VER CÓMO FUNCIONA" };
    }
    return { headline: "Estás más cerca de viajar más", cta: "VER CÓMO FUNCIONA" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.whatsapp || !formData.email) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await leadsService.createLead({
        nombre: formData.nombre,
        whatsapp: formData.whatsapp,
        email: formData.email,
        pais: "N/A",
        respuestas: answers,
        referido_por: referralCode || undefined,
      });

      setStep(7);
      setTimeout(() => {
        router.push(referralCode ? `/gracias?ref=${referralCode}` : "/gracias");
      }, 2000);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Error al enviar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Descubre Cómo Viajar Más - Viaja Ligero" description="Accede a un sistema probado para viajar más pagando menos" />

      {/* FULL SCREEN CONTAINER */}
      <div className="fixed inset-0 bg-[#1A1F3A] overflow-hidden">
        
        {/* Progress bar (only show on questions and loader) */}
        {step > 0 && step <= 5 && (
          <div className="absolute top-0 left-0 right-0 pt-6 px-6 z-10">
            <div className="text-center mb-3">
              <p className="text-white/60 text-sm font-medium">
                {step <= 4 ? `Paso ${step} de 4` : "Casi listo..."}
              </p>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4FD1C5] rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content - FULL WIDTH NO CENTERING */}
        <div className="h-full w-full">

          {/* STEP 0: HERO */}
          {step === 0 && (
            <div className="absolute inset-0">
              {/* Background Image - Full Edge-to-Edge Coverage */}
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: 'url(/10_Coastal_Boho_Bathroom_Ideas_to_Make_a_Splash_in_Your_Florida_Home.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Gradient Overlay - transparent top to dark bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
              
              {/* Content - positioned at bottom, left-aligned */}
              <div className="absolute inset-x-0 bottom-0 px-6 pb-12 space-y-6 text-white animate-in fade-in duration-500">
                <div className="space-y-4 text-left">
                  <h1 className="text-[40px] leading-[1.2] font-bold">
                    Descubre cómo viajar más… incluso GRATIS
                  </h1>
                  
                  <p className="text-lg text-white/90">
                    Accede a un sistema probado para viajar más pagando menos
                  </p>
                </div>
                
                <button
                  onClick={() => setStep(1)}
                  className="w-full h-16 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-2xl shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97]"
                >
                  QUIERO SABER CÓMO
                </button>
              </div>
            </div>
          )}

          {/* STEPS 1-8: Centered Content */}
          {step >= 1 && (
            <div className="h-full w-full flex items-center justify-center px-6">
              
              {/* STEP 1: Question 1 */}
              {step === 1 && (
                <div className="w-full h-full px-6 text-center text-white space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold">
                    ¿Te gustaría viajar más este año?
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAnswer("q1", "definitivamente")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Sí, definitivamente
                    </button>
                    <button
                      onClick={() => handleAnswer("q1", "gustaria")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Me gustaría viajar más
                    </button>
                    <button
                      onClick={() => handleAnswer("q1", "opciones")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Quiero mejores opciones para viajar
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Question 2 */}
              {step === 2 && (
                <div className="w-full h-full px-6 text-center text-white space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold">
                    ¿Qué tipo de viajes prefieres?
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAnswer("q2", "playa")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Playa y relax
                    </button>
                    <button
                      onClick={() => handleAnswer("q2", "aventura")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Aventura y naturaleza
                    </button>
                    <button
                      onClick={() => handleAnswer("q2", "ciudades")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Ciudades y cultura
                    </button>
                    <button
                      onClick={() => handleAnswer("q2", "todo")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Un poco de todo
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Question 3 */}
              {step === 3 && (
                <div className="w-full h-full px-6 text-center text-white space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold">
                    ¿Cuál es tu mayor obstáculo para viajar?
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAnswer("q3", "dinero")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      El dinero
                    </button>
                    <button
                      onClick={() => handleAnswer("q3", "tiempo")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Falta de tiempo
                    </button>
                    <button
                      onClick={() => handleAnswer("q3", "planificar")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      No sé planificar
                    </button>
                    <button
                      onClick={() => handleAnswer("q3", "ninguno")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Ninguno
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Question 4 */}
              {step === 4 && (
                <div className="w-full h-full px-6 text-center text-white space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold">
                    ¿Qué te gustaría lograr?
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAnswer("q4", "descuentos")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Descuentos y viajes gratis
                    </button>
                    <button
                      onClick={() => handleAnswer("q4", "ingresos")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Tener ingresos extras
                    </button>
                    <button
                      onClick={() => handleAnswer("q4", "ambas")}
                      className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      Ambas cosas
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: LOADER */}
              {step === 5 && (
                <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-center">
                    <Loader2 className="w-16 h-16 text-[#4FD1C5] animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      {getLoaderText()}
                    </h2>
                    <p className="text-white/60 text-sm">
                      Analizando tus respuestas
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 6: CAPTURE FORM */}
              {step === 6 && (
                <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#4FD1C5] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-[#1A1F3A]" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-[28px] font-bold leading-tight">
                      Estás a un paso de viajar más por menos
                    </h2>
                    <p className="text-white/70">
                      ¿A dónde te enviamos tu acceso personalizado?
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#4FD1C5]"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#4FD1C5]"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#4FD1C5]"
                      required
                    />
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-2xl shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97] disabled:opacity-50"
                    >
                      {isSubmitting ? "Enviando..." : "VER MI ACCESO"}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[#4FD1C5] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Acceso limitado por tiempo</span>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 7: RESULT */}
              {step === 7 && (
                <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-[#4FD1C5] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-[#1A1F3A]" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-[#4FD1C5] text-xl font-semibold">
                      ¡Perfecto, {formData.nombre.split(" ")[0]}!
                    </h2>
                    
                    <h1 className="text-[32px] leading-tight font-bold">
                      Este es el sistema que te permite viajar más por menos
                    </h1>
                    
                    <p className="text-white/70 text-lg">
                      Basado en tus respuestas, este acceso es ideal para ti
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => router.push(referralCode ? `/gracias?ref=${referralCode}` : "/gracias")}
                      className="w-full h-16 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-2xl shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97]"
                    >
                      {getResultMessage().cta}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[#4FD1C5] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Acceso limitado por tiempo</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </>
  );
}