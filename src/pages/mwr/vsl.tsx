import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Check, Users, TrendingUp, Zap, Clock } from "lucide-react";

export default function VSLPage() {
  const router = useRouter();
  const [showCTA, setShowCTA] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-show CTA after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCTA(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <SEO 
        title="Sistema MWR - Video Explicativo | Automatiza Tu Negocio MLM"
        description="Descubre en 60 segundos cómo el sistema MWR automatiza la prospección y seguimiento en tu negocio multinivel."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-background text-foreground font-body">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Hero Section with Video */}
        <section className="relative pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => router.push("/mwr")}
              className="mb-8 border-border hover:bg-card"
            >
              ← Volver
            </Button>

            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-card/50 text-primary border-primary/50 backdrop-blur-xl">
                <Clock className="w-3 h-3 mr-1" />
                Solo 60 segundos
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 gradient-text">
                Cómo Funciona el Sistema MWR
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                El sistema que convierte prospectos fríos en conversaciones calientes automáticamente
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/50 text-foreground border-border/50 backdrop-blur-xl">
                  <Users className="w-4 h-4 mr-2" />
                  147 embajadores activos
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/50 text-foreground border-border/50 backdrop-blur-xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  2,847 prospectos generados
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-card/50 text-foreground border-border/50 backdrop-blur-xl">
                  <Zap className="w-4 h-4 mr-2" />
                  89% tasa de respuesta IA
                </Badge>
              </div>
            </div>

            {/* Video Container */}
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl shadow-primary/5">
              <CardContent className="p-0">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-background/30">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="/ChatGPT_Image_20_abr_2026_02_15_20_p.m.png"
                    controls
                    onClick={handleVideoClick}
                  >
                    <source src="/v2_1776702836375-392447068.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>

                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                      <Button
                        size="lg"
                        onClick={handlePlayClick}
                        className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 border-2 border-primary/50 shadow-2xl shadow-primary/20 transform hover:scale-110 transition-all"
                      >
                        <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Points Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8 text-center">
                  Lo que verás en el video
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Embudo Automatizado",
                      description: "Captura prospectos 24/7 sin que tengas que estar presente",
                      icon: Zap
                    },
                    {
                      title: "CRM Inteligente",
                      description: "Organiza y segmenta tus contactos automáticamente",
                      icon: Users
                    },
                    {
                      title: "Mensajes con IA",
                      description: "Genera conversaciones personalizadas que convierten",
                      icon: TrendingUp
                    }
                  ].map((point, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-6 rounded-lg bg-background/30 border border-border/30 hover:border-primary/50 transition-all"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <point.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits List */}
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              ¿Qué incluye el sistema?
            </h2>

            <div className="space-y-4">
              {[
                "Landing page personalizada con tu marca",
                "Formulario de captura optimizado para conversión",
                "CRM integrado para gestionar todos tus prospectos",
                "Notificaciones en tiempo real por email",
                "Dashboard de métricas y análisis",
                "Soporte técnico y actualizaciones incluidas"
              ].map((benefit, index) => (
                <Card 
                  key={index} 
                  className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-secondary/50 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <p className="text-lg">{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Empieza tu prueba de 30 días
            </h2>

            <p className="text-xl text-muted-foreground mb-12">
              Acceso completo al sistema piloto. Si no generas actividad en Tu Negocio MLM, no pagas mensualidad.
            </p>

            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl shadow-primary/5 max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    onClick={() => router.push("/mwr/registro")}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/20 border border-primary/50"
                  >
                    Empezar Ya! - Solo $29 USD
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/mwr")}
                    className="w-full h-12 border-2 border-border hover:bg-card"
                  >
                    Volver a la página principal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary" />
                <span>Garantía de 30 días</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary" />
                <span>Cancela cuando quieras</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary" />
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky CTA Bar */}
        {showCTA && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl shadow-background/20 animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="font-heading font-semibold text-lg">
                    ¿Listo para automatizar tu negocio?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Únete a 147 embajadores activos
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => router.push("/mwr/registro")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 border border-primary/50 min-w-[240px]"
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