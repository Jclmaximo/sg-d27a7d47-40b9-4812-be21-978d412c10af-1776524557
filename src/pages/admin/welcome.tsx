import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Sparkles, Copy, CheckCircle, ArrowRight, Users, TrendingUp, Gift, ExternalLink, LayoutDashboard, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [funnelLink, setFunnelLink] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

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
      setFunnelLink(`${baseUrl}/ambassador/${profile.username}`);
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

  const copyFunnelLink = () => {
    navigator.clipboard.writeText(funnelLink);
    setCopiedFunnel(true);
    toast({
      title: "¡Link copiado!",
      description: "Link de tu embudo copiado al portapapeles"
    });
    setTimeout(() => setCopiedFunnel(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    toast({
      title: "¡Link copiado!",
      description: "Link de referidos copiado al portapapeles"
    });
    setTimeout(() => setCopiedReferral(false), 2000);
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
              ¡Tu Embudo de Ventas está Listo! 🎉
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ya tienes tu herramienta profesional para captar y convertir prospectos en miembros del club de viajes.
            </p>
          </div>

          {/* Funnel Link Card - DESTACADO */}
          <Card className="border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Tu Embudo Personalizado</CardTitle>
              </div>
              <CardDescription className="text-base">
                Comparte este embudo para captar leads interesados en el club de viajes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border-2 border-primary/20">
                <p className="font-mono text-sm break-all text-primary font-semibold">
                  {funnelLink}
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full"
                onClick={copyFunnelLink}
              >
                {copiedFunnel ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar Link del Embudo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🚀 Cómo Usar tu Embudo de Ventas</CardTitle>
              <CardDescription>Sigue estos 3 pasos para empezar a captar leads y cerrar ventas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 - EMBUDO */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Comparte tu embudo personalizado</h3>
                  <p className="text-muted-foreground mb-3">
                    Tu embudo captura leads automáticamente. Cada persona que complete el formulario aparecerá en tu admin de leads.
                  </p>
                  <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
                    <p className="font-medium mb-1">💬 Mensaje sugerido:</p>
                    <p className="text-muted-foreground italic">
                      "¡Hola! 🌍✈️ ¿Te gustaría viajar más pagando menos? Te comparto info sobre el club de viajes con mejores tarifas que encontré. Echa un vistazo: {funnelLink}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 - ADMIN LEADS */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Gestiona tus leads</h3>
                  <p className="text-muted-foreground mb-2">
                    En tu Admin de Leads verás todos los prospectos capturados. Puedes:
                  </p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Filtrar por nivel de interés (Ahorrar / Ganar / Ambas)</li>
                    <li>• Ver datos de contacto (WhatsApp, email)</li>
                    <li>• Marcar status (Nuevo / Contactado / Negociación / Cerrado / Perdido)</li>
                    <li>• Agregar notas de seguimiento</li>
                    <li>• Usar templates de WhatsApp listos</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 - CERRAR VENTAS */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Cierra ventas y gana comisiones</h3>
                  <p className="text-muted-foreground mb-2">
                    Cuando alguien se registre y pague usando tu link de referidos del funnel (abajo), recibes:
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="text-center p-3 bg-background rounded-lg border">
                      <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-primary">50%</p>
                      <p className="text-xs text-muted-foreground">Comisión</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg border">
                      <Gift className="w-6 h-6 text-secondary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-secondary">$39.50</p>
                      <p className="text-xs text-muted-foreground">Por venta</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">✨ Lo que incluye tu embudo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Embudo de captura personalizado</p>
                    <p className="text-sm text-muted-foreground">Con tu marca y link único</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Panel de gestión de leads</p>
                    <p className="text-sm text-muted-foreground">Organiza y da seguimiento</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Templates de WhatsApp</p>
                    <p className="text-sm text-muted-foreground">5 mensajes pre-escritos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Sistema de notas</p>
                    <p className="text-sm text-muted-foreground">Registra cada interacción</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Link de referidos</p>
                    <p className="text-sm text-muted-foreground">Crece tu equipo de embajadores</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Panel de comisiones</p>
                    <p className="text-sm text-muted-foreground">Rastrea tus ganancias</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Link Card - SECUNDARIO */}
          <Card className="border border-muted-foreground/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Link de Referidos del Funnel</CardTitle>
              </div>
              <CardDescription>
                Comparte este link con otros miembros de tu equipo que quieran su propio embudo (ganas $39.50 por cada uno)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg border">
                <p className="font-mono text-xs break-all text-muted-foreground">
                  {referralLink}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full"
                onClick={copyReferralLink}
              >
                {copiedReferral ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link de Referidos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* CTA Buttons - ORDEN ESTRATÉGICO */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* 1. Embudo */}
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => window.open(funnelLink, "_blank")}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Ver mi Embudo
              </Button>

              {/* 2. Admin Leads */}
              <Button 
                size="lg" 
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/dashboard")}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Ir a Admin de Leads
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* 3. Link Referidos (copiar) */}
              <Button 
                size="lg" 
                variant="outline"
                className="w-full"
                onClick={copyReferralLink}
              >
                {copiedReferral ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Link Copiado
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5 mr-2" />
                    Copiar Link de Referidos
                  </>
                )}
              </Button>

              {/* 4. Admin Network */}
              <Button 
                size="lg" 
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/network")}
              >
                <Users className="w-5 h-5 mr-2" />
                Ver Admin del Network
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">📚 Próximos pasos:</p>
            <p>1. Comparte tu embudo en redes sociales, WhatsApp y email</p>
            <p>2. Da seguimiento a tus leads desde el admin</p>
            <p>3. Cierra ventas y gana comisiones del 50%</p>
          </div>
        </div>
      </div>
    </>
  );
}