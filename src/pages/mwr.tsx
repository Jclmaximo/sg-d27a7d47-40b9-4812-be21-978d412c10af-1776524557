import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Zap, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Target,
  FileText,
  Send,
  UserPlus,
  Calendar,
  DollarSign,
  Smartphone,
  Lock,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
  Heart,
  Image as ImageIcon
} from "lucide-react";

export default function MWRPage() {
  const [showCTA, setShowCTA] = useState(false);
  const [showCoverImage, setShowCoverImage] = useState(true);
  const [showGamifiedFlow, setShowGamifiedFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState({
    challenge: "",
    desire: ""
  });
  const [step, setStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  const handleProblemSelect = (problem: string) => {
    setSelectedProblem(problem);
    setTimeout(() => setFlowStep(2), 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCTA(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const challenges = [
    { 
      id: "conseguir", 
      icon: Users,
      title: "Conseguir prospectos", 
      desc: "No sabes cómo atraer personas interesadas"
    },
    { 
      id: "seguimiento", 
      icon: MessageSquare,
      title: "Dar seguimiento", 
      desc: "Se te enfrían los prospectos o no sabes qué decirles"
    },
    { 
      id: "cerrar", 
      icon: Target,
      title: "Cerrar ventas", 
      desc: "Hablas con personas… pero no terminan entrando"
    },
    { 
      id: "todo", 
      icon: Zap,
      title: "Todo lo anterior", 
      desc: "Necesitas ayuda en cada parte del proceso"
    }
  ];

  const desires = [
    { 
      id: "automatizar", 
      icon: Zap,
      title: "Automatizar mi negocio", 
      desc: "Que funcione sin que estés todo el tiempo"
    },
    { 
      id: "escalar", 
      icon: TrendingUp,
      title: "Escalar mis ventas", 
      desc: "Cerrar más ventas sin más esfuerzo"
    },
    { 
      id: "organizar", 
      icon: FileText,
      title: "Organizar mis leads", 
      desc: "Tener todo controlado en un solo lugar"
    },
    { 
      id: "simplificar", 
      icon: CheckCircle2,
      title: "Simplificar el proceso", 
      desc: "Hacerlo más fácil y menos complicado"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MWR - Sistema Automatizado de Leads"
        description="Sistema completo para conseguir prospectos, dar seguimiento automático y cerrar ventas"
      />

      {/* COVER IMAGE - Initial Screen */}
      {showCoverImage && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full">
              <img
                src="/ChatGPT_Image_22_abr_2026_05_50_11_p.m.png"
                alt="Sistema MWR"
                className="w-full h-auto"
              />
              <button
                onClick={() => {
                  setShowCoverImage(false);
                  setShowGamifiedFlow(true);
                }}
                className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[60%] md:w-[50%] h-[8%] md:h-[10%] cursor-pointer hover:opacity-90 transition-opacity"
                aria-label="Descubre cómo funciona"
              >
                <span className="sr-only">Descubre cómo funciona</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed CTA Footer */}
      {showCTA && !showGamifiedFlow && showCoverImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-white py-3 px-4 md:p-6 shadow-2xl z-[60] animate-in slide-in-from-bottom duration-500">
          <div className="max-w-2xl mx-auto text-center space-y-2 md:space-y-4">
            <h3 className="text-base md:text-xl font-bold">
              Sistematiza Tu Negocio MLM Hoy
            </h3>
            <p className="text-xs md:text-sm text-gray-300">
              Accede al sistema piloto por 30 días • Solo $29 USD
            </p>
            <button
              onClick={() => setShowGamifiedFlow(true)}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Acceder al Sistema Piloto
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Gamified Flow */}
      {showGamifiedFlow && (
        <div className="min-h-screen">
          {/* STEP 2: Value Proposition - EXACT REFERENCE DESIGN */}
          {flowStep === 2 && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Background Image - Full Screen */}
              <div className="absolute inset-0">
                <img
                  src="/F7B9293A-A20F-4693-AB59-774804355A44.png"
                  alt="Women having coffee conversation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Demo Label - Top Right Area */}
              <div className="absolute top-8 right-8 z-20">
                <p className="text-white/90 text-sm font-medium tracking-wide">Demo 2/13</p>
              </div>

              {/* Floating Metric Cards - MIDDLE VERTICAL CENTER */}
              <div className="absolute top-[35%] left-0 right-0 z-20 px-6">
                <div className="max-w-6xl mx-auto relative">
                  {/* Prospectos Card - Left */}
                  <div className="absolute left-0 top-0">
                    <div className="bg-white rounded-3xl shadow-2xl p-5 w-[200px] sm:w-[240px]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-base text-gray-800 font-medium">Prospectos</p>
                      </div>
                      <div className="flex items-baseline gap-2 mt-3">
                        <p className="text-5xl font-bold text-gray-900">248</p>
                        <p className="text-green-600 font-bold text-base flex items-center gap-1 mb-1">
                          ↑ 31%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ventas Card - Right */}
                  <div className="absolute right-0 top-8">
                    <div className="relative">
                      {/* Curved Line Connection */}
                      <svg className="absolute -left-24 top-0 w-32 h-20" viewBox="0 0 120 80">
                        <path
                          d="M 10 70 Q 40 40 90 20"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <circle cx="90" cy="20" r="5" fill="#3B82F6" />
                      </svg>
                      
                      <div className="bg-white rounded-3xl shadow-2xl p-5 w-[220px] sm:w-[260px]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-base text-gray-800 font-medium">Ventas cerradas</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <p className="text-5xl font-bold text-gray-900">23</p>
                          <p className="text-green-600 font-bold text-base flex items-center gap-1 mb-1">
                            ↑ 27%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strong White Gradient Overlay - Bottom Half */}
              <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-white via-white to-transparent z-10"></div>

              {/* Content - Bottom Area on White Background */}
              <div className="absolute bottom-0 left-0 right-0 pb-12 px-6 z-30">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-gray-900">Convierte prospectos<br />en clientes </span>
                    <span className="text-[#4A7FFF]">sin perseguir<br />a nadie</span>
                  </h1>

                  {/* Subheadline */}
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Un sistema que organiza tus contactos y te dice exactamente qué hacer para cerrar más ventas
                  </p>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setFlowStep(3)}
                      className="w-full max-w-3xl mx-auto bg-[#4A7FFF] hover:bg-[#3967D6] text-white py-6 px-8 rounded-2xl font-semibold text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      Ver cómo funciona
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Trust Elements Row */}
                  <div className="flex flex-wrap justify-center gap-8 sm:gap-16 text-base sm:text-lg pt-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-7 h-7 text-green-600" />
                      <div className="text-left">
                        <p className="text-gray-800 font-medium leading-tight">Acceso<br />inmediato</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-7 h-7 text-blue-600" />
                      <div className="text-left">
                        <p className="text-gray-800 font-medium leading-tight">Sin<br />experiencia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-7 h-7 text-purple-600" />
                      <div className="text-left">
                        <p className="text-gray-800 font-medium leading-tight">Empieza<br />hoy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALL OTHER STEPS */}
          {flowStep !== 2 && (
            <div className="max-w-4xl mx-auto px-4 py-12 w-full animate-in fade-in duration-500">
              <div className="max-w-3xl mx-auto">
                {/* Progress Indicator */}
                <div className="mb-8 text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    Demo {flowStep}/13
                  </p>
                </div>

                <div className="space-y-8">
                  {/* STEP 1: Hero */}
                  {flowStep === 1 && (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
                      {/* Hero Image Section */}
                      <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden">
                        <img
                          src="/hero-dashboard-woman.jpg"
                          alt="Woman celebrating success with laptop dashboard"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Floating Notification - Over Image */}
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 animate-in slide-in-from-right duration-700">
                          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 sm:p-4 max-w-[240px] sm:max-w-xs">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 overflow-hidden">
                                <img 
                                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" 
                                  alt="María R."
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">Nueva venta</p>
                                <p className="text-xs sm:text-sm text-gray-600">María R. desde Colombia</p>
                                <p className="text-xs text-gray-500">Hace 3 minutos</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Below Image */}
                      <div className="space-y-6 sm:space-y-8">
                        <div className="text-center space-y-3 sm:space-y-4">
                          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                            El sistema que <span className="text-primary">cierra ventas</span> mientras duermes
                          </h1>
                          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            Automatiza tu seguimiento, organiza tus prospectos y convierte más sin perseguir a nadie
                          </p>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => setFlowStep(2)}
                          className="w-full bg-primary hover:bg-primary/90 text-white py-5 sm:py-6 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                          Ver cómo funciona →
                        </button>

                        {/* Trust Elements */}
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-700">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-green-600" />
                            <span>Acceso inmediato</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span>Sin experiencia</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <span>Empieza hoy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Automation Preview */}
                  {flowStep === 3 && (
                    <div className="space-y-8 animate-in fade-in duration-700">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                          Esto es lo que hace el sistema <span className="text-primary">automáticamente</span>
                        </h2>
                        <p className="text-gray-600">Sin que tengas que estar pendiente</p>
                      </div>

                      {/* 3 Visual Steps */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                            <UserPlus className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Registra</h3>
                          <p className="text-sm text-gray-600">Cada persona que llega se guarda automáticamente</p>
                        </div>
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Organiza</h3>
                          <p className="text-sm text-gray-600">Te dice a quién escribir y qué decir</p>
                        </div>
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Hace seguimiento</h3>
                          <p className="text-sm text-gray-600">Nunca más se te olvida un prospecto</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setFlowStep(4)}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                      >
                        Continuar →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}