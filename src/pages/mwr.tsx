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
      <SEO 
        title="MWR - Sistema de Marketing Automatizado"
        description="Descubre cómo automatizar tu negocio de network marketing con nuestro sistema completo"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          <div className="space-y-12">
            {/* Progress Indicator */}
            <div className="text-center">
              <div className="mb-8 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Demo {flowStep}/13
                </p>
              </div>
            </div>

            {/* Flow Steps */}
            <div className="space-y-12">
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
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 aspect-square flex items-center justify-center">
                        <p className="text-center font-semibold text-gray-900">Viaja más,<br />vive más</p>
                      </div>
                      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 aspect-square flex items-center justify-center">
                        <p className="text-center font-semibold text-gray-900">Tu próxima<br />aventura<br />te espera</p>
                      </div>
                      <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl p-6 aspect-square flex items-center justify-center">
                        <p className="text-center font-semibold text-gray-900">Descubre<br />lugares<br />increíbles</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 aspect-square flex items-center justify-center">
                        <p className="text-center font-semibold text-gray-900">Vive<br />experiencias<br />únicas</p>
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

              {/* STEP 9-13: Continue with existing content */}
              {flowStep === 9 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Mira cómo se ve <span className="text-primary">tu panel</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => setFlowStep(10)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {flowStep === 10 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Otros ya están <span className="text-primary">usando esto</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => setFlowStep(11)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {flowStep === 11 && (
                <div className="space-y-8 animate-in fade-in duration-700 text-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Ya estás <span className="text-primary">listo</span> para empezar
                    </h2>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">El sistema incluye:</h3>
                    <div className="space-y-2 text-left">
                      {[
                        "Páginas personalizadas",
                        "Seguimiento automático por WhatsApp",
                        "Dashboard para gestionar prospectos",
                        "Contenido listo para publicar",
                        "Plantillas de mensajes listas",
                        "Soporte en español"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setFlowStep(12)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {flowStep === 12 && (
                <div className="space-y-8 animate-in fade-in duration-700 text-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Este sistema es <span className="text-primary">para ti</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                      Te ayuda a conseguir prospectos, dar seguimiento automático y avanzar más rápido sin complicarte
                    </p>
                  </div>

                  <button
                    onClick={() => setFlowStep(13)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {flowStep === 13 && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Activa tu <span className="text-primary">sistema ahora</span>
                    </h2>
                  </div>
                  <Button 
                    onClick={() => window.location.href = "/mwr/checkout"}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg"
                  >
                    Activar mi sistema →
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}