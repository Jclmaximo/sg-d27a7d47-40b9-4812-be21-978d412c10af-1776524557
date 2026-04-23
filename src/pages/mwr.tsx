import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, CheckCircle2, User, MessageSquare, FileText, Users, Zap, Target, TrendingUp, MessageCircle, CheckCircle, Image, Calendar, Tag, Lock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function MWRFunnel() {
  const [flowStep, setFlowStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  const handleProblemSelect = (problem: string) => {
    setSelectedProblem(problem);
    setTimeout(() => setFlowStep(2), 500);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [flowStep]);

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative">
              {/* Progress indicator */}
              <div className="mb-8 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Demo {flowStep}/13
                </p>
              </div>

              {/* Initial Hero Screen */}
              {flowStep === 0 && (
                <div className="space-y-8 animate-in fade-in duration-700 text-center py-12">
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                      Descubre el <span className="text-primary">sistema completo</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                      Que atrae, convierte y cierra por ti mientras duermes
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-32 h-32 text-primary" />
                    </div>
                  </div>

                  <button
                    onClick={() => setFlowStep(1)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Empezar demo <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 1: Challenge Selection */}
              {flowStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-700 text-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
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
                      El sistema <span className="text-primary">incluye</span>:
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Páginas personalizadas para captar prospectos</h3>
                        <p className="text-sm text-gray-600">Landing pages optimizadas que convierten visitantes en leads</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Gestión automatizada de leads</h3>
                        <p className="text-sm text-gray-600">Organiza y clasifica automáticamente tus prospectos</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Seguimiento automático vía WhatsApp</h3>
                        <p className="text-sm text-gray-600">El sistema responde y da seguimiento por ti</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-white border-2 border-gray-200 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Image className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Contenido listo para publicar</h3>
                        <p className="text-sm text-gray-600">Imágenes + copies diseñados para atraer prospectos</p>
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
                      Todo el seguimiento es <span className="text-primary">automático</span>
                    </h2>
                    <p className="text-gray-600">Sin hacer nada tú, el sistema responde y da seguimiento automáticamente</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-full max-w-md bg-white rounded-2xl p-8 border-2 border-gray-200">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                          <MessageSquare className="w-10 h-10 text-green-600" />
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="font-semibold text-gray-900">WhatsApp Automático 24/7</h3>
                        <p className="text-sm text-gray-600">El sistema responde, califica y da seguimiento sin que tengas que hacer nada</p>
                      </div>
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

              {/* STEP 5: Content Ready */}
              {flowStep === 5 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Además, ya tienes <span className="text-primary">contenido listo</span>
                    </h2>
                    <p className="text-gray-600">Para atraer prospectos todos los días sin pensar qué publicar</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-xl overflow-hidden aspect-square">
                        <img 
                          src="/marketing/ig-post-descubre.png" 
                          alt="Post: Descubre viajes exclusivos"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-xl overflow-hidden aspect-square">
                        <img 
                          src="/marketing/ig-post-ahorro.png" 
                          alt="Post: Ahorra en cada viaje"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-xl overflow-hidden aspect-square">
                        <img 
                          src="/marketing/fb-post-beneficios.png" 
                          alt="Post: Beneficios exclusivos"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-xl overflow-hidden aspect-square">
                        <img 
                          src="/marketing/wa-compartir.png" 
                          alt="Post: Comparte y gana"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">Contenido diseñado para generar interacción</p>
                  </div>

                  <button
                    onClick={() => setFlowStep(6)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* STEP 6: Messages Ready */}
              {flowStep === 6 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Y también <span className="text-primary">mensajes listos</span> para enviar
                    </h2>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                      <p className="text-gray-900 mb-3">
                        ¿Listo para tu próxima aventura?<br />
                        Descubre destinos increíbles y vive experiencias únicas.<br />
                        Nosotros te ayudamos a hacerlo realidad ✈️🌍
                      </p>
                      <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                        Copiar texto
                      </button>
                    </div>
                    <p className="text-center text-sm text-gray-600">Ahorra tiempo y comunica como un profesional</p>
                  </div>

                  <button
                    onClick={() => setFlowStep(7)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* STEP 7: Dashboard */}
              {flowStep === 7 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Panel de control <span className="text-primary">centralizado</span>
                    </h2>
                    <p className="text-gray-600">Todo en un solo lugar, sin perder oportunidades</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
                    <img 
                      src="/dashboard-banner-clean.jpg" 
                      alt="Dashboard preview"
                      className="w-full rounded-xl"
                    />
                  </div>

                  <button
                    onClick={() => setFlowStep(8)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* STEP 8: Results */}
              {flowStep === 8 && (
                <div className="space-y-8 animate-in fade-in duration-700 text-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Esto es lo que <span className="text-primary">obtienes</span>
                    </h2>
                    <p className="text-gray-600">Un sistema completo que funciona por ti</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Páginas personalizadas que captan prospectos</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Gestión automatizada de leads</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Seguimiento automático 24/7</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Dashboard completo con toda tu información</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Contenido listo para publicar</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">Plantillas de mensajes listas</p>
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

              {/* STEP 9: Prospects View */}
              {flowStep === 9 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Mira cómo se ve <span className="text-primary">tu panel</span>
                    </h2>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
                    <img 
                      src="/dashboard-banner-clean.jpg" 
                      alt="Panel de prospectos"
                      className="w-full rounded-xl"
                    />
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
                      Más de <span className="text-primary">1,500 miembros</span> activos
                    </h2>
                    <p className="text-gray-600">Generando resultados todos los días</p>
                  </div>

                  <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    <div className="text-center space-y-4">
                      <p className="text-4xl font-bold text-primary">$2,813,359</p>
                      <p className="text-gray-600">Ahorrados por miembros en 2024</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setFlowStep(11)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* STEP 11: Ready to Start */}
              {flowStep === 11 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Ya estás <span className="text-primary">listo</span> para empezar
                    </h2>
                    <p className="text-gray-600">Esto es lo que obtienes hoy</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 space-y-3">
                    {[
                      "Sistema de captura automatizado",
                      "Páginas personalizadas para prospectos",
                      "Seguimiento automático por WhatsApp",
                      "Dashboard para gestionar prospectos",
                      "Contenido listo para publicar",
                      "Plantillas de mensajes listas",
                      "Soporte en español"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setFlowStep(12)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* STEP 12: Offer - Activación */}
              {flowStep === 12 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Este sistema es <span className="text-primary">para ti</span> si:
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Quieres generar ingresos en dólares",
                      "No quieres perseguir gente",
                      "Buscas un sistema que funcione 24/7",
                      "Quieres resultados predecibles"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-gray-900 font-medium">{item}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setFlowStep(13)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* STEP 13: Checkout */}
              {flowStep === 13 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Activa tu <span className="text-primary">sistema ahora</span>
                    </h2>
                    <p className="text-gray-600">Elige tu plan y empieza hoy mismo</p>
                  </div>

                  <div className="space-y-4">
                    {/* Annual Plan */}
                    <div className="relative bg-white rounded-2xl p-6 border-2 border-primary shadow-lg">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                          MÁS ELEGIDO 🔥
                        </span>
                      </div>
                      <div className="text-center space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-600">Plan Anual</p>
                        <p className="text-4xl font-bold text-gray-900">$97 <span className="text-lg text-gray-600">USD</span></p>
                        <p className="text-sm text-primary font-medium">≈ $0.27 USD al día</p>
                        <p className="text-xs text-green-600">Ahorra $19 vs plan mensual</p>
                      </div>
                      <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-colors">
                        Activar Plan Anual
                      </button>
                    </div>

                    {/* Monthly Plan */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                      <div className="text-center space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-600">Plan Mensual</p>
                        <p className="text-4xl font-bold text-gray-900">$9.67 <span className="text-lg text-gray-600">USD</span></p>
                        <p className="text-sm text-gray-600">≈ Menos de $1 USD al día</p>
                      </div>
                      <button className="w-full bg-white hover:bg-gray-50 border-2 border-primary text-primary py-3 rounded-xl font-semibold transition-colors">
                        Activar Plan Mensual
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}