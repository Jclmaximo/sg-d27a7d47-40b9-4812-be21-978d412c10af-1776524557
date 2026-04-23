import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import {
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  Target,
  BarChart3,
  Clock,
  Rocket,
  User,
  MessageSquare,
  FileText
} from "lucide-react";

export default function MWRPage() {
  const router = useRouter();
  const [showCTA, setShowCTA] = useState(false);
  const [showCoverImage, setShowCoverImage] = useState(true);
  const [showGamifiedFlow, setShowGamifiedFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState({
    challenge: "",
    desire: ""
  });

  // Auto-show CTA after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCTA(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = (step: number, answer: string) => {
    if (step === 1) {
      setAnswers({ ...answers, challenge: answer });
      setFlowStep(2);
    } else if (step === 2) {
      setAnswers({ ...answers, desire: answer });
      localStorage.setItem("mwr_quiz_answers", JSON.stringify({ ...answers, desire: answer }));
      setFlowStep(3);
    }
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem("mwr_user_name", name);
    setFlowStep(5); // Skip to demo after step 4
  };

  const closeFlow = () => {
    setShowGamifiedFlow(false);
    setFlowStep(1);
    setAnswers({ challenge: "", desire: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="MWR - Sistema Automatizado de Leads"
        description="Sistema completo para conseguir prospectos, dar seguimiento automático y cerrar ventas"
      />

      {/* COVER IMAGE - Initial Screen */}
      {showCoverImage && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full">
              {/* Main Image */}
              <img
                src="/ChatGPT_Image_22_abr_2026_05_50_11_p.m.png"
                alt="Sistema MWR"
                className="w-full h-auto"
              />
              
              {/* Clickable Button Area - positioned over the blue button in the image */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Gradient Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 backdrop-blur-sm border border-border/50 text-foreground">
                <Users className="w-4 h-4 mr-2 text-primary" />
                147 embajadores activos
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 backdrop-blur-sm border border-border/50 text-foreground">
                <TrendingUp className="w-4 h-4 mr-2 text-secondary" />
                2,847 prospectos generados
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/80 backdrop-blur-sm border border-border/50 text-foreground">
                <Zap className="w-4 h-4 mr-2 text-accent" />
                89% tasa de respuesta IA
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
              Haz Crecer Tu Negocio MLM con un Sistema Automático
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Embudo configurado + CRM con IA + Seguimiento inteligente.
              <span className="block mt-2 text-foreground font-semibold">Todo listo para usar hoy.</span>
            </p>

            {/* Hero Video Button */}
            <div className="flex justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => setShowGamifiedFlow(true)}
                className="h-16 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 border border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Ver Cómo Funciona (60 seg)
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              🎯 Genera 3-5 prospectos diarios en piloto automático
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/30">
                El Problema
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                ¿Por Qué el 97% de los Networkers Abandona en el Primer Año?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Sin tiempo para contactar",
                  description: "Pierdes horas escribiendo mensajes manuales a prospectos fríos"
                },
                {
                  icon: Target,
                  title: "Seguimiento caótico",
                  description: "No sabes a quién contactaste, cuándo ni qué dijiste la última vez"
                },
                {
                  icon: BarChart3,
                  title: "Cero duplicación",
                  description: "Tu equipo no tiene un sistema simple que puedan replicar"
                }
              ].map((item, i) => (
                <Card key={i} className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/30">
                La Solución
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                El Sistema Que Trabaja Mientras Duermes
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Rocket,
                  title: "Embudo automatizado",
                  description: "Landing pages que capturan prospectos 24/7 sin que tengas que hacer nada",
                  color: "primary"
                },
                {
                  icon: Zap,
                  title: "CRM inteligente",
                  description: "Organiza, da seguimiento y notifica cuándo cada prospecto está listo",
                  color: "accent"
                },
                {
                  icon: Sparkles,
                  title: "IA que genera mensajes",
                  description: "Respuestas personalizadas automáticas que suenan 100% humanas",
                  color: "secondary"
                }
              ].map((item, i) => (
                <Card key={i} className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-xl bg-${item.color}/10 flex items-center justify-center mb-6 group-hover:bg-${item.color}/20 transition-colors`}>
                      <item.icon className={`w-7 h-7 text-${item.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Lo Que Logras Con el Sistema
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "3-5 prospectos calificados diarios",
                  description: "Sin publicar spam ni perseguir amigos. El sistema atrae personas que YA buscan lo que ofreces."
                },
                {
                  title: "Automatiza el 80% del seguimiento",
                  description: "La IA contesta preguntas frecuentes, agenda llamadas y te avisa solo cuando el prospecto está listo."
                },
                {
                  title: "Duplica tu sistema en tu equipo",
                  description: "Tus referidos obtienen su propio embudo personalizado con un clic. Crecimiento exponencial garantizado."
                }
              ].map((item, i) => (
                <Card key={i} className="glass-card border-border/50 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/30 text-sm md:text-base px-4 py-2">
              Oferta de Lanzamiento
            </Badge>
          </div>

          {/* CTA Section */}
          <section className="py-32 px-4 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            
            <div className="container relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Prueba el sistema 30 días
                </h2>
                
                <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
                  Acceso completo al sistema piloto. Si no generas actividad en Tu Negocio MLM, no pagas mensualidad.
                </p>

                <Card className="glass-card border-border/50 shadow-2xl max-w-md mx-auto">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <Button 
                        size="lg"
                        onClick={() => router.push("/mwr/registro")}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-xl shadow-primary/20 border border-primary/50"
                      >
                        Empezar Ya! - Solo $29 USD
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      
                      {/* Video Button */}
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => router.push("/mwr/vsl")}
                        className="w-full h-12 border-2 border-border bg-card/50 hover:bg-card/80 text-foreground hover:text-primary text-base font-semibold backdrop-blur-sm"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Ver Video de 60 Segundos
                      </Button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span>Garantía de 30 días</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Gamified Flow Overlay */}
      {showGamifiedFlow && (
        <div className="fixed inset-0 z-[100] bg-background">
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-10">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(flowStep / 11) * 100}%` }}
            />
          </div>

          {/* Phase Indicator */}
          <div className="fixed top-4 right-4 text-sm text-muted-foreground font-medium z-10">
            {flowStep <= 4 ? "Paso" : "Demo"} {flowStep}/11
          </div>

          {/* Content Container */}
          <div className="h-full overflow-y-auto flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-2xl mx-auto my-auto">
              
              {/* STEP 1: Challenge */}
              {flowStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                      Responde esto rápido
                    </h2>
                    <p className="text-xl text-muted-foreground">(30 segundos)</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground text-center mb-8">
                      ¿Qué es lo que más te cuesta hoy?
                    </h3>

                    <div className="grid gap-4">
                      {[
                        "Conseguir prospectos",
                        "Dar seguimiento",
                        "Cerrar ventas",
                        "Todo"
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(1, option)}
                          className="w-full p-6 bg-card hover:bg-accent hover:text-accent-foreground border-2 border-border hover:border-primary rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Desire */}
              {flowStep === 2 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground text-center mb-8">
                      ¿Qué te gustaría que pasara?
                    </h3>

                    <div className="grid gap-4">
                      {[
                        "Tener prospectos todos los días",
                        "Automatizar respuestas",
                        "Dejar de perseguir gente",
                        "Generar ingresos constantes"
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(2, option)}
                          className="w-full p-6 bg-card hover:bg-accent hover:text-accent-foreground border-2 border-border hover:border-primary rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Validation */}
              {flowStep === 3 && (
                <div className="space-y-12 animate-in fade-in duration-500 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-secondary" />
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                      Perfecto.
                    </h2>
                    
                    <p className="text-2xl text-foreground font-medium">
                      Eso es exactamente lo que este sistema hace por ti.
                    </p>
                    
                    <p className="text-xl text-muted-foreground">
                      Ya dejamos listo todo para que funcione a tu favor
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setFlowStep(4)}
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* STEP 4: Value Summary + Name Capture */}
              {flowStep === 4 && (
                <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Esto es lo que ya tienes listo
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                      No tienes que crear nada. Todo ya viene preparado para empezar.
                    </p>
                  </div>

                  <div className="text-center space-y-6">
                    <p className="text-xl md:text-2xl font-semibold text-foreground mb-8">
                      Literalmente entras y ya está funcionando.
                    </p>

                    <div className="space-y-4 max-w-md mx-auto">
                      <p className="text-lg text-muted-foreground">
                        Dime tu nombre para mostrarte cómo funciona:
                      </p>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        className="w-full h-14 px-6 bg-card border-2 border-border rounded-xl text-foreground text-lg focus:border-primary focus:outline-none transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            handleNameSubmit(e.currentTarget.value.trim());
                          }
                        }}
                      />
                      <Button
                        size="lg"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input?.value.trim()) {
                            handleNameSubmit(input.value.trim());
                          }
                        }}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                      >
                        Ver cómo funciona
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Demo - Momento WOW */}
              {flowStep === 5 && (
                <div className="space-y-12 animate-in fade-in duration-700 text-center">
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                      Listo. Esto acaba de pasar
                    </h2>
                    
                    <p className="text-xl text-muted-foreground">
                      Acabas de entrar como prospecto dentro del sistema
                    </p>
                  </div>

                  <Card className="max-w-md mx-auto bg-card border-border/50 shadow-2xl">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-foreground">{userName}</h3>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                            Nuevo
                          </Badge>
                        </div>
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estado:</span>
                          <span className="text-foreground font-medium">Nuevo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Origen:</span>
                          <span className="text-foreground font-medium">Landing</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-center text-lg text-muted-foreground italic">
                    Así es como empieza todo automáticamente
                  </p>

                  <Button
                    size="lg"
                    onClick={() => setFlowStep(6)}
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* STEP 6: Demo - Seguimiento Automático */}
              {flowStep === 6 && (
                <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Así se le da seguimiento automáticamente
                    </h2>
                  </div>

                  <div className="max-w-md mx-auto">
                    <Card className="bg-[#075E54] border-0 shadow-2xl">
                      <CardContent className="p-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <p className="text-gray-900 text-base">
                            Hola {userName} 👋
                          </p>
                          <p className="text-gray-900 text-base">
                            Vi que te interesa mejorar tus resultados.
                          </p>
                          <p className="text-gray-900 text-base">
                            Te explico rápido cómo funciona...
                          </p>
                          <p className="text-xs text-gray-500 text-right mt-2">
                            Justo ahora
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="text-center text-lg text-muted-foreground italic">
                    Este mensaje se envía sin que tengas que escribir nada
                  </p>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setFlowStep(7)}
                      className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 7: Demo - Control del Lead */}
              {flowStep === 7 && (
                <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Y desde aquí tú tienes el control
                    </h2>
                  </div>

                  <Card className="max-w-lg mx-auto bg-card border-border/50 shadow-2xl">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <User className="w-10 h-10 text-primary" />
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{userName}</h3>
                          <p className="text-sm text-muted-foreground">Lead activo</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button className="w-full p-4 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-xl text-left transition-colors">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                            <span className="text-foreground font-medium">Cambiar estado → "Contactado"</span>
                          </div>
                        </button>

                        <button className="w-full p-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl text-left transition-colors">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-accent" />
                            <span className="text-foreground font-medium">Agregar nota → "Le interesa empezar hoy"</span>
                          </div>
                        </button>

                        <button className="w-full p-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-left transition-colors">
                          <div className="flex items-center gap-3">
                            <ArrowRight className="w-5 h-5 text-primary" />
                            <span className="text-foreground font-medium">Continuar conversación</span>
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-center text-lg text-muted-foreground italic">
                    Todo en un solo lugar, sin complicarte
                  </p>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setFlowStep(8)}
                      className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 8: Demo - Recursos Listos */}
              {flowStep === 8 && (
                <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Y cuando no sabes qué enviar…
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6 text-center space-y-3">
                        <MessageSquare className="w-10 h-10 mx-auto text-secondary" />
                        <h3 className="font-bold text-foreground">Mensajes listos</h3>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6 text-center space-y-3">
                        <Sparkles className="w-10 h-10 mx-auto text-secondary" />
                        <h3 className="font-bold text-foreground">Imágenes para publicar</h3>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6 text-center space-y-3">
                        <FileText className="w-10 h-10 mx-auto text-secondary" />
                        <h3 className="font-bold text-foreground">Textos para redes</h3>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6 text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 mx-auto text-secondary" />
                        <h3 className="font-bold text-foreground">Respuestas WhatsApp</h3>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="text-center text-lg text-muted-foreground italic">
                    Solo copias, pegas y listo
                  </p>

                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setFlowStep(9)}
                      className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 9: Demo - Conexión Emocional */}
              {flowStep === 9 && (
                <div className="space-y-12 animate-in fade-in duration-700 text-center">
                  <div className="space-y-8 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                      Lo que acabas de ver…<br/>
                      es exactamente lo que vivirán tus prospectos
                    </h2>
                    
                    <p className="text-2xl text-muted-foreground">
                      Mientras tú haces tu negocio, esto trabaja por ti
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setFlowStep(10)}
                    className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* STEP 10: Demo - Transición */}
              {flowStep === 10 && (
                <div className="space-y-12 animate-in fade-in duration-700 text-center">
                  <div className="space-y-8 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                      Ahora imagina esto funcionando para ti
                    </h2>
                    
                    <p className="text-2xl text-muted-foreground">
                      Prospectos llegando, seguimiento automático y todo organizado
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setFlowStep(11)}
                    className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg font-semibold shadow-xl shadow-secondary/20"
                  >
                    Ver mi oferta
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* STEP 11: Offer - Activación */}
              {flowStep === 11 && (
                <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="text-center space-y-6">
                    <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/30 text-base px-4 py-2">
                      Listo para ti
                    </Badge>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                      Este sistema es para ti
                    </h2>
                    
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Te ayuda a conseguir prospectos, dar seguimiento automático y avanzar más rápido sin complicarte
                    </p>
                  </div>

                  <Card className="glass-card border-border/50 shadow-2xl max-w-md mx-auto">
                    <CardContent className="p-8 space-y-6">
                      <div className="text-center space-y-2">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-5xl font-bold text-foreground">$29</span>
                          <span className="text-xl text-muted-foreground">USD inicio</span>
                        </div>
                        <p className="text-lg text-center text-muted-foreground">
                          Luego $9 USD/mes
                        </p>
                      </div>

                      <Button
                        size="lg"
                        onClick={() => router.push("/mwr/registro")}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-xl shadow-primary/20"
                      >
                        Activar mi sistema ahora
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>

                      <p className="text-sm text-center text-muted-foreground">
                        Acceso inmediato • Empieza hoy
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

            </div>
          </div>

          {/* Close button (only show on step 1) */}
          {flowStep === 1 && (
            <button
              onClick={closeFlow}
              className="fixed top-4 left-4 w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors z-10"
            >
              <span className="text-2xl text-muted-foreground">×</span>
            </button>
          )}
        </div>
      )}

      {/* Fixed CTA Footer */}
      {showCTA && !showGamifiedFlow && showCoverImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-white py-3 px-4 md:p-6 shadow-2xl z-40 animate-in slide-in-from-bottom duration-500">
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
    </div>
  );
}