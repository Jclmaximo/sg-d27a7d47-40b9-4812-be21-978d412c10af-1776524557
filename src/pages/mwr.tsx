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
        <div className="min-h-screen flex items-center justify-center">
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

                {/* STEP 2: Value Proposition */}
                {flowStep === 2 && (
                  <div className="relative min-h-screen flex items-end pb-8 sm:pb-16 animate-in fade-in duration-700">
                    {/* Hero Image Background */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=1600&fit=crop&crop=faces,center"
                        alt="Two women having a conversation over coffee"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
                    </div>

                    {/* Floating Metric Cards */}
                    <div className="absolute top-32 sm:top-40 left-0 right-0 z-10 px-4">
                      <div className="max-w-2xl mx-auto relative">
                        {/* Prospectos Card - Left */}
                        <div className="absolute left-4 sm:left-8 top-0 animate-in slide-in-from-left duration-700">
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-5 w-[160px] sm:w-[200px]">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <p className="text-sm text-gray-600 font-medium">Prospectos</p>
                            </div>
                            <div className="flex items-end gap-2">
                              <p className="text-3xl sm:text-4xl font-bold text-gray-900">248</p>
                              <p className="text-green-600 font-semibold text-sm mb-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                31%
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Ventas Card - Right */}
                        <div className="absolute right-4 sm:right-8 top-12 sm:top-20 animate-in slide-in-from-right duration-700 delay-150">
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-5 w-[180px] sm:w-[220px]">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              </div>
                              <p className="text-sm text-gray-600 font-medium">Ventas cerradas</p>
                            </div>
                            <div className="flex items-end gap-2">
                              <p className="text-3xl sm:text-4xl font-bold text-gray-900">23</p>
                              <p className="text-green-600 font-semibold text-sm mb-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                27%
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Connection Line */}
                        <svg className="absolute top-8 left-1/2 -translate-x-1/2 w-full h-32 opacity-40 hidden sm:block" viewBox="0 0 400 100">
                          <path
                            d="M 50 20 Q 200 50 350 80"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Content Below */}
                    <div className="relative z-10 w-full space-y-6 sm:space-y-8 pt-64 sm:pt-80">
                      <div className="text-center space-y-3 sm:space-y-4">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
                          Convierte prospectos<br />en clientes <span className="text-primary">sin perseguir<br />a nadie</span>
                        </h1>
                        <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                          Un sistema que organiza tus contactos y te dice exactamente qué hacer para cerrar más ventas
                        </p>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => setFlowStep(3)}
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

                {/* STEP 3: Value Demo */}
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

                {/* STEP 4: Problem Agitation */}
                {flowStep === 4 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        ¿Te ha pasado esto?
                      </h2>
                    </div>

                    {/* Problem Points */}
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-500 text-xl">❌</div>
                        <p className="text-gray-700">Personas te preguntan... pero nunca les das seguimiento</p>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-500 text-xl">❌</div>
                        <p className="text-gray-700">Pierdes prospectos porque no sabes cuándo escribirles</p>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-500 text-xl">❌</div>
                        <p className="text-gray-700">No tienes claridad de quién está interesado y quién no</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-700 font-medium mb-6">Esto es exactamente lo que este sistema resuelve</p>
                      <button
                        onClick={() => setFlowStep(5)}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                      >
                        Ver cómo lo resuelve →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Solution Overview */}
                {flowStep === 5 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        El sistema hace <span className="text-primary">3 cosas</span> por ti
                      </h2>
                    </div>

                    {/* 3 Solutions */}
                    <div className="space-y-6 max-w-2xl mx-auto">
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold">1</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Captura cada lead automáticamente</h3>
                          <p className="text-gray-600">Desde el momento en que alguien se registra, el sistema ya lo tiene guardado</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">2</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Te dice exactamente a quién escribir</h3>
                          <p className="text-gray-600">Organiza tus prospectos y te muestra quién necesita seguimiento ahora</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-bold">3</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Te da mensajes listos para enviar</h3>
                          <p className="text-gray-600">No tienes que pensar qué escribir, solo copias y envías</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(6)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 6: Control Panel */}
                {flowStep === 6 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Panel de control <span className="text-primary">centralizado</span>
                      </h2>
                    </div>

                    {/* Dashboard Mock Visual - Clean Style */}
                    <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
                      {/* Mini Metrics - Subtle */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Leads</p>
                          <p className="text-2xl font-bold text-primary">28</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Seguimiento</p>
                          <p className="text-2xl font-bold text-primary">12</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Activas</p>
                          <p className="text-2xl font-bold text-primary">6</p>
                        </div>
                      </div>

                      {/* Leads List - Clean and Spacious */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold text-sm">
                              JP
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium text-sm">Juan Pérez</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                Nuevo
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                              ML
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium text-sm">María López</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                Contactado
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                              CR
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium text-sm">Carlos Ruiz</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                                Seguimiento
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(7)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 7: Time Freedom */}
                {flowStep === 7 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Imagina dedicar <span className="text-primary">10 minutos al día</span>
                      </h2>
                      <p className="text-gray-600">...y tener todo tu negocio organizado</p>
                    </div>

                    {/* Time Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">❌ Sin el sistema</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Buscas en WhatsApp quién es cada persona</li>
                          <li>• Tratas de recordar quién estaba interesado</li>
                          <li>• Pierdes tiempo pensando qué escribir</li>
                          <li>• Se te olvidan prospectos importantes</li>
                        </ul>
                      </div>

                      <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">✅ Con el sistema</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Abres el panel y ya sabes a quién escribir</li>
                          <li>• Copias el mensaje sugerido</li>
                          <li>• Lo envías en 30 segundos</li>
                          <li>• Listo. Tu negocio avanza solo</li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(8)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 8: Social Proof */}
                {flowStep === 8 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Personas que ya lo están usando
                      </h2>
                    </div>

                    {/* Testimonials */}
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">MR</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">María Rodríguez</p>
                            <p className="text-sm text-gray-600">Colombia</p>
                          </div>
                        </div>
                        <p className="text-gray-700">"Antes se me olvidaban los prospectos. Ahora el sistema me dice a quién escribir cada día."</p>
                      </div>

                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-bold">JM</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Jorge Méndez</p>
                            <p className="text-sm text-gray-600">México</p>
                          </div>
                        </div>
                        <p className="text-gray-700">"Duplicó mis conversaciones en 2 semanas. Ya no pierdo tiempo buscando a quién contactar."</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(9)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 9: Objection Handler */}
                {flowStep === 9 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        "¿Pero esto funciona si <span className="text-primary">no soy técnico</span>?"
                      </h2>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-gray-700 text-lg mb-4">
                          <span className="font-bold">Sí.</span> De hecho, está diseñado para personas sin experiencia técnica.
                        </p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>No necesitas saber de tecnología</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Todo es visual y fácil de usar</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>Empiezas a usarlo el mismo día</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(10)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 10: CTA Pre-frame */}
                {flowStep === 10 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        ¿Quieres que te enseñemos <span className="text-primary">cómo funciona</span> en vivo?
                      </h2>
                      <p className="text-gray-600">Te mostramos el sistema completo y respondes cualquier pregunta</p>
                    </div>

                    {/* Benefits */}
                    <div className="max-w-2xl mx-auto space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <p className="text-gray-700">Ves el sistema funcionando en tiempo real</p>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <p className="text-gray-700">Preguntas todo lo que necesites</p>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <p className="text-gray-700">Sin presión, solo información clara</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(11)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Sí, quiero verlo →
                    </button>
                  </div>
                )}

                {/* STEP 11: Urgency */}
                {flowStep === 11 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Cada día que pasa <span className="text-primary">pierdes prospectos</span>
                      </h2>
                      <p className="text-gray-600">Mientras lo piensas, tus competidores ya están usando sistemas así</p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                        <p className="text-gray-700 text-center mb-4">
                          <span className="font-bold">Empieza hoy.</span> No pierdas más oportunidades.
                        </p>
                        <p className="text-sm text-gray-600 text-center">
                          Déjanos tus datos y te mostramos cómo funciona
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(12)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Registrarme ahora →
                    </button>
                  </div>
                )}

                {/* STEP 12: Pricing/Offer */}
                {flowStep === 12 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Empieza hoy con tu <span className="text-primary">sistema listo para usar</span>
                      </h2>
                      <p className="text-gray-600">
                        No necesitas experiencia. Solo seguir el sistema y enviar los mensajes
                      </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="max-w-xl mx-auto">
                      <div className="relative bg-primary rounded-2xl p-8 text-white">
                        {/* Badge */}
                        <div className="absolute -top-3 right-8">
                          <span className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-1">
                            MÁS ELEGIDO 🔥
                          </span>
                        </div>

                        {/* Plan Type */}
                        <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide mb-2">
                          PLAN MENSUAL
                        </p>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold">$29</span>
                            <span className="text-2xl text-blue-100">USD</span>
                          </div>
                          <p className="text-blue-100 text-sm mt-1">Primer mes (incluye configuración)</p>
                          <p className="text-white font-semibold mt-2">Luego solo $9 USD/mes</p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-blue-400 my-6"></div>

                        {/* Benefits */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Primer mes incluye configuración completa</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Luego solo $9/mes (≈ $0.30 USD al día)</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Acceso inmediato + todo configurado para empezar hoy</span>
                          </div>
                        </div>

                        {/* Value Prop */}
                        <p className="text-yellow-300 font-semibold text-center mb-6">
                          La opción más inteligente si vas en serio
                        </p>

                        {/* CTA Button */}
                        <button
                          onClick={() => setFlowStep(13)}
                          className="w-full bg-white text-primary py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          Quiero empezar ahora
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Trust Elements */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500">🔒 Pago seguro • ⚡ Acceso inmediato • 📱 Sin permanencia</p>
                    </div>
                  </div>
                )}

                {/* STEP 13: Final Close */}
                {flowStep === 13 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Todo está <span className="text-primary">listo para que empieces</span>
                      </h2>
                      <p className="text-gray-600">No necesitas aprender nada nuevo. Solo seguir el sistema y avanzar paso a paso</p>
                    </div>

                    {/* Main Reinforcement Block */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-900 font-semibold">Ya tienes las herramientas</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-900 font-semibold">Ya tienes los mensajes</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-900 font-semibold">Ya sabes qué hacer</p>
                        </div>
                      </div>
                      <p className="text-primary font-bold text-center mt-4 text-lg">Solo falta que empieces</p>
                    </div>

                    {/* Model Clarity */}
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 text-center">
                      <p className="text-gray-700 font-medium">
                        Tú decides cuándo enviar cada mensaje. Nada complicado.
                      </p>
                    </div>

                    {/* Main CTA */}
                    <button
                      onClick={() => window.location.href = '/registro'}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-xl font-bold transition-colors text-lg shadow-lg"
                    >
                      Quiero empezar ahora →
                    </button>

                    {/* Security Microcopy */}
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Acceso inmediato</span>
                        <span>•</span>
                        <span>Empieza hoy</span>
                        <span>•</span>
                        <span>Sin complicaciones</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Sin riesgos. Puedes cancelar cuando quieras.
                      </p>
                    </div>

                    {/* Final Reinforcement */}
                    <div className="text-center">
                      <p className="text-base text-gray-700 font-medium">
                        No necesitas hacerlo perfecto. Solo empezar.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}