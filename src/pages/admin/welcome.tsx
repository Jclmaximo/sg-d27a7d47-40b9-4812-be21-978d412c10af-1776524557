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
  PlayCircle,
  DollarSign,
  Target,
  Hand,
  Search,
  Bell
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
  const recentActivity: any[] = [];
  const [dashboardLocked, setDashboardLocked] = useState(true);

  // Demo data (in a real app, this would come from the database)
  const funnelLink = typeof window !== "undefined" ? `${window.location.origin}/ambassador/${username}` : "";
  const referralLink = typeof window !== "undefined" ? `${window.location.origin}/mwr?ref=${username}` : "";

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      localStorage.clear(); // Limpiar datos de sesión
      router.push("/admin");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Verificar si el usuario ha iniciado el reto para desbloquear dashboard
  useEffect(() => {
    const retoStarted = localStorage.getItem("reto_active");
    if (retoStarted === "false") {
      setDashboardLocked(false);
    }
  }, []);

  const loadData = async () => {
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden border-b border-[#E2E8F0]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white pointer-events-none" />
          
          {/* Logout Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-full flex items-center gap-2 px-4 transition-all"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline text-sm font-medium">Salir</span>
            </Button>
          </div>

          <div className="relative px-6 py-10 sm:py-12">
            <div className="max-w-xl mx-auto text-center flex flex-col items-center">
              {/* Avatar */}
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-16 h-16 rounded-full object-cover mx-auto border-[3px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] mb-5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-[#F1F5F9] text-[#2563EB] rounded-full flex items-center justify-center text-xl font-semibold mx-auto border-[3px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] mb-5">
                  {profile?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {/* Headline - Reducido y más limpio */}
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] leading-tight mb-3">
                Bienvenido, {profile?.full_name?.split(' ')[0] || profile?.username || "Usuario"}
              </h1>

              {/* Descripción */}
              <p className="text-[15px] text-[#475569] max-w-sm mx-auto mb-8">
                Tu centro de comando para hacer crecer tu negocio
              </p>

              {/* CTA Principal */}
              <Button
                onClick={() => router.push("/admin/main-dashboard")}
                className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium h-[52px] px-10 rounded-xl shadow-[0_4px_12px_rgba(66,133,244,0.25)] hover:shadow-[0_6px_16px_rgba(66,133,244,0.35)] transition-all text-[15px] flex items-center gap-2"
              >
                Ir a Mi Dashboard
                <TrendingUp className="ml-2 h-[18px] w-[18px]" />
              </Button>
            </div>
          </div>
        </div>

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

              {/* Reto 24h Widget - Siempre visible y prioritario */}
              <Card className="bg-gradient-to-br from-[#4285F4] to-[#3367D6] text-white border-0 shadow-lg mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    Reto de 24 Horas
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    {dashboardLocked 
                      ? "Inicia el reto para desbloquear todas las funciones del dashboard"
                      : "¡Reto activo! Completa tus objetivos del día"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => router.push("/reto")}
                    variant="secondary"
                    className="w-full sm:w-auto bg-white text-[#4285F4] hover:bg-gray-50 font-medium h-12 px-8 flex items-center gap-2"
                  >
                    {dashboardLocked ? "Iniciar Reto" : "Ir al Centro de Comando"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                  <div className={`grid gap-6 md:grid-cols-3 mb-8 transition-all duration-700 ${dashboardLocked ? "opacity-40 blur-sm pointer-events-none" : "opacity-100 blur-0"}`}>
                    <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Total Leads
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                          {stats.total}
                        </div>
                        <p className="text-sm text-[#475569]">Prospectos capturados</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Nuevos Leads
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                          {stats.nuevos}
                        </div>
                        <p className="text-sm text-[#475569]">Sin contactar</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          Contactados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                          {stats.contactados}
                        </div>
                        <p className="text-sm text-[#475569]">En seguimiento</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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

              {/* Quick Actions */}
              <Card className={`bg-white border border-[#E2E8F0] shadow-sm mb-8 transition-all duration-700 ${dashboardLocked ? "opacity-40 blur-sm pointer-events-none" : "opacity-100 blur-0"}`}>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#0F172A]">Acciones Rápidas</CardTitle>
                  <CardDescription className="text-[#475569]">
                    Herramientas para impulsar tu negocio hoy
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-primary transition-all"
                    onClick={() => router.push("/admin/main-dashboard?tab=links")}
                  >
                    <Link2 className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-[#0F172A] mb-1">Compartir Link</div>
                      <div className="text-sm text-[#64748B]">
                        Tu embudo personalizado
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-primary transition-all"
                    onClick={() => router.push("/admin/main-dashboard?tab=leads")}
                  >
                    <Users className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-[#0F172A] mb-1">Gestionar Leads</div>
                      <div className="text-sm text-[#64748B]">
                        {stats.total} prospectos activos
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-primary transition-all"
                    onClick={() => router.push("/admin/recursos")}
                  >
                    <Gift className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-[#0F172A] mb-1">Recursos</div>
                      <div className="text-sm text-[#64748B]">
                        Marketing y materiales
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-primary transition-all"
                    onClick={() => router.push("/admin/main-dashboard?tab=productividad")}
                  >
                    <Target className="h-6 w-6 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-[#0F172A] mb-1">Productividad</div>
                      <div className="text-sm text-[#64748B]">
                        Tareas del día
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className={`bg-white border border-[#E2E8F0] shadow-sm transition-all duration-700 ${dashboardLocked ? "opacity-40 blur-sm pointer-events-none" : "opacity-100 blur-0"}`}>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#0F172A]">Actividad Reciente</CardTitle>
                  <CardDescription className="text-[#475569]">
                    Últimos movimientos en tu red
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-[#CBD5E1] mx-auto mb-4" />
                      <p className="text-[#64748B]">No hay actividad reciente</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors"
                        >
                          <div
                            className={`
                              w-10 h-10 rounded-full flex items-center justify-center shrink-0
                              ${activity.type === "lead" ? "bg-primary/10 text-primary" : ""}
                              ${activity.type === "commission" ? "bg-success/10 text-success" : ""}
                              ${activity.type === "referral" ? "bg-secondary/10 text-secondary" : ""}
                            `}
                          >
                            {activity.type === "lead" && <Users className="w-5 h-5" />}
                            {activity.type === "commission" && <DollarSign className="w-5 h-5" />}
                            {activity.type === "referral" && <Hand className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#0F172A] mb-1">
                              {activity.title}
                            </p>
                            <p className="text-sm text-[#64748B]">
                              {activity.description}
                            </p>
                            <p className="text-xs text-[#94A3B8] mt-1">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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