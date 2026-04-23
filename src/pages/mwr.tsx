import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, CheckCircle2, User, MessageSquare, FileText, Users, Zap, Target, TrendingUp, MessageCircle, CheckCircle, Image, Calendar, Tag, Lock, DollarSign, Clock, Star, Globe, Heart, BarChart3 } from "lucide-react";

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
                  <div className="relative">
                    {/* Hero Content - 2 Columns Desktop */}
                    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left Column - Text & CTA */}
                        <div className="space-y-6 md:space-y-8">
                          <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                              Deja de perder prospectos por{" "}
                              <span className="text-primary">falta de seguimiento</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                              El sistema te muestra a quién escribirle y cuándo hacerlo
                            </p>
                          </div>

                          {/* CTA */}
                          <div className="space-y-4">
                            <button
                              onClick={() => setFlowStep(2)}
                              className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
                            >
                              Ver cómo funciona →
                            </button>
                            
                            {/* Microcopy */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Acceso inmediato</span>
                              <span>•</span>
                              <span>Sin experiencia</span>
                              <span>•</span>
                              <span>Empieza hoy</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="relative md:block hidden">
                          <div className="relative">
                            <img 
                              src="/happy-travelers.jpg" 
                              alt="Sistema de gestión de leads" 
                              className="rounded-2xl shadow-xl w-full max-w-md mx-auto"
                            />
                            {/* WhatsApp Bubble Overlay */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 max-w-xs">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                  <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900 mb-1">Nuevo prospecto</p>
                                  <p className="text-xs text-gray-600">María López acaba de registrarse</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Image - Below text on mobile */}
                    <div className="md:hidden px-4 pb-8">
                      <div className="relative">
                        <img 
                          src="/happy-travelers.jpg" 
                          alt="Sistema de gestión de leads" 
                          className="rounded-2xl shadow-xl w-full"
                        />
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 max-w-xs">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-900 mb-1">Nuevo prospecto</p>
                              <p className="text-xs text-gray-600">María López acaba de registrarse</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Introduction/Transition */}
                {flowStep === 2 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Imagina tener un <span className="text-primary">sistema que trabaja por ti</span>
                      </h2>
                      <p className="text-gray-600">Mientras tú te enfocas en cerrar ventas, el sistema organiza todo automáticamente</p>
                    </div>
                    <button
                      onClick={() => setFlowStep(3)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
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

                    {/* Dashboard Visual Mock - Redesigned */}
                    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
                      {/* KPI Cards */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <p className="text-4xl font-bold text-white mb-1">28</p>
                          <p className="text-xs text-gray-400 font-medium">Prospectos</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <p className="text-4xl font-bold text-white mb-1">12</p>
                          <p className="text-xs text-gray-400 font-medium">En seguimiento</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <p className="text-4xl font-bold text-white mb-1">6</p>
                          <p className="text-xs text-gray-400 font-medium">Contactados</p>
                        </div>
                      </div>

                      {/* Leads List with Action Buttons */}
                      <div className="space-y-3">
                        {/* Juan Pérez */}
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                              JP
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">Juan Pérez</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                                🟢 Nuevo
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 rounded text-xs font-medium transition-colors">
                            Ver detalle
                          </button>
                        </div>

                        {/* María López */}
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              ML
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">María López</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                                🔵 Hablando
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 rounded text-xs font-medium transition-colors">
                            Continuar
                          </button>
                        </div>

                        {/* Carlos Ruiz */}
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                              CR
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">Carlos Ruiz</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-900/50 text-orange-300 border border-orange-700">
                                🟠 Por cerrar
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition-colors">
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

                {/* STEP 9: Objection Handling */}
                {flowStep === 9 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Seguramente te estás <span className="text-primary">preguntando esto</span>
                      </h2>
                      <p className="text-gray-600">Esto es lo que necesitas saber antes de empezar</p>
                    </div>

                    {/* FAQ Blocks */}
                    <div className="space-y-4">
                      {/* Objection 1: Time */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">¿Y si no tengo tiempo?</h3>
                            <p className="text-gray-600 leading-relaxed">No necesitas horas. Solo unos minutos al día para dar seguimiento con mensajes ya listos.</p>
                          </div>
                        </div>
                      </div>

                      {/* Objection 2: Sales Skills */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <MessageSquare className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">¿Y si no sé vender?</h3>
                            <p className="text-gray-600 leading-relaxed">No tienes que saber vender. El sistema te dice exactamente qué enviar.</p>
                          </div>
                        </div>
                      </div>

                      {/* Objection 3: Effectiveness */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">¿Esto realmente funciona?</h3>
                            <p className="text-gray-600 leading-relaxed">Sí. Porque elimina la improvisación y enfoca tus acciones en lo que genera resultados.</p>
                          </div>
                        </div>
                      </div>

                      {/* Objection 4: Manual Work */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <Zap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">¿Tengo que hacer todo manual?</h3>
                            <p className="text-gray-600 leading-relaxed">No. El sistema ya tiene los mensajes listos. Tú solo das click para enviarlos.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Microcopy */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        Simple. Claro. Sin complicaciones.
                      </p>
                    </div>

                    <button
                      onClick={() => setFlowStep(10)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 10: Social Proof */}
                {flowStep === 10 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Personas normales ya están <span className="text-primary">viendo resultados</span>
                      </h2>
                      <p className="text-gray-600">Sin experiencia, sin complicarse y siguiendo el sistema</p>
                    </div>

                    {/* Testimonials */}
                    <div className="space-y-4">
                      {/* Testimonial 1 */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            LC
                          </div>
                          <div>
                            <p className="text-gray-700 leading-relaxed italic mb-2">
                              "Pensé que sería complicado, pero literal solo seguí los pasos y empecé a tener respuestas el mismo día."
                            </p>
                            <p className="text-sm text-gray-500 font-medium">— Laura C.</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 2 */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            MR
                          </div>
                          <div>
                            <p className="text-gray-700 leading-relaxed italic mb-2">
                              "Antes no sabía qué decirle a la gente. Ahora solo uso los mensajes y listo."
                            </p>
                            <p className="text-sm text-gray-500 font-medium">— Miguel R.</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 3 */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            AS
                          </div>
                          <div>
                            <p className="text-gray-700 leading-relaxed italic mb-2">
                              "Lo mejor es que no tienes que inventar nada, todo ya está hecho."
                            </p>
                            <p className="text-sm text-gray-500 font-medium">— Ana S.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Concrete Results */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-4 text-center">Resultados reales:</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 font-medium">Primeros contactos en menos de 24 horas</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 font-medium">Más conversaciones sin esfuerzo</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 font-medium">Seguimiento constante sin olvidar prospectos</p>
                        </div>
                      </div>
                    </div>

                    {/* Microcopy */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        No es teoría. Es lo que ya está funcionando.
                      </p>
                    </div>

                    <button
                      onClick={() => setFlowStep(11)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 11: Value Presentation */}
                {flowStep === 11 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Esto es todo lo que tienes <span className="text-primary">listo desde el día 1</span>
                      </h2>
                      <p className="text-gray-600">Sin configurar, sin complicarte, solo empezar a usarlo</p>
                    </div>

                    {/* Value Blocks */}
                    <div className="space-y-4">
                      {/* Block 1: Landing Page */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Tu propia página para captar prospectos</h3>
                          <p className="text-sm text-gray-600">Lista para compartir y empezar a recibir interesados</p>
                        </div>
                      </div>

                      {/* Block 2: Contact Organization */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Sistema para organizar tus contactos</h3>
                          <p className="text-sm text-gray-600">Todo claro, sin perder oportunidades</p>
                        </div>
                      </div>

                      {/* Block 3: Ready Messages - HIGHLIGHTED */}
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-primary/10 to-blue-50 border-2 border-primary rounded-xl shadow-md">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Mensajes listos para cada etapa</h3>
                          <p className="text-sm text-primary font-medium">No tienes que pensar qué decir, solo dar clic y enviar</p>
                        </div>
                      </div>

                      {/* Block 4: Content */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Image className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Contenido listo para publicar</h3>
                          <p className="text-sm text-gray-600">Imágenes y textos para atraer personas todos los días</p>
                        </div>
                      </div>

                      {/* Block 5: Dashboard */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Panel de control para tu negocio</h3>
                          <p className="text-sm text-gray-600">Sabes qué está pasando en todo momento</p>
                        </div>
                      </div>

                      {/* Block 6: Support */}
                      <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Soporte y acompañamiento</h3>
                          <p className="text-sm text-gray-600">Para que no avances solo</p>
                        </div>
                      </div>
                    </div>

                    {/* Microcopy */}
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600 font-medium">
                        Todo ya está listo. Solo tienes que usarlo.
                      </p>
                      <p className="text-base text-primary font-bold">
                        Lo que normalmente te tomaría semanas… aquí ya lo tienes listo
                      </p>
                    </div>

                    <button
                      onClick={() => setFlowStep(12)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                      Continuar →
                    </button>
                  </div>
                )}

                {/* STEP 12: Pricing */}
                {flowStep === 12 && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Empieza hoy con <span className="text-primary">todo listo</span>
                      </h2>
                      <p className="text-gray-600">No necesitas experiencia. Solo seguir el sistema y enviar los mensajes</p>
                    </div>

                    {/* Single Pricing Card */}
                    <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-8 shadow-2xl border-2 border-primary relative overflow-hidden">
                      {/* Active Offer Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-gray-900">
                          🔥 OFERTA ACTIVA
                        </span>
                      </div>

                      <div className="text-white space-y-6">
                        <div className="text-center">
                          <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-5xl font-bold">$29</span>
                            <span className="text-xl text-yellow-300 font-bold">USD primer mes</span>
                          </div>
                          <p className="text-blue-100 mb-1">Luego $9 USD / mes</p>
                          <p className="text-sm text-white font-semibold mt-3">
                            Acceso completo <span className="text-yellow-300">desde el día 1</span>
                          </p>
                          {/* Perceived Value Line */}
                          <p className="text-xs text-yellow-200/80 mt-2 font-medium">
                            Valor real: $500–$1000 USD
                          </p>
                        </div>

                        {/* Value Anchor */}
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                          <p className="text-sm text-white leading-relaxed text-center">
                            Lo que normalmente te tomaría semanas configurar por tu cuenta…<br />
                            <span className="font-bold">aquí ya lo tienes listo desde el día 1</span>
                          </p>
                        </div>

                        {/* Value Reinforcement */}
                        <div className="space-y-2 pt-2 border-t border-white/20">
                          <p className="text-sm font-semibold">✓ Sin herramientas extra</p>
                          <p className="text-sm font-semibold">✓ Sin procesos complicados</p>
                          <p className="text-sm font-semibold">✓ Sin tener que inventar qué decir</p>
                        </div>

                        <button
                          onClick={() => setFlowStep(13)}
                          className="w-full bg-white hover:bg-gray-100 text-primary py-4 rounded-xl font-bold transition-colors shadow-lg text-lg"
                        >
                          Empezar ahora →
                        </button>
                      </div>
                    </div>

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