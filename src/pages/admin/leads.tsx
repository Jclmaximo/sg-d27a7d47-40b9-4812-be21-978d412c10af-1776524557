import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  LogOut,
  TrendingUp,
  Eye
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  interest?: string;
  status: string;
  contact_method?: string;
  created_at: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const checkAuth = useCallback(async () => {
    const session = await authService.getCurrentSession();
    if (!session) {
      router.push("/auth/reset-password");
      return;
    }
    loadLeads();
  }, [router]);

  const filterLeads = useCallback(() => {
    let filtered = [...leads];

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    setFilteredLeads(filtered);
  }, [leads, searchQuery, filterStatus]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await leadsService.getLeads();
      if (data) {
        setLeads(data);
        setFilteredLeads(data);
      }
    } catch (error) {
      console.error("Error loading leads:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
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

  const getInterestIcon = (interest?: string) => {
    return interest === "ahorrar" ? "💰" : interest === "ganar" ? "📈" : "🎯";
  };

  return (
    <>
      <SEO title="Leads - Dashboard" description="Gestiona tus prospectos" />

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
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/dashboard")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-heading bg-clip-text text-transparent">
                    Mis Leads
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {filteredLeads.length} prospectos
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className={filterStatus === "all" ? "bg-primary" : "border-border/50"}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === "new" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("new")}
                    className={filterStatus === "new" ? "bg-accent" : "border-border/50"}
                  >
                    Nuevos
                  </Button>
                  <Button
                    variant={filterStatus === "contacted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("contacted")}
                    className={filterStatus === "contacted" ? "bg-primary" : "border-border/50"}
                  >
                    Contactados
                  </Button>
                  <Button
                    variant={filterStatus === "converted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("converted")}
                    className={filterStatus === "converted" ? "bg-secondary" : "border-border/50"}
                  >
                    Convertidos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status === "new" ? "Nuevo" : lead.status === "contacted" ? "Contactado" : "Convertido"}
                          </Badge>
                          <span className="text-xl">{getInterestIcon(lead.interest)}</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4 text-primary" />
                            <a href={`mailto:${lead.email}`} className="hover:text-foreground transition-colors">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-primary" />
                            <a href={`tel:${lead.phone}`} className="hover:text-foreground transition-colors">
                              {lead.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{lead.country}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDate(lead.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => window.location.href = `https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                      >
                        Contactar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredLeads.length === 0 && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No se encontraron leads con los filtros seleccionados</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}