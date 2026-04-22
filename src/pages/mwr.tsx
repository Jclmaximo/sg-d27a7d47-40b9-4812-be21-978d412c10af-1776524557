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
  Rocket
} from "lucide-react";

export default function MWRPage() {
  const router = useRouter();
  const [showCTA, setShowCTA] = useState(false);
  const [showGamifiedFlow, setShowGamifiedFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(1);
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
      // Save to localStorage
      localStorage.setItem("mwr_quiz_answers", JSON.stringify({ ...answers, desire: answer }));
      setFlowStep(3);
    }
  };

  const closeFlow = () => {
    setShowGamifiedFlow(false);
    setFlowStep(1);
    setAnswers({ challenge: "", desire: "" });
  };

  return (
    <>
      <SEO
        title="Sistema Automatizado MLM | My Work Revolution"
        description="Sistematiza tu negocio MLM con embudo automatizado, CRM con IA y seguimiento inteligente. Prueba 30 días por solo $29 USD."
        image="https://mwr.hubia.vip/og-image.png"
        url="https://mwr.hubia.vip/mwr"
      />

      <div className="min-h-screen bg-background">
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

        {/* Gamified Flow Overlay */}
        {showGamifiedFlow && (
          <div className="fixed inset-0 z-[100] bg-background">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-10">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(flowStep / 4) * 100}%` }}
              />
            </div>

            {/* Step Counter */}
            <div className="fixed top-4 right-4 text-sm text-muted-foreground font-medium z-10">
              {flowStep}/4
            </div>

            {/* Content Container */}
            <div className="h-full flex items-center justify-center px-6 py-20">
              <div className="w-full max-w-2xl mx-auto">
                
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
                            className="w-full p-6 text-lg font-semibold text-left bg-card hover:bg-accent hover:text-accent-foreground border-2 border-border hover:border-primary rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
                            className="w-full p-6 text-lg font-semibold text-left bg-card hover:bg-accent hover:text-accent-foreground border-2 border-border hover:border-primary rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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

                {/* STEP 4: Offer */}
                {flowStep === 4 && (
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
                          <p className="text-lg text-muted-foreground">
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

        {/* Fixed CTA */}
        {showCTA && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="container max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">
                    Sistematiza Tu Negocio MLM Hoy
                  </h3>
                  <p className="text-xs md:text-base text-muted-foreground">
                    Accede al sistema piloto por 30 días • Solo $29 USD
                  </p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => router.push("/mwr/registro")}
                  className="whitespace-nowrap bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 border border-primary/50"
                >
                  Acceder al Sistema Piloto
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}