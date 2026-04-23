import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Mail, 
  Phone,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Eye,
  Link2,
  Share2,
  Copy,
  CheckCircle,
  MessageSquare,
  LayoutDashboard,
  TrendingUp,
  Gift,
  Zap,
  Star,
  ArrowRight,
  Plane,
  PlayCircle
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  interest?: string;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  nuevos: number;
  contactados: number;
  convertidos: number;
}

interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  whatsapp_number: string;
  usdt_wallet_address: string | null;
  role: string;
  ambassador_active: boolean;
  avatar_url?: string | null;
}

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, nuevos: 0, contactados: 0, convertidos: 0 });
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const funnelLink = username ? `${typeof window !== "undefined" ? window.location.origin : ""}/ambassador/${username}` : "";
  const referralLink = isMounted ? `${window.location.origin}/mwr?ref=${username}` : "";

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authService.getCurrentSession();
      
      if (!session) {
        router.push("/auth/reset-password");
        return;
      }

      setUserEmail(session.user?.email || "");
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        
        // Check if username is missing AFTER we have profile data
        if (!profileData.username) {
          router.push("/admin/onboarding");
          return;
        }
        
        setUsername(profileData.username);
        await loadDashboardData(session.user.id);
      } else {
        // If no profile exists at all, create temporary one and redirect to onboarding
        setProfile({
          id: session.user.id,
          email: session.user.email || "",
          username: session.user.user_metadata?.username || session.user.email?.split("@")[0] || "",
          full_name: session.user.user_metadata?.full_name || "Usuario",
          whatsapp_number: "",
          usdt_wallet_address: null,
          role: "user",
          ambassador_active: false
        } as Profile);
        
        router.push("/admin/onboarding");
        return;
      }
      
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/auth/reset-password");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // Use the same service as main-dashboard
      const leadsResult = await leadsService.getLeads(userId);

      if (leadsResult) {
        setStats({
          total: leadsResult.length,
          nuevos: leadsResult.filter(l => l.status === "nuevo" || l.status === "new").length,
          contactados: leadsResult.filter(l => l.status === "contactado" || l.status === "contacted").length,
          convertidos: leadsResult.filter(l => l.status === "convertido" || l.status === "converted").length
        });
      } else {
        setStats({
          total: 0,
          nuevos: 0,
          contactados: 0,
          convertidos: 0
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error loading data:", error);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    router.push("/admin");
  };

  const copyFunnelLink = () => {
    navigator.clipboard.writeText(funnelLink);
    setCopiedFunnel(true);
    toast({
      title: "Link copiado",
      description: "El link de tu embudo se copió al portapapeles",
    });
    setTimeout(() => setCopiedFunnel(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    toast({
      title: "Link copiado",
      description: "El link de referidos se copió al portapapeles",
    });
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      new: "Nuevo",
      contacted: "Contactado",
      converted: "Convertido",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      new: "bg-accent/20 text-accent border-accent/30 shadow-[0_0_10px_rgba(56,189,248,0.3)]",
      contacted: "bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(37,99,235,0.3)]",
      converted: "bg-secondary/20 text-secondary border-secondary/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    };
    return colorMap[status] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Panel de Control - Viaja Ligero"
        description="Gestiona tus leads y referidos"
      />
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30 shadow-xl">
                    {profile?.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                ¡Bienvenido de nuevo, {profile?.full_name || profile?.username || "Usuario"}!
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Description and Action Buttons */}
              <div className="mb-12">
                <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl">
                  Este es tu panel de control. Aquí podrás gestionar tus prospectos y ver las métricas de tu negocio.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => router.push("/admin/main-dashboard")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 text-base px-6"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Ir al Dashboard Completo
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-background/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 hover:bg-primary/10 text-base px-6"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Ver Tutorial
                  </Button>
                </div>
              </div>

              {/* Stats Grid - BRILLANTE */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/50 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:border-primary/60 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black text-foreground mb-1">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Prospectos capturados</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-accent/50 shadow-[0_8px_30px_rgba(56,189,248,0.2)] hover:shadow-[0_10px_40px_rgba(56,189,248,0.3)] hover:-translate-y-1 hover:border-accent/60 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos</CardTitle>
                    <Clock className="w-5 h-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black text-foreground mb-1">{stats.nuevos}</div>
                    <p className="text-xs text-muted-foreground">Por contactar</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/50 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:border-primary/60 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Contactados</CardTitle>
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black text-foreground mb-1">{stats.contactados}</div>
                    <p className="text-xs text-muted-foreground">En seguimiento</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-secondary/50 shadow-[0_8px_30px_rgba(234,179,8,0.2)] hover:shadow-[0_10px_40px_rgba(234,179,8,0.3)] hover:-translate-y-1 hover:border-secondary/60 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle>
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black text-foreground mb-1">{stats.convertidos}</div>
                    <p className="text-xs text-muted-foreground">Ventas cerradas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Funnel Link Card - BRILLANTE */}
              <Card className="bg-gradient-to-br from-primary/30 to-accent/20 backdrop-blur-sm border-primary/60 shadow-[0_10px_40px_rgba(37,99,235,0.25)] mb-8 relative overflow-hidden">
                {/* Background Orb */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                
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
                      className="bg-white hover:bg-white/90 text-primary shadow-lg shadow-primary/30"
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

              {/* Quick Start Guide - BRILLANTE */}
              <Card className="bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-accent/40 shadow-[0_8px_30px_rgba(56,189,248,0.15)] mb-8">
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
                    <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-primary/10 hover:border-primary/20 transition-all">
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

                    <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-primary/10 hover:border-primary/20 transition-all">
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

                    <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-primary/10 hover:border-primary/20 transition-all">
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

              {/* Features Overview & Referral */}
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

                <Card className="bg-gradient-to-br from-secondary/20 to-accent/10 backdrop-blur-sm border-secondary/40 shadow-2xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all relative overflow-hidden">
                  {/* Background Orb */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
                  
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

              {/* Quick Actions - BRILLANTE */}
              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 mb-8">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Herramientas principales de tu negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-2 bg-white/5 backdrop-blur-md border-primary/30 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
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
                      className="h-auto py-6 flex-col gap-2 bg-white/5 backdrop-blur-md border-accent/30 hover:border-accent/50 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
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
                      className="h-auto py-6 flex-col gap-2 bg-white/5 backdrop-blur-md border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
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

              {/* Recent Leads - BRILLANTE */}
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
                  {recentLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Aún no tienes leads
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                        Comienza compartiendo tu embudo para recibir tus primeros prospectos
                      </p>
                      <Button
                        onClick={copyFunnelLink}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir Mi Embudo
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {recentLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-foreground truncate">{lead.name}</span>
                                <Badge className={getStatusColor(lead.status)}>
                                  {getStatusText(lead.status)}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 shrink-0" />
                                  {formatDate(lead.created_at)}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full sm:w-auto shrink-0"
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
                          className="bg-white/5 backdrop-blur-md border-accent/30 hover:border-accent/50 hover:bg-accent/10"
                        >
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Ver Comisiones
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </>
  );
}