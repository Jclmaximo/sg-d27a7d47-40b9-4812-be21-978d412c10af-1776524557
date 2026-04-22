import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { Loader2, Gift, Check } from "lucide-react";

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
    
    // Q3: ¿Cuál es tu mayor obstáculo para viajar?
    if (answers.q3 === "dinero") {
      return "ahorro";
    }
    
    if (answers.q3 === "tiempo") {
      return "tiempo";
    }
    
    return "potencial";
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
        const calculatedProfile = calculateProfile();
        setProfile(calculatedProfile);
        setTimeout(() => {
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
  const progress = step === 0 ? 0 : step <= 4 ? (step / 4) * 100 : 100;

  // Profile results
  const profileResults = {
    explorador: {
      title: "Puedes viajar incluso sin pagar",
      cta: "VER CÓMO FUNCIONA"
    },
    ahorro: {
      title: "Puedes viajar más gastando mucho menos",
      cta: "VER CÓMO FUNCIONA"
    },
    tiempo: {
      title: "Puedes viajar mejor sin perder tiempo",
      cta: "VER CÓMO FUNCIONA"
    },
    potencial: {
      title: "Estás más cerca de viajar más",
      cta: "VER CÓMO FUNCIONA"
    }
  };

  return (
    <>
      <SEO 
        title="Descubre Tarifas Exclusivas de Viaje - Viaja Ligero"
        description="Descubre en 30 segundos cómo viajar más pagando menos"
      />

      <div className="min-h-screen bg-[#1A1F3A] relative flex items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 w-full max-w-[390px] mx-auto px-6 min-h-screen flex flex-col justify-center">
          
          {/* Progress bar (only show on questions and loader) */}
          {step > 0 && step < 6 && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-[340px] px-6">
              <div className="text-center mb-2">
                <p className="text-white/60 text-sm">
                  {step <= 4 ? `Paso ${step} de 4` : "Casi listo..."}
                </p>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4FD1C5] transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 0: HERO */}
          {step === 0 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h1 className="text-[40px] leading-[1.2] font-bold">
                  Viajar más... sin gastar más, es posible
                </h1>
                
                <p className="text-lg text-white/70">
                  Descubre en 30 segundos cómo viajar más pagando menos
                </p>
              </div>
              
              <Button 
                size="lg"
                onClick={() => setStep(1)}
                className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] text-[#1A1F3A] font-bold text-base rounded-full shadow-lg"
              >
                QUIERO SABER CÓMO
              </Button>
            </div>
          )}

          {/* STEP 1: Q1 */}
          {step === 1 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Te gustaría viajar más este año?</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer("q1", "definitivamente")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Sí, definitivamente
                </button>
                
                <button
                  onClick={() => handleAnswer("q1", "gustaria")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Me gustaría viajar más
                </button>
                
                <button
                  onClick={() => handleAnswer("q1", "buscando")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Estoy buscando opciones
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Q2 */}
          {step === 2 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Qué tipo de viajes prefieres?</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer("q2", "playa")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Playa y relax
                </button>
                
                <button
                  onClick={() => handleAnswer("q2", "aventura")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Aventura y naturaleza
                </button>
                
                <button
                  onClick={() => handleAnswer("q2", "ciudades")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Ciudades y cultura
                </button>

                <button
                  onClick={() => handleAnswer("q2", "todo")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Un poco de todo
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Q3 */}
          {step === 3 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Cuál es tu mayor obstáculo para viajar?</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer("q3", "dinero")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  El dinero
                </button>
                
                <button
                  onClick={() => handleAnswer("q3", "tiempo")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Falta de tiempo
                </button>
                
                <button
                  onClick={() => handleAnswer("q3", "planificar")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  No sé planificar
                </button>

                <button
                  onClick={() => handleAnswer("q3", "ninguno")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Ninguno
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Q4 */}
          {step === 4 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold px-4">¿Qué te gustaría lograr?</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer("q4", "descuentos")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Descuentos y viajes gratis
                </button>
                
                <button
                  onClick={() => handleAnswer("q4", "ingresos")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Tener ingresos extras
                </button>
                
                <button
                  onClick={() => handleAnswer("q4", "ambas")}
                  className="w-full h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-medium transition-all"
                >
                  Ambas cosas
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: LOADER */}
          {step === 5 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-[#4FD1C5] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Generando tu perfil de viajero ideal...</h2>
                <p className="text-white/60">Analizando tus respuestas</p>
              </div>
            </div>
          )}

          {/* STEP 6: CAPTURE FORM */}
          {step === 6 && (
            <div className="text-white space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-[#4FD1C5] rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-[#1A1F3A]" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Tu resultado está listo</h2>
                  <p className="text-white/70 text-base">¿A dónde te enviamos tu acceso personalizado?</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base rounded-2xl"
                />

                <Input
                  placeholder="WhatsApp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  required
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base rounded-2xl"
                />

                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-base rounded-2xl"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] text-[#1A1F3A] font-bold text-base rounded-full shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "VER MI ACCESO"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* STEP 7: RESULT */}
          {step === 7 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-500">
              <div className="w-20 h-20 mx-auto bg-[#4FD1C5] rounded-full flex items-center justify-center">
                <Gift className="w-10 h-10 text-[#1A1F3A]" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-[#4FD1C5] text-xl font-semibold">
                  ¡Perfecto, {formData.nombre.split(' ')[0].toLowerCase()}!
                </h2>
                <h1 className="text-3xl font-bold leading-tight">
                  {profileResults[profile].title}
                </h1>
                <p className="text-white/70 text-base px-4">
                  Accede a beneficios exclusivos y oportunidades para viajar incluso sin costo
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  size="lg"
                  onClick={() => router.push(`/gracias?ref=${referralUsername || 'default'}`)}
                  className="w-full h-14 bg-[#4FD1C5] hover:bg-[#3FBFB3] text-[#1A1F3A] font-bold text-base rounded-full shadow-lg"
                >
                  {profileResults[profile].cta}
                </Button>

                <button 
                  onClick={() => router.push(`/gracias?ref=${referralUsername || 'default'}`)}
                  className="text-white/60 text-sm underline"
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