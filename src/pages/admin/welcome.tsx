import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Sparkles, Copy, CheckCircle, ArrowRight, Users, TrendingUp, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin");
        return;
      }

      // Get user profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (!profile?.username) {
        router.push("/admin/onboarding");
        return;
      }

      setUsername(profile.username);
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/pricing?ref=${profile.username}`);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar tu perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "¡Link copiado!",
      description: "Ya puedes compartirlo en WhatsApp, Instagram, etc."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <Sparkles className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="¡Bienvenido a Viaja Ligero! 🎉" />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-12">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              ¡Bienvenido a Viaja Ligero! 🎉
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tu cuenta está activa y lista para generar ingresos. Aquí está todo lo que necesitas para empezar.
            </p>
          </div>

          {/* Referral Link Card - DESTACADO */}
          <Card className="border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Tu Link de Referido</CardTitle>
              </div>
              <CardDescription className="text-base">
                Comparte este link para ganar comisiones del 30% por cada referido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border-2 border-primary/20">
                <p className="font-mono text-sm break-all text-primary font-semibold">
                  {referralLink}
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full"
                onClick={copyLink}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar Link
                  </>
                )}
              </Button>
              <div className="grid md:grid-cols-3 gap-3 pt-4">
                <div className="text-center p-3 bg-background rounded-lg border">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">30%</p>
                  <p className="text-xs text-muted-foreground">Comisión</p>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <Gift className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-secondary">$4.74</p>
                  <p className="text-xs text-muted-foreground">Por referido</p>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-accent">Ilimitados</p>
                  <p className="text-xs text-muted-foreground">Referidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🚀 Guía Rápida de Inicio</CardTitle>
              <CardDescription>Sigue estos 3 pasos para empezar a generar ingresos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Copia tu link de referido</h3>
                  <p className="text-muted-foreground">
                    Haz click en "Copiar Link" arriba. Este es tu link único que te identifica como embajador.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Comparte tu link</h3>
                  <p className="text-muted-foreground mb-2">
                    Envía tu link por WhatsApp, Instagram, Facebook, email o cualquier otro canal.
                  </p>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">💬 Mensaje sugerido:</p>
                    <p className="text-muted-foreground italic">
                      "¡Hola! Te invito a Viaja Ligero 🌍✈️ - Accede a viajes exclusivos con descuentos increíbles. 
                      Solo $15.80 USD con el cupón SUPER80. {referralLink}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Gana comisiones</h3>
                  <p className="text-muted-foreground">
                    Cada vez que alguien se registre y pague usando tu link, ganas $4.74 USD (30% de comisión). 
                    Todas tus comisiones las puedes ver en tu Dashboard de Red.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">✨ Lo que incluye tu membresía</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Embudo de ventas personalizado</p>
                    <p className="text-sm text-muted-foreground">Tu propia página para captar leads</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Panel de gestión de leads</p>
                    <p className="text-sm text-muted-foreground">Organiza todos tus prospectos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Templates de WhatsApp</p>
                    <p className="text-sm text-muted-foreground">5 mensajes listos para usar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Dashboard de red</p>
                    <p className="text-sm text-muted-foreground">Visualiza tus referidos y comisiones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Sistema de notas</p>
                    <p className="text-sm text-muted-foreground">Registra seguimiento detallado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Soporte incluido</p>
                    <p className="text-sm text-muted-foreground">Asistencia vía WhatsApp</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={() => router.push("/admin/network")}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Ver mi Dashboard de Red
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/admin/dashboard")}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Ir a Gestión de Leads
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>¿Tienes dudas? Contáctanos por WhatsApp al soporte técnico</p>
          </div>
        </div>
      </div>
    </>
  );
}