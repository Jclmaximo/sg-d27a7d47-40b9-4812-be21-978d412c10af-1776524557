import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Sparkles, Copy, CheckCircle, ArrowRight, Users, TrendingUp, Gift, ExternalLink, LayoutDashboard, Link2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [funnelLink, setFunnelLink] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("❌ No user found, redirecting to /admin");
        router.push("/admin");
        return;
      }

      console.log("✅ User found:", user.id);

      // Get username
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      console.log("Profile query result:", { profile, error });

      if (error) {
        console.error("❌ Error loading profile:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar tu perfil. Por favor recarga la página.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (profile?.username) {
        console.log("✅ Username loaded:", profile.username);
        setUsername(profile.username);
      } else {
        console.error("❌ No username found in profile");
        toast({
          title: "Configuración incompleta",
          description: "No se encontró tu username. Por favor contacta soporte.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("❌ Exception in checkAuth:", err);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar tu perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente"
    });
    router.push("/admin");
  };

  const copyFunnelLink = () => {
    const link = `${window.location.origin}/ambassador/${username}`;
    console.log("📋 Copying funnel link:", link);
    navigator.clipboard.writeText(link);
    setCopiedFunnel(true);
    toast({
      title: "✅ Link copiado",
      description: "El link de tu embudo ha sido copiado al portapapeles"
    });
    setTimeout(() => setCopiedFunnel(false), 2000);
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/pricing?ref=${username}`;
    console.log("📋 Copying referral link:", link);
    navigator.clipboard.writeText(link);
    setCopiedReferral(true);
    toast({
      title: "✅ Link copiado",
      description: "Tu link de referidos ha sido copiado al portapapeles"
    });
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const funnelUrl = username ? `${window.location.origin}/ambassador/${username}` : "";
  const referralUrl = username ? `${window.location.origin}/pricing?ref=${username}` : "";

  console.log("🔗 Generated URLs:", { funnelUrl, referralUrl, username });

  return (
    <>
      <SEO title="¡Bienvenido a Viaja Ligero! 🎉" />
      
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">¡Tu Embudo de Ventas está Listo! 🎉</h1>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
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

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => router.push("/admin/main-dashboard")}
            >
              <Users className="mr-2 h-5 w-5" />
              Ir al Panel Principal
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/admin/main-dashboard")}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Ver Comisiones
            </Button>
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