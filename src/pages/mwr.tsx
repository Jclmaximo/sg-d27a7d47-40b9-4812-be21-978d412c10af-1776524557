import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, CheckCircle2, User, MessageSquare, FileText, Users, Zap, Target, TrendingUp, MessageCircle, CheckCircle, Image, Calendar, Tag, Lock, DollarSign, Clock, Star } from "lucide-react";

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
                {/* STEP 1: Challenge Selection */}
                {flowStep === 1 && (
                  <div className="space-y-8 animate-in fade-in duration-700 text-center">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        ¿Qué es lo que más <span className="text-primary">te está frenando</span> ahora mismo?
                      </h2>
                      <p className="text-gray-600 mb-8">Selecciona tu mayor desafío en este momento</p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setSelectedOption("prospectos");
                          handleProblemSelect("prospectos");
                        }}
                        className={`w-full flex items-start gap-4 p-6 bg-white border-2 rounded-xl transition-all text-left ${
                          selectedOption === "prospectos"
                            ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Conseguir prospectos</h3>
                          <p className="text-sm text-gray-600">No sabes cómo hacer que la gente llegue a ti</p>
                          {selectedOption === "prospectos" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto lo resolvemos por ti</p>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOption("seguimiento");
                          handleProblemSelect("seguimiento");
                        }}
                        className={`w-full flex items-start gap-4 p-6 bg-white border-2 rounded-xl transition-all text-left ${
                          selectedOption === "seguimiento"
                            ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Dar seguimiento</h3>
                          <p className="text-sm text-gray-600">Se te enfrían los prospectos o no sabes qué decirles</p>
                          {selectedOption === "seguimiento" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto lo resolvemos por ti</p>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOption("cerrar");
                          handleProblemSelect("cerrar");
                        }}
                        className={`w-full flex items-start gap-4 p-6 bg-white border-2 rounded-xl transition-all text-left ${
                          selectedOption === "cerrar"
                            ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Cerrar ventas</h3>
                          <p className="text-sm text-gray-600">Hablas con personas… pero no terminan entrando</p>
                          {selectedOption === "cerrar" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto lo resolvemos por ti</p>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOption("todo");
                          handleProblemSelect("todo");
                        }}
                        className={`w-full flex items-start gap-4 p-6 border-2 rounded-xl transition-all text-left relative ${
                          selectedOption === "todo"
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-primary bg-primary/5 hover:shadow-md"
                        }`}
                      >
                        <div className="absolute -top-3 left-4">
                          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Recomendado
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Todo lo anterior</h3>
                          <p className="text-sm text-gray-600">Quiero que todo funcione sin estar encima todo el tiempo</p>
                          {selectedOption === "todo" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto lo resolvemos por ti</p>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Goal Selection */}
                {flowStep === 2 && (
                  <div className="space-y-8 animate-in fade-in duration-700 text-center">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        ¿Qué quieres que <span className="text-primary">cambie</span> en tu negocio ahora mismo?
                      </h2>
                      <p className="text-gray-600">Elige lo que más impacto tendría para ti</p>
                    </div>

                    <div className="space-y-4">
                      {/* Automatizar - Recommended */}
                      <button
                        onClick={() => {
                          setSelectedGoal("automatizar");
                          setTimeout(() => setFlowStep(3), 500);
                        }}
                        className={`w-full flex items-start gap-4 p-6 border-2 rounded-xl transition-all text-left relative ${
                          selectedGoal === "automatizar"
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-primary bg-primary/5 hover:shadow-md"
                        }`}
                      >
                        <div className="absolute -top-3 left-4">
                          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Recomendado
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Automatizar mi negocio</h3>
                          <p className="text-sm text-gray-600">Que funcione incluso cuando no estás conectado</p>
                          {selectedGoal === "automatizar" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto es justo lo que vamos a optimizar por ti</p>
                          )}
                        </div>
                      </button>

                      {/* Escalar */}
                      <button
                        onClick={() => {
                          setSelectedGoal("escalar");
                          setTimeout(() => setFlowStep(3), 500);
                        }}
                        className={`w-full flex items-start gap-4 p-6 bg-white border-2 rounded-xl transition-all text-left ${
                          selectedGoal === "escalar"
                            ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Escalar mis ventas</h3>
                          <p className="text-sm text-gray-600">Generar más ventas sin tener que perseguir gente</p>
                          {selectedGoal === "escalar" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto es justo lo que vamos a optimizar por ti</p>
                          )}
                        </div>
                      </button>

                      {/* Organizar */}
                      <button
                        onClick={() => {
                          setSelectedGoal("organizar");
                          setTimeout(() => setFlowStep(3), 500);
                        }}
                        className={`w-full flex items-start gap-4 p-6 bg-white border-2 rounded-xl transition-all text-left ${
                          selectedGoal === "organizar"
                            ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Organizar mis leads</h3>
                          <p className="text-sm text-gray-600">No perder oportunidades ni olvidar a nadie</p>
                          {selectedGoal === "organizar" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto es justo lo que vamos a optimizar por ti</p>
                          )}
                        </div>
                      </button>

                      {/* Simplificar */}
                      <button
                        onClick={() => {
                          setSelectedGoal("simplificar");
                          setTimeout(() => setFlowStep(3), 500);
                        }}
                        className={`w-full flex items-start gap-4 p-6 bg-white border-2 rounded-xl transition-all text-left ${
                          selectedGoal === "simplificar"
                            ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Simplificar el proceso</h3>
                          <p className="text-sm text-gray-600">Tener un sistema claro que realmente funcione</p>
                          {selectedGoal === "simplificar" && (
                            <p className="text-xs text-primary font-medium mt-2">✓ Esto es justo lo que vamos a optimizar por ti</p>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: System Features */}
                {flowStep === 3 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Todo lo que necesitas para <span className="text-primary">conseguir y cerrar prospectos</span>
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {/* Block 1: Landing Pages */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Atrae prospectos todos los días</h3>
                          <p className="text-sm text-gray-600">Con tu propia página lista para compartir</p>
                        </div>
                      </div>

                      {/* Block 2: Lead Management */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Organiza tus contactos sin perder oportunidades</h3>
                          <p className="text-sm text-gray-600">Todo claro y ordenado en un solo lugar</p>
                        </div>
                      </div>

                      {/* Block 3: Semi-automated Messages - HIGHLIGHTED */}
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-primary/10 to-blue-50 border-2 border-primary rounded-xl shadow-md">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Responde más rápido sin pensar qué decir</h3>
                          <p className="text-sm text-primary font-medium">Mensajes listos, solo das click y se envían</p>
                        </div>
                      </div>

                      {/* Block 4: Content */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Image className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Publica sin complicarte</h3>
                          <p className="text-sm text-gray-600">Contenido listo para atraer personas todos los días</p>
                        </div>
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

                {/* STEP 4: WhatsApp Integration */}
                {flowStep === 4 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Todo el seguimiento ya está <span className="text-primary">listo para ti</span>
                      </h2>
                      <p className="text-gray-600">Mensajes preparados para que solo tengas que dar clic en enviar</p>
                    </div>

                    {/* WhatsApp Mock Visual */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                      {/* WhatsApp Header */}
                      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          JC
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Juan Carlos</p>
                          <p className="text-xs text-gray-500">en línea</p>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="space-y-3 mb-4">
                        {/* Message 1 */}
                        <div className="flex justify-end animate-in slide-in-from-right duration-500">
                          <div className="max-w-[80%]">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                              <p className="text-white text-sm">Hola Juan Carlos 👋 Gracias por tu interés</p>
                            </div>
                            <div className="flex items-center justify-end gap-1 mt-1 pr-2">
                              <p className="text-xs text-gray-400">10:30 AM</p>
                              <div className="flex">
                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                <CheckCircle2 className="w-3 h-3 text-blue-500 -ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message 2 */}
                        <div className="flex justify-end animate-in slide-in-from-right duration-500 delay-300">
                          <div className="max-w-[80%]">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                              <p className="text-white text-sm">Te explico cómo funciona 👇</p>
                            </div>
                            <div className="flex items-center justify-end gap-1 mt-1 pr-2">
                              <p className="text-xs text-gray-400">10:30 AM</p>
                              <div className="flex">
                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                <CheckCircle2 className="w-3 h-3 text-blue-500 -ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Send Button */}
                      <div className="flex justify-center mb-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full font-medium text-sm shadow-md transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          Enviar mensaje
                        </button>
                      </div>

                      {/* Automation Indicator */}
                      <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <p className="text-xs text-gray-500 font-medium">Listo para enviar • Solo 1 clic</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFlowStep(5)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 5: Dashboard */}
                {flowStep === 5 && (
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
                      onClick={() => setFlowStep(6)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 6: Prospect Management */}
                {flowStep === 6 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Responde a tus prospectos <span className="text-primary">sin pensar qué decir</span>
                      </h2>
                      <p className="text-gray-600">Mensajes listos, tú decides cuándo enviarlos</p>
                    </div>

                    {/* Prospects List with Actions */}
                    <div className="space-y-4">
                      {/* Juan Pérez - Nuevo */}
                      <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold">
                              JP
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">Juan Pérez</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                Nuevo
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-primary border-2 border-primary rounded-lg text-sm font-medium transition-colors">
                            Responder
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">💬 <span className="font-medium">Mensaje sugerido:</span></p>
                          <p className="text-sm text-gray-700 mb-3">"Hola Juan 👋 Vi que te interesa viajar más gastando menos. ¿Tienes 5 minutos para que te explique cómo funciona?"</p>
                          <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md">
                            <MessageSquare className="w-4 h-4" />
                            Enviar por WhatsApp
                          </button>
                          <p className="text-xs text-green-700 font-medium mt-2 text-center">✔ Solo das click y el mensaje se envía por ti</p>
                        </div>
                      </div>

                      {/* María López - Contactado */}
                      <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                              ML
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">María López</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                Contactado
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-primary border-2 border-primary rounded-lg text-sm font-medium transition-colors">
                            Ver mensaje
                          </button>
                        </div>
                      </div>

                      {/* Carlos Ruiz - Seguimiento */}
                      <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                              CR
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">Carlos Ruiz</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                                Seguimiento
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-primary border-2 border-primary rounded-lg text-sm font-medium transition-colors">
                            Enviar plantilla
                          </button>
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

                {/* STEP 7: Control Panel */}
                {flowStep === 7 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Así se ve tu negocio cuando <span className="text-primary">todo está bajo control</span>
                      </h2>
                      <p className="text-gray-600">Sabes quién sigue, en qué etapa está y qué hacer en cada momento</p>
                    </div>

                    {/* Dashboard Visual Mock */}
                    <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl p-6 shadow-2xl border border-blue-500/20">
                      {/* KPI Cards */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                          <p className="text-5xl font-bold text-white mb-1">28</p>
                          <p className="text-xs text-blue-200 font-medium">Prospectos</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                          <p className="text-5xl font-bold text-white mb-1">12</p>
                          <p className="text-xs text-blue-200 font-medium">En seguimiento</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
                          <p className="text-5xl font-bold text-white mb-1">6</p>
                          <p className="text-xs text-blue-200 font-medium">Contactados</p>
                        </div>
                      </div>

                      {/* Leads List with Action Buttons */}
                      <div className="space-y-3">
                        {/* Juan Pérez */}
                        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              JP
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">Juan Pérez</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                                🟢 Nuevo
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm">
                            Ver detalle
                          </button>
                        </div>

                        {/* María López */}
                        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              ML
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">María López</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                🔵 Hablando
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm">
                            Continuar
                          </button>
                        </div>

                        {/* Carlos Ruiz */}
                        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              CR
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">Carlos Ruiz</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-400/30">
                                🟠 Por cerrar
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white border border-green-500 rounded-lg text-xs font-semibold transition-colors shadow-md">
                            Enviar mensaje
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Microcopy */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        Todo claro. Sin perder oportunidades.
                      </p>
                    </div>

                    <button
                      onClick={() => setFlowStep(8)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 8: Message Templates */}
                {flowStep === 8 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Ya no tienes que <span className="text-primary">pensar qué decir</span>
                      </h2>
                      <p className="text-gray-600">Mensajes listos para cada momento, solo eliges y envías</p>
                    </div>

                    <div className="space-y-4">
                      {/* Block 1: First Message + Preview */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Primer mensaje listo</h3>
                            <p className="text-sm text-gray-600">Rompe el hielo sin improvisar</p>
                          </div>
                        </div>
                        
                        {/* Message Preview */}
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl rounded-tl-sm p-4 shadow-md">
                          <p className="text-white text-sm leading-relaxed">
                            Hola 👋 Vi que te interesa viajar más gastando menos.<br />
                            ¿Te explico cómo funciona en 2 minutos?
                          </p>
                        </div>
                      </div>

                      {/* Block 2: Follow-up */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Seguimiento estratégico</h3>
                          <p className="text-sm text-gray-600">Para no perder el interés del prospecto</p>
                        </div>
                      </div>

                      {/* Block 3: Closing */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Mensaje de cierre</h3>
                          <p className="text-sm text-gray-600">Cuando la persona ya está lista</p>
                        </div>
                      </div>

                      {/* Block 4: Post-sale */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Star className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Post-venta</h3>
                          <p className="text-sm text-gray-600">Para activar y dar bienvenida correctamente</p>
                        </div>
                      </div>
                    </div>

                    {/* Microcopy */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        Listo para usar. Solo das click y envías.
                      </p>
                    </div>

                    <button
                      onClick={() => setFlowStep(9)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 9: Prospects View */}
                {flowStep === 9 && (
                  <div className="space-y-8 animate-in fade-in duration-700 text-center">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a]">
                        Y puedes ver todos tus <span className="text-[#4285f4]">prospectos</span>
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600">
                        Organizados y listos para dar seguimiento
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#4285f4]/5 to-[#4285f4]/10 rounded-2xl p-6 max-w-2xl mx-auto border border-[#4285f4]/20">
                      <div className="space-y-3">
                        {[
                          { name: userName, status: "Nuevo", color: "[#4285f4]" },
                          { name: "María González", status: "Contactado", color: "green-500" },
                          { name: "Carlos Ruiz", status: "Seguimiento", color: "yellow-500" }
                        ].map((prospect, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-[#1a1a1a]">{prospect.name}</p>
                                <p className={`text-xs text-${prospect.color}`}>{prospect.status}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 10: What You Need */}
                {flowStep === 10 && (
                  <div className="space-y-8 animate-in fade-in duration-700 text-center">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a]">
                        ¿Qué <span className="text-[#4285f4]">necesitas</span>?
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600">
                        Solo esto para empezar
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      {[
                        { icon: MessageSquare, title: "WhatsApp", desc: "Para comunicarte" },
                        { icon: Users, title: "Ganas de crecer", desc: "Actitud positiva" },
                        { icon: Zap, title: "30 min al día", desc: "Para revisar leads" }
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="p-6 bg-white border-2 border-gray-200 rounded-2xl text-center"
                        >
                          <div className="w-16 h-16 bg-[#4285f4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-8 h-8 text-[#4285f4]" />
                          </div>
                          <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 11: Ready to Start */}
                {flowStep === 11 && (
                  <div className="space-y-8 animate-in fade-in duration-700 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a]">
                        {userName}, ya estás <span className="text-[#4285f4]">listo</span>
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        El sistema está configurado y esperando por ti
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#4285f4]/5 to-[#4285f4]/10 rounded-2xl p-8 max-w-2xl mx-auto border border-[#4285f4]/20">
                      <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">
                        Esto es lo que obtienes:
                      </h3>
                      <div className="space-y-3 text-left">
                        {[
                          "Tu página personalizada para captar leads",
                          "Sistema de seguimiento automático",
                          "Plantillas de mensajes listas",
                          "Dashboard para gestionar prospectos",
                          "Contenido listo para publicar",
                          "Plantillas de mensajes listas",
                          "Soporte en español"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#4285f4] shrink-0 mt-0.5" />
                            <p className="text-base text-gray-700">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 12: Offer - Activación */}
                {flowStep === 12 && (
                  <div className="space-y-8 animate-in fade-in duration-700 text-center">
                    <div className="space-y-4">
                      <Badge className="mb-4 bg-[#4285f4]/10 text-[#4285f4] border-[#4285f4]/30 text-base px-4 py-2">
                        Listo para ti
                      </Badge>
                      
                      <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a]">
                        Este sistema es <span className="text-[#4285f4]">para ti</span>
                      </h2>
                      
                      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Te ayuda a conseguir prospectos, dar seguimiento automático y avanzar más rápido sin complicarte
                      </p>
                    </div>

                    <Card className="max-w-md mx-auto bg-white border-2 border-gray-200 shadow-2xl rounded-2xl">
                      <CardContent className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-5xl font-bold text-[#1a1a1a]">$29</span>
                            <span className="text-xl text-gray-600">USD inicio</span>
                          </div>
                          <p className="text-lg text-center text-gray-600">
                            Luego $9 USD/mes
                          </p>
                        </div>

                        <button
                          onClick={() => window.location.href = "/mwr/checkout"}
                          className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                        >
                          Activar mi sistema ahora
                          <ArrowRight className="w-5 h-5" />
                        </button>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Acceso inmediato • Empieza hoy
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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