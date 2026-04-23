import { useState, useEffect } from "react";
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
  Star,
  Clock,
  CheckCircle2,
  Calendar
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
  const [isMounted, setIsMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Demo data
  const profile = {
    full_name: "Demo User",
    username: "demo2026"
  };
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

  const funnelLink = isMounted ? `${window.location.origin}/ambassador/${username}` : "";
  const referralLink = isMounted ? `${window.location.origin}/pricing?ref=${username}` : "";

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
      case "new": return "bg-accent/30 text-accent-foreground border-accent/50 shadow-[0_0_10px_rgba(56,189,248,0.3)]";
      case "contacted": return "bg-primary/30 text-primary-foreground border-primary/50 shadow-[0_0_10px_rgba(37,99,235,0.3)]";
      case "converted": return "bg-secondary/30 text-secondary-foreground border-secondary/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
      default: return "bg-muted/30 text-muted-foreground border-border/50";
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
          <Badge className="bg-accent/30 text-accent-foreground border-accent/50 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-sm px-4 py-2 font-bold backdrop-blur-md">
            🎨 Modo Demo
          </Badge>
        </div>

        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-b border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Viaja Ligero</h1>
                <p className="text-xs text-muted-foreground">Dashboard Demo</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-white hover:bg-white/10"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </nav>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="border-b border-border/30 bg-gradient-to-b from-card/60 to-background/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
                  ¡Bienvenido, {profile.full_name}! 👋
                </h2>
                <p className="text-xl text-muted-foreground mb-6 font-medium">
                  Este es tu panel de control. Aquí podrás gestionar tus prospectos y ver las métricas de tu negocio.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={() => toast({ title: "Demo Mode", description: "Esta es una versión demo. Funcionalidad completa requiere login." })}
                    className="bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-primary/50"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Ir al Dashboard Completo
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowOnboarding(true)}
                    className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Ver Tutorial
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Stats Grid - Brighter Version */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <Card className="bg-card/80 backdrop-blur-md border-primary/50 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-gray-300">Total Leads</CardTitle>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-white mb-1 drop-shadow-sm">{stats.total}</div>
                  <p className="text-sm font-medium text-gray-400">Prospectos capturados</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-md border-accent/50 shadow-[0_8px_30px_rgba(56,189,248,0.2)] hover:shadow-[0_8px_40px_rgba(56,189,248,0.4)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-gray-300">Nuevos</CardTitle>
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-white mb-1 drop-shadow-sm">{stats.new}</div>
                  <p className="text-sm font-medium text-gray-400">Por contactar</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-md border-primary/50 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-gray-300">Contactados</CardTitle>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-white mb-1 drop-shadow-sm">{stats.contacted}</div>
                  <p className="text-sm font-medium text-gray-400">En seguimiento</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-md border-secondary/50 shadow-[0_8px_30px_rgba(234,179,8,0.2)] hover:shadow-[0_8px_40px_rgba(234,179,8,0.4)] hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-gray-300">Convertidos</CardTitle>
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-white mb-1 drop-shadow-sm">{stats.converted}</div>
                  <p className="text-sm font-medium text-gray-400">Ventas cerradas</p>
                </CardContent>
              </Card>
            </div>

            {/* Funnel Link Card - Brighter */}
            <Card className="bg-gradient-to-r from-primary/30 to-accent/20 backdrop-blur-md border-primary/60 shadow-[0_10px_40px_rgba(37,99,235,0.25)] mb-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <CardHeader className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                      <Link2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white drop-shadow-md">Tu Embudo de Ventas</CardTitle>
                      <CardDescription className="text-gray-200 text-base font-medium">Comparte este link para capturar leads de forma automática</CardDescription>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={copyFunnelLink}
                    className="bg-white text-primary hover:bg-gray-100 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full md:w-auto"
                  >
                    {copiedFunnel ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        ¡Link Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Copiar Link
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-white/10 shadow-inner flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <code className="text-lg text-white font-mono break-all font-medium tracking-wide">
                    {isMounted ? funnelLink : "Cargando link..."}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide - Brighter */}
            <Card className="bg-card/90 backdrop-blur-md border-white/10 shadow-2xl mb-10">
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Guía de Inicio Rápido</CardTitle>
                    <CardDescription className="text-gray-400 text-base">3 simples pasos para poner tu negocio en piloto automático</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-lg mb-4 relative z-10">
                      <span className="text-2xl font-black text-primary drop-shadow-md">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Comparte tu embudo</h3>
                    <p className="text-gray-400 font-medium relative z-10">
                      Copia y envía tu link personalizado por WhatsApp, redes sociales o compártelo en tus campañas.
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-lg mb-4 relative z-10">
                      <span className="text-2xl font-black text-primary drop-shadow-md">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Recibe leads</h3>
                    <p className="text-gray-400 font-medium relative z-10">
                      Cada persona que visite tu página y llene el formulario aparecerá automáticamente en tu dashboard.
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
                    <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-lg mb-4 relative z-10">
                      <span className="text-2xl font-black text-primary drop-shadow-md">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Cierra ventas</h3>
                    <p className="text-gray-400 font-medium relative z-10">
                      Usa los botones rápidos para contactar a tus prospectos por WhatsApp y cerrar inscripciones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Section - Brighter */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              <Card className="bg-card/90 backdrop-blur-md border-primary/30 shadow-xl hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">Prospectos Recientes</CardTitle>
                      <CardDescription className="text-gray-400">Últimos leads listos para contactar</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all group"
                      >
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg text-white group-hover:text-primary transition-colors">{lead.name}</span>
                            <Badge className={getStatusColor(lead.status)}>
                              {getStatusText(lead.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 flex flex-wrap items-center gap-4 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4" />
                              {lead.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)] w-full sm:w-auto"
                          onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}`, "_blank")}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contactar
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-6 border-white/10 text-white hover:bg-white/10 py-6 font-bold"
                    onClick={() => router.push("/admin/leads")}
                  >
                    Ver Todos Mis Leads
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-8">
                {/* Referral Link Card */}
                <Card className="bg-gradient-to-br from-secondary/20 to-card/90 backdrop-blur-md border-secondary/40 shadow-[0_10px_30px_rgba(234,179,8,0.15)] relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                      <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center border border-secondary/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Gift className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">Link de Referidos Directo</CardTitle>
                        <CardDescription className="text-gray-300 font-medium">Invita a otros al club y gana comisiones</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="bg-black/50 rounded-xl p-4 mb-4 border border-white/10 shadow-inner">
                      <code className="text-base text-secondary font-mono break-all font-bold">
                        {isMounted ? referralLink : "Cargando link..."}
                      </code>
                    </div>
                    <Button
                      size="lg"
                      onClick={copyReferralLink}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                    >
                      {copiedReferral ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          ¡Link Copiado Exitosamente!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Copiar Link de Referidos
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-32 flex-col gap-3 bg-white/5 backdrop-blur-md border border-primary/30 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
                    onClick={() => window.open(funnelLink, "_blank")}
                  >
                    <Link2 className="w-8 h-8 text-primary" />
                    <span className="font-bold text-white text-base">Ver Funnel</span>
                  </Button>
                  
                  <Button
                    className="h-32 flex-col gap-3 bg-white/5 backdrop-blur-md border border-accent/30 hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
                    onClick={() => router.push("/admin/main-dashboard")}
                  >
                    <LayoutDashboard className="w-8 h-8 text-accent" />
                    <span className="font-bold text-white text-base">Dashboard</span>
                  </Button>
                  
                  <Button
                    className="h-32 flex-col gap-3 bg-white/5 backdrop-blur-md border border-secondary/30 hover:border-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
                    onClick={() => toast({ title: "Demo Mode", description: "Esta funcionalidad requiere login." })}
                  >
                    <TrendingUp className="w-8 h-8 text-secondary" />
                    <span className="font-bold text-white text-base">Comisiones</span>
                  </Button>
                  
                  <Button
                    className="h-32 flex-col gap-3 bg-white/5 backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all"
                    onClick={() => setShowOnboarding(true)}
                  >
                    <PlayCircle className="w-8 h-8 text-white" />
                    <span className="font-bold text-white text-base">Tutoriales</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding Dialog */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-card border-white/20 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                  Bienvenido a Viaja Ligero 🎉
                </CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Tu plataforma para hacer crecer tu red de viajeros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex gap-5 p-5 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 border border-primary/30">
                      <Link2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">1. Comparte tu Funnel</h3>
                      <p className="text-base text-gray-400 font-medium">
                        Tu URL personalizada: <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded ml-1">viajaligero.com/ambassador/{username}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 p-5 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center shrink-0 border border-accent/30">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">2. Captura Leads</h3>
                      <p className="text-base text-gray-400 font-medium">
                        Cada visita a tu funnel genera prospectos calificados automáticamente en tu panel
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 p-5 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0 border border-secondary/30">
                      <MessageSquare className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">3. Contacta y Convierte</h3>
                      <p className="text-base text-gray-400 font-medium">
                        Usa WhatsApp para dar seguimiento y cerrar tus primeras ventas de inmediato
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => setShowOnboarding(false)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    ¡Entendido, empecemos!
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