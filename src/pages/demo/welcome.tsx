import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Phone, 
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Plane,
  LayoutDashboard,
  PlayCircle,
  MessageSquare,
  Link2,
  Share2,
  ArrowRight,
  CheckCircle,
  Copy,
  Gift,
  Zap,
  Star
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

export default function DemoWelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Demo data
  const profile = {
    full_name: "Demo User",
    username: "demo2026"
  };
  const userEmail = "demo@viajaligero.com";
  const username = "demo2026";
  const stats = { total: 12, new: 3, contacted: 5, converted: 4 };
  const recentLeads: Lead[] = [
    {
      id: "1",
      name: "María García",
      email: "maria@example.com",
      phone: "+52 123 456 7890",
      status: "new",
      created_at: "2026-04-20T10:30:00Z"
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos@example.com",
      phone: "+57 321 654 0987",
      status: "contacted",
      created_at: "2026-04-19T15:20:00Z"
    },
    {
      id: "3",
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "+34 654 321 987",
      status: "converted",
      created_at: "2026-04-18T09:15:00Z"
    }
  ];

  const funnelLink = typeof window !== "undefined" ? `${window.location.origin}/ambassador/${username}` : "";
  const referralLink = typeof window !== "undefined" ? `${window.location.origin}/pricing?ref=${username}` : "";

  const copyFunnelLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(funnelLink);
      setCopiedFunnel(true);
      toast({ title: "¡Copiado!", description: "Link de embudo copiado" });
      setTimeout(() => setCopiedFunnel(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralLink);
      setCopiedReferral(true);
      toast({ title: "¡Copiado!", description: "Link de referidos copiado" });
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-accent/20 text-accent border-accent/30";
      case "contacted": return "bg-primary/20 text-primary border-primary/30";
      case "converted": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-muted/20 text-muted-foreground border-border/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "Nuevo";
      case "contacted": return "Contactado";
      case "converted": return "Convertido";
      default: return status;
    }
  };

  return (
    <>
      <SEO title="Demo - Dashboard Viaja Ligero" />
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Demo Badge */}
        <div className="fixed top-4 right-4 z-50">
          <Badge className="bg-accent/20 text-accent border-accent/30 text-sm px-4 py-2">
            🎨 Modo Demo
          </Badge>
        </div>

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
                <p className="text-xs text-muted-foreground">Dashboard Demo</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </nav>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="border-b border-border/50 bg-card/20">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
                  ¡Bienvenido, {profile.full_name}! 👋
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Este es tu panel de control. Aquí podrás gestionar tus prospectos y ver las métricas de tu negocio.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={() => toast({ title: "Demo Mode", description: "Esta es una versión demo. Funcionalidad completa requiere login." })}
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
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                <Users className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Prospectos capturados</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-accent/30 shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/30 hover:border-accent/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos</CardTitle>
                <Clock className="w-5 h-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{stats.new}</div>
                <p className="text-xs text-muted-foreground">Por contactar</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contactados</CardTitle>
                <MessageSquare className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{stats.contacted}</div>
                <p className="text-xs text-muted-foreground">En seguimiento</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-secondary/30 shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:border-secondary/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle>
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{stats.converted}</div>
                <p className="text-xs text-muted-foreground">Ventas cerradas</p>
              </CardContent>
            </Card>
          </div>

            {/* Funnel Link Card */}
            <Card className="bg-gradient-to-br from-primary/20 to-accent/10 backdrop-blur-sm border-primary/40 shadow-2xl shadow-primary/30 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                      <Link2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Tu Embudo de Ventas</CardTitle>
                      <CardDescription>Comparte este link para capturar leads</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={copyFunnelLink}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                  >
                    {copiedFunnel ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-primary/30 shadow-inner">
                  <code className="text-sm text-primary font-mono break-all">
                    {funnelLink}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-accent/30 shadow-xl shadow-accent/20 mb-8">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle>Guía de Inicio Rápido</CardTitle>
                </div>
                <CardDescription>
                  3 pasos para empezar a generar leads automáticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-background/40 backdrop-blur-sm rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
                    <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0 border border-primary/30 shadow-lg shadow-primary/20">
                      <span className="text-lg font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Comparte tu embudo</h3>
                      <p className="text-sm text-muted-foreground">
                        Copia y envía tu link personalizado por WhatsApp, redes sociales o email
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-background/40 backdrop-blur-sm rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
                    <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0 border border-primary/30 shadow-lg shadow-primary/20">
                      <span className="text-lg font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Recibe leads automáticos</h3>
                      <p className="text-sm text-muted-foreground">
                        Cada persona que llene el formulario aparecerá aquí con su información
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-background/40 backdrop-blur-sm rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
                    <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0 border border-primary/30 shadow-lg shadow-primary/20">
                      <span className="text-lg font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Contacta y convierte</h3>
                      <p className="text-sm text-muted-foreground">
                        Usa el botón de contactar para comunicarte vía WhatsApp o email
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>Lo que incluye tu embudo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Página de captura optimizada",
                      "Formulario de contacto integrado",
                      "Presentación de beneficios",
                      "Sección de testimonios",
                      "Call-to-action persuasivos",
                      "Diseño responsive móvil/desktop",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/20 to-accent/10 backdrop-blur-sm border-secondary/40 shadow-2xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-secondary/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-secondary/30 shadow-lg shadow-secondary/20">
                      <Gift className="w-5 h-5 text-secondary" />
                    </div>
                    <CardTitle>Link de Referidos</CardTitle>
                  </div>
                  <CardDescription>Genera ingresos por cada persona que se una</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 mb-4 border border-secondary/30 shadow-inner">
                    <code className="text-sm text-secondary font-mono break-all">
                      {referralLink}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    onClick={copyReferralLink}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/30"
                  >
                    {copiedReferral ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Link Copiado
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
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 mb-8">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Herramientas principales de tu negocio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-2 bg-background/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all"
                    onClick={() => window.open(funnelLink, "_blank")}
                  >
                    <Link2 className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Tu Funnel</div>
                      <div className="text-xs text-muted-foreground">Ver y compartir</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-2 bg-background/40 backdrop-blur-sm border-accent/30 hover:border-accent/50 hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20 transition-all"
                    onClick={() => router.push("/admin/leads")}
                  >
                    <Users className="w-8 h-8 text-accent" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Mis Leads</div>
                      <div className="text-xs text-muted-foreground">Gestionar prospectos</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-2 bg-background/40 backdrop-blur-sm border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-lg hover:shadow-secondary/20 transition-all"
                    onClick={copyFunnelLink}
                  >
                    <Share2 className="w-8 h-8 text-secondary" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Compartir</div>
                      <div className="text-xs text-muted-foreground">Copiar URL</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Leads */}
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20">
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
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                        onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}`, "_blank")}
                      >
                        Contactar
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    onClick={() => router.push("/admin/main-dashboard")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Ver Panel Principal
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-background/40 backdrop-blur-sm border-accent/30 hover:border-accent/50 hover:bg-accent/10"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Ver Comisiones
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => toast({ title: "Demo Mode", description: "Funcionalidad completa requiere login." })}
              >
                <Users className="mr-2 h-5 w-5" />
                Ir al Panel Principal
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: "Demo Mode", description: "Funcionalidad completa requiere login." })}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver Comisiones
              </Button>
            </div>

            {/* Footer Note */}
            <div className="text-center text-sm text-muted-foreground space-y-2 mb-8">
              <p className="font-medium">📚 Próximos pasos:</p>
              <p>1. Comparte tu embudo en redes sociales, WhatsApp y email</p>
              <p>2. Da seguimiento a tus leads desde el admin</p>
              <p>3. Cierra ventas y gana comisiones del 50%</p>
            </div>

            {/* Login CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">¿Te gusta lo que ves?</h3>
                <p className="text-muted-foreground mb-6">
                  Esta es solo una versión demo. Regístrate para acceder a todas las funcionalidades.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => router.push("/admin")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/registro")}
                    className="border-border/50"
                  >
                    Registrarse
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
                        Tu URL personalizada: <span className="text-primary font-mono">viajaligero.com/ambassador/{username}</span>
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