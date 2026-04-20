import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Phone, 
  LogOut,
  DollarSign,
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  contacted: number;
  converted: number;
  pending: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, contacted: 0, converted: 0, pending: 0 });
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const session = await authService.getSession();
    if (!session) {
      router.push("/auth/reset-password");
      return;
    }
    setUserEmail(session.user?.email || "");
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: leadsData } = await leadsService.getAllLeads();
      
      if (leadsData) {
        setLeads(leadsData);
        
        const statsData = {
          total: leadsData.length,
          contacted: leadsData.filter(l => l.status === "contacted").length,
          converted: leadsData.filter(l => l.status === "converted").length,
          pending: leadsData.filter(l => l.status === "new").length,
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="w-3 h-3" />;
      case "contacted": return <Mail className="w-3 h-3" />;
      case "converted": return <CheckCircle2 className="w-3 h-3" />;
      default: return <XCircle className="w-3 h-3" />;
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
      <SEO title="Dashboard - Viaja Ligero" description="Panel de control de tu negocio" />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-heading bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                    <Users className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">Prospectos totales</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-accent/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
                    <Clock className="w-4 h-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground mt-1">Por contactar</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Contactados</CardTitle>
                    <Mail className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.contacted}</div>
                    <p className="text-xs text-muted-foreground mt-1">En seguimiento</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-secondary/10 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle>
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.converted}</div>
                    <p className="text-xs text-muted-foreground mt-1">Ventas cerradas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Leads Table */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Prospectos Recientes</CardTitle>
                  <CardDescription>Tus últimos leads capturados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Aún no tienes prospectos</p>
                      </div>
                    ) : (
                      leads.slice(0, 10).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/50 hover:border-primary/30 transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-foreground">{lead.name}</h3>
                              <Badge className={getStatusColor(lead.status)}>
                                {getStatusIcon(lead.status)}
                                <span className="ml-1">{getStatusText(lead.status)}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(lead.created_at)}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {leads.length > 10 && (
                    <div className="mt-6 text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => router.push("/admin/leads")}
                        className="border-border/50 hover:border-primary/30"
                      >
                        Ver Todos los Leads
                      </Button>
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