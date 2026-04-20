import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { Sparkles, Copy, CheckCircle, ArrowRight, Users, TrendingUp, Gift, ExternalLink, LayoutDashboard, Link2, LogOut, Plane, PlayCircle, Clock, MessageSquare, CheckCircle2, Loader2, Share2, Mail, Calendar } from "lucide-react";
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
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-heading bg-clip-text text-transparent">Viaja Ligero</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </nav>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="relative z-10">
            {/* Hero Section */}
            <div className="border-b border-border/50 bg-card/20">
              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="max-w-3xl">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
                    ¡Bienvenido, {profile?.full_name || userEmail}! 👋
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    Este es tu panel de control. Aquí podrás gestionar tus prospectos y ver las métricas de tu negocio.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => router.push("/admin/main-dashboard")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    >
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Ir al Dashboard Completo
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowOnboarding(true)}
                      className="border-border/50 hover:border-primary/30"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Ver Tutorial
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">Prospectos capturados</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-accent/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos</CardTitle>
                    <Clock className="w-5 h-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.new}</div>
                    <p className="text-xs text-muted-foreground mt-1">Por contactar</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Contactados</CardTitle>
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.contacted}</div>
                    <p className="text-xs text-muted-foreground mt-1">En seguimiento</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-secondary/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle>
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.converted}</div>
                    <p className="text-xs text-muted-foreground mt-1">Ventas cerradas</p>
                  </CardContent>
                </Card>
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

            {/* Quick Actions */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Herramientas principales de tu negocio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-2 border-border/50 hover:border-primary/30 hover:bg-card/80"
                    onClick={() => router.push(`/ambassador/${username}`)}
                  >
                    <Link2 className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Tu Funnel</div>
                      <div className="text-xs text-muted-foreground">Ver y compartir</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-2 border-border/50 hover:border-primary/30 hover:bg-card/80"
                    onClick={() => router.push("/admin/leads")}
                  >
                    <Users className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Mis Leads</div>
                      <div className="text-xs text-muted-foreground">Gestionar prospectos</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-2 border-border/50 hover:border-primary/30 hover:bg-card/80"
                    onClick={() => {
                      const url = `${window.location.origin}/ambassador/${username}`;
                      navigator.clipboard.writeText(url);
                      toast({ title: "¡Copiado!", description: "URL copiada al portapapeles" });
                    }}
                  >
                    <Share2 className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Compartir</div>
                      <div className="text-xs text-muted-foreground">Copiar URL</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Prospectos Recientes</CardTitle>
                    <CardDescription>Últimos leads capturados</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/admin/leads")}
                    className="text-primary hover:text-primary/80"
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        Aún no tienes prospectos. ¡Comparte tu funnel para empezar!
                      </p>
                    </div>
                  ) : (
                    recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50 hover:border-primary/30 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{lead.name}</span>
                            <Badge className={getStatusColor(lead.status)}>
                              {getStatusText(lead.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}`, "_blank")}
                        >
                          Contactar
                        </Button>
                      </div>
                    ))
                  )}
                </div>
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
        )}

        {/* Onboarding Dialog */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-heading bg-clip-text text-transparent">
                  Bienvenido a Viaja Ligero 🎉
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Tu plataforma para hacer crecer tu red de viajeros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-background/30 rounded-lg border border-border/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Link2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">1. Comparte tu Funnel</h3>
                      <p className="text-sm text-muted-foreground">
                        Tu URL personalizada: <span className="text-primary font-mono">traveladvantage.com/ambassador/{username}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-background/30 rounded-lg border border-border/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">2. Captura Leads Automáticamente</h3>
                      <p className="text-sm text-muted-foreground">
                        Cada visita a tu funnel genera prospectos calificados que aparecen en tu dashboard
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-background/30 rounded-lg border border-border/50">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">3. Contacta y Convierte</h3>
                      <p className="text-sm text-muted-foreground">
                        Usa WhatsApp o email para dar seguimiento. Marca el estado de cada lead
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    onClick={() => setShowOnboarding(false)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    ¡Entendido, empecemos!
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push(`/ambassador/${username}`)}
                    className="border-border/50 hover:border-primary/30"
                  >
                    Ver mi Funnel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}