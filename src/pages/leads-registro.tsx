import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { Loader2, CheckCircle2, Gift, Clock } from "lucide-react";

type ProfileType = "explorador" | "ahorro" | "tiempo" | "potencial";

interface Answers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

export default function LeadsRegistroPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(0); // 0=hero, 1-4=questions, 5=loader, 6=capture, 7=result
  const [answers, setAnswers] = useState<Answers>({ q1: "", q2: "", q3: "", q4: "" });
  const [profile, setProfile] = useState<ProfileType>("potencial");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralUsername, setReferralUsername] = useState<string | null>(null);
  const [ambassadorUserId, setAmbassadorUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    email: "",
  });

  // Detect referral
  useEffect(() => {
    const fetchAmbassador = async () => {
      const { ref } = router.query;
      
      if (ref && typeof ref === "string") {
        setReferralUsername(ref);
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", ref.toLowerCase())
          .single();
        
        if (profile) {
          setAmbassadorUserId(profile.id);
        }
      }
    };

    if (router.isReady) {
      fetchAmbassador();
    }
  }, [router.query, router.isReady]);

  // Calculate profile based on answers
  const calculateProfile = (): ProfileType => {
    // Q4: ¿Qué te gustaría lograr?
    if (answers.q4 === "ingresos" || answers.q4 === "ambas") {
      return "explorador";
    }
    
    // Q3: ¿Cuál es tu mayor obstáculo?
    if (answers.q3 === "dinero") {
      return "ahorro";
    }
    
    if (answers.q3 === "tiempo") {
      return "tiempo";
    }
    
    return "potencial";
  };

  // Get dynamic loader text based on answers
  const getLoaderText = (): string => {
    if (answers.q3 === "dinero") {
      return "Detectamos que quieres viajar más sin afectar tus finanzas";
    }
    if (answers.q3 === "tiempo") {
      return "Detectamos que buscas optimizar tu tiempo para viajar más";
    }
    if (answers.q4 === "ingresos" || answers.q4 === "ambas") {
      return "Detectamos que te interesa generar ingresos mientras viajas";
    }
    return "Detectamos que estás listo para viajar más por menos";
  };

  // Handle answer selection (auto advance)
  const handleAnswer = (question: keyof Answers, answer: string) => {
    const newAnswers = { ...answers, [question]: answer };
    setAnswers(newAnswers);
    
    // Auto advance after brief delay
    setTimeout(() => {
      if (step < 4) {
        setStep(step + 1);
      } else if (step === 4) {
        // After Q4, go to loader
        setStep(5);
        // Calculate profile and show loader for 2.5 seconds
        setTimeout(() => {
          const calculatedProfile = calculateProfile();
          setProfile(calculatedProfile);
          setStep(6); // Go to capture form
        }, 2500);
      }
    }, 300);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leadsService.createLead({
        name: formData.nombre,
        email: formData.email,
        phone: formData.whatsapp,
        country: "N/A",
        source: "funnel_interactivo",
        interest: profile,
        contact_method: "whatsapp",
        user_id: ambassadorUserId || null
      });

      // Go to result screen
      setStep(7);

    } catch (err: any) {
      console.error("Error creating lead:", err);
      toast({
        title: "Error al enviar",
        description: err.message || "Intenta de nuevo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress calculation (25%, 50%, 75%, 100%)
  const progress = step === 0 ? 0 : step <= 4 ? (step / 4) * 100 : step === 5 ? 100 : 0;

  // Profile results
  const profileResults = {
    explorador: {
      cta: "VER CÓMO FUNCIONA"
    },
    ahorro: {
      cta: "VER CÓMO FUNCIONA"
    },
    tiempo: {
      cta: "VER CÓMO FUNCIONA"
    },
    potencial: {
      cta: "VER CÓMO FUNCIONA"
    }
  };

  return (
    <>
      <SEO 
        title="Descubre Tarifas Exclusivas de Viaje - Viaja Ligero"
        description="Descubre en 30 segundos cómo viajar más pagando menos"
      />

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
            <div className="w-full h-full relative">
              {/* Background Image - Full Coverage */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/10_Coastal_Boho_Bathroom_Ideas_to_Make_a_Splash_in_Your_Florida_Home.jpeg)' }}
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

          {/* STEP 1: Q1 */}
          {step === 1 && (
            <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Te gustaría viajar más este año?</h2>
              
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
                  onClick={() => handleAnswer("q1", "buscando")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/20 rounded-2xl text-white font-medium shadow-sm active:shadow-none transition-transform duration-150 ease-in-out active:scale-[0.97]"
                >
                  Quiero mejores opciones para viajar
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Q2 */}
          {step === 2 && (
            <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Qué tipo de viajes prefieres?</h2>
              
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

          {/* STEP 3: Q3 */}
          {step === 3 && (
            <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Cuál es tu mayor obstáculo para viajar?</h2>
              
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

          {/* STEP 4: Q4 */}
          {step === 4 && (
            <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Qué te gustaría lograr?</h2>
              
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
            <div className="w-full text-center text-white space-y-8 animate-in fade-in duration-300">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{getLoaderText()}</h2>
                <p className="text-white/60">Analizando tus respuestas</p>
              </div>
            </div>
          )}

          {/* STEP 6: CAPTURE FORM */}
          {step === 6 && (
            <div className="w-full text-white space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-[#4FD1C5] rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-[#1A1F3A]" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Estás a un paso de viajar más por menos</h2>
                  <p className="text-white/70 text-base">¿A dónde te enviamos tu acceso personalizado?</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base rounded-2xl focus:ring-2 focus:ring-[#4FD1C5] focus:border-transparent"
                />

                <Input
                  placeholder="WhatsApp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base rounded-2xl focus:ring-2 focus:ring-[#4FD1C5] focus:border-transparent"
                />

                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base rounded-2xl focus:ring-2 focus:ring-[#4FD1C5] focus:border-transparent"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] disabled:bg-[#4FD1C5]/50 text-[#1A1F3A] font-bold text-base rounded-full shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97] disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </span>
                  ) : "VER MI ACCESO"}
                </button>

                {/* Urgency element */}
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
              <div className="w-20 h-20 mx-auto bg-[#4FD1C5] rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-10 h-10 text-[#1A1F3A]" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-[#4FD1C5] text-xl font-semibold">
                  ¡Perfecto, {formData.nombre.split(' ')[0]}!
                </h2>
                <h1 className="text-[32px] leading-tight font-bold">
                  Este es el sistema que te permite viajar más por menos
                </h1>
                <p className="text-white/70 text-base px-4">
                  Basado en tus respuestas, este acceso es ideal para ti
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push(`/gracias?ref=${referralUsername || 'default'}`)}
                  className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] active:bg-[#2FA89D] text-[#1A1F3A] font-bold text-base rounded-full shadow-lg active:shadow-md transition-transform duration-150 ease-in-out active:scale-[0.97]"
                >
                  {profileResults[profile].cta}
                </button>

                {/* Urgency element */}
                <div className="flex items-center justify-center gap-2 text-[#4FD1C5] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Acceso limitado por tiempo</span>
                </div>

                <button 
                  onClick={() => router.push(`/gracias?ref=${referralUsername || 'default'}`)}
                  className="text-white/60 text-sm underline active:text-white/80 transition-colors"
                >
                  Ver más beneficios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}