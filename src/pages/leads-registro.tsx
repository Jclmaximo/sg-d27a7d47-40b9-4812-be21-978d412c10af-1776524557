import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { Loader2, ArrowRight, Link as LinkIcon } from "lucide-react";

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
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
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
    // Q1: ¿Qué te gustaría conseguir?
    if (answers.q1 === "ingresos" || answers.q1 === "ambas") {
      return "explorador";
    }
    
    // Q3: ¿Qué te detiene de viajar más?
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
        // Calculate profile and show loader for 2-3 seconds
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
        name: `${formData.nombre} ${formData.apellido}`.trim(),
        email: formData.email,
        phone: formData.telefono,
        country: formData.pais,
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

  // Progress calculation
  const progress = step === 0 ? 0 : step <= 4 ? (step / 4) * 100 : 100;

  // Profile results
  const profileResults = {
    explorador: {
      title: "Puedes viajar incluso sin pagar",
      cta: "VER CÓMO GENERAR VIAJANDO"
    },
    ahorro: {
      title: "Puedes viajar más gastando mucho menos",
      cta: "VER DESCUENTOS"
    },
    tiempo: {
      title: "Puedes viajar mejor sin perder tiempo",
      cta: "OPTIMIZAR MIS VIAJES"
    },
    potencial: {
      title: "Estás más cerca de viajar más",
      cta: "VER OPCIONES"
    }
  };

  return (
    <>
      <SEO 
        title="Descubre Tu Perfil de Viajero - Viaja Ligero"
        description="Descubre cómo puedes viajar más pagando menos"
      />

      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ 
          backgroundImage: "url('/tropical-paradise.jpg')",
          backgroundPosition: "center"
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg mx-auto px-4">
          
          {/* Logo */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <img src="/viaja-ligero-logo.png" alt="Viaja Ligero" className="h-8 mx-auto" />
          </div>

          {/* Progress bar (only show on questions) */}
          {step > 0 && step < 7 && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md px-8">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 0: HERO */}
          {step === 0 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-500">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Descubre
                <br />
                <span className="text-blue-400">tarifas exclusivas</span>
                <br />
                de viaje
              </h1>
              
              <Button 
                size="lg"
                onClick={() => setStep(1)}
                className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 h-14 text-lg font-semibold"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Comenzar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 1: Q1 */}
          {step === 1 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold">¿Qué te gustaría conseguir?</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer("q1", "ahorrar")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Ahorrar en viajes
                </button>
                
                <button
                  onClick={() => handleAnswer("q1", "ingresos")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Tener ingresos extras
                </button>
                
                <button
                  onClick={() => handleAnswer("q1", "ambas")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Ambas cosas
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Q2 */}
          {step === 2 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold">¿Con qué frecuencia viajas?</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer("q2", "1-2")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  1-2 veces al año
                </button>
                
                <button
                  onClick={() => handleAnswer("q2", "3-4")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  3-4 veces al año
                </button>
                
                <button
                  onClick={() => handleAnswer("q2", "5+")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  5 o más veces al año
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Q3 */}
          {step === 3 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold">¿Qué te detiene de viajar más?</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer("q3", "dinero")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  El dinero
                </button>
                
                <button
                  onClick={() => handleAnswer("q3", "tiempo")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Falta de tiempo
                </button>
                
                <button
                  onClick={() => handleAnswer("q3", "ambas")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Ambas cosas
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Q4 */}
          {step === 4 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <h2 className="text-3xl font-bold">¿Qué prefieres?</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer("q4", "playa")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Playas y resorts
                </button>
                
                <button
                  onClick={() => handleAnswer("q4", "ciudad")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Ciudades y cultura
                </button>
                
                <button
                  onClick={() => handleAnswer("q4", "aventura")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  Aventura y naturaleza
                </button>

                <button
                  onClick={() => handleAnswer("q4", "variado")}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-blue-500 border-2 border-white/30 hover:border-blue-500 rounded-full text-white font-semibold transition-all"
                >
                  De todo un poco
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: LOADER */}
          {step === 5 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-300">
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-400" />
              <p className="text-2xl font-semibold">Calculando tu perfil...</p>
            </div>
          )}

          {/* STEP 6: CAPTURE FORM */}
          {step === 6 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white space-y-6 animate-in fade-in duration-300 border border-white/20">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Casi listo</h2>
                <p className="text-white/80">Completa tus datos para ver tu resultado</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-white">Nombre</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-white">Apellido</Label>
                    <Input
                      id="apellido"
                      placeholder="Pérez"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-white">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais" className="text-white">País</Label>
                  <Select 
                    value={formData.pais} 
                    onValueChange={(value) => setFormData({ ...formData, pais: value })}
                    required
                  >
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mexico">México</SelectItem>
                      <SelectItem value="colombia">Colombia</SelectItem>
                      <SelectItem value="argentina">Argentina</SelectItem>
                      <SelectItem value="chile">Chile</SelectItem>
                      <SelectItem value="peru">Perú</SelectItem>
                      <SelectItem value="espana">España</SelectItem>
                      <SelectItem value="usa">Estados Unidos</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full h-14 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Ver Mi Resultado
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* STEP 7: RESULT */}
          {step === 7 && (
            <div className="text-center text-white space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <p className="text-lg text-white/80">Según tus respuestas…</p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {profileResults[profile].title}
                </h1>
              </div>
              
              <Button 
                size="lg"
                onClick={() => router.push(`/gracias?ref=${referralUsername || 'default'}`)}
                className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 h-14 text-lg font-semibold"
              >
                {profileResults[profile].cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}