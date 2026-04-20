import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { referralService } from "@/services/referralService";
import { supabase } from "@/integrations/supabase/client";
import type { NetworkStats } from "@/services/referralService";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  TrendingUp,
  DollarSign,
  Search,
  Download,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  LogOut,
  Eye,
  LayoutDashboard,
  Link2,
  User,
  Wallet,
  Copy,
  Plus,
  Gift,
  CheckCircle,
  Hand
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  source: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  whatsapp_number: string;
  usdt_wallet_address: string | null;
  role: string;
  ambassador_active: boolean;
}

export default function MainDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumen");
  
  // User profile
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showNotesListDialog, setShowNotesListDialog] = useState(false);
  const [leadNotes, setLeadNotes] = useState<any[]>([]);
  
  // Network
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  
  // Links
  const [copiedFunnel, setCopiedFunnel] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  
  // Wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);

  // Helper functions
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      "nuevo": "Nuevo",
      "new": "Nuevo",
      "contactado": "Contactado",
      "contacted": "Contactado",
      "interesado": "Interesado",
      "interested": "Interesado",
      "convertido": "Convertido",
      "converted": "Convertido",
      "descartado": "Descartado",
      "discarded": "Descartado"
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeColor = (status: string) => {
    const colorMap: Record<string, string> = {
      "new": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "nuevo": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "contacted": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "contactado": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "interested": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "interesado": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "converted": "bg-green-500/20 text-green-400 border-green-500/30",
      "convertido": "bg-green-500/20 text-green-400 border-green-500/30",
      "discarded": "bg-red-500/20 text-red-400 border-red-500/30",
      "descartado": "bg-red-500/20 text-red-400 border-red-500/30"
    };
    return colorMap[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleAddNote = async () => {
    if (!selectedLead || !noteText.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe una nota",
        variant: "destructive"
      });
      return;
    }

    try {
      await leadsService.addLeadNote(selectedLead.id, noteText);
      toast({
        title: "✅ Nota agregada",
        description: "La nota se guardó correctamente"
      });
      setNoteText("");
      setShowNoteDialog(false);
      setSelectedLead(null);
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la nota",
        variant: "destructive"
      });
    }
  };

  const sendWhatsAppMessage = (lead: Lead, templateKey: string) => {
    const template = messageTemplates[templateKey as keyof typeof messageTemplates];
    if (!template) return;

    const message = template.template(lead.name);
    const cleanPhone = lead.phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
    setShowMessageDialog(false);
  };

  const loadData = useCallback(async () => {
    try {
      // Get current user session
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/auth/reset-password");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setWalletAddress(profileData.usdt_wallet_address || "");
      }

      // Load leads
      const leadsResult = await leadsService.getLeads();
      if (leadsResult) {
        setAllLeads(leadsResult);
        setLeads(leadsResult);
        setFilteredLeads(leadsResult);
      }

      // Load network stats
      const networkStats = await referralService.getNetworkStats(session.user.id);
      if (networkStats) {
        setStats(networkStats);
      }

      // Load commissions
      const commissionsData = await referralService.getUserCommissions(session.user.id);
      if (commissionsData) {
        setCommissions(commissionsData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  }, [router]);

  const filterLeads = useCallback(() => {
    let filtered = [...allLeads];

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    setLeads(filtered);
  }, [allLeads, searchTerm, statusFilter]);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/auth/reset-password");
        return;
      }
      setUserEmail(session.user?.email || "");
      loadData();
    };

    checkAuth();
  }, [router, loadData]);

  useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  // Message templates for different stages
  const messageTemplates = {
    "primer_contacto": {
      title: "Primer Contacto",
      template: (name: string) => `Hola ${name}! 👋

Vi que te interesa *Viaja Ligero*, el club exclusivo para ahorrar en viajes.

¿Te gustaría que te cuente cómo funciona y los beneficios que incluye? 

Tenemos descuentos en:
✈️ Vuelos
🏨 Hoteles 
🚢 Cruceros
🚗 Alquiler de autos

Y mucho más... ¿Cuándo tienes 5 minutos para hablar?`
    },
    "seguimiento": {
      title: "Seguimiento",
      template: (name: string) => `Hola ${name}! 

¿Tuviste oportunidad de revisar la información que te envié sobre *Viaja Ligero*?

Quedo atento a cualquier pregunta que tengas. 

¿Hay algo específico que te gustaría saber? 🤔`
    },
    "beneficios_detallados": {
      title: "Beneficios Detallados",
      template: (name: string) => `Hola ${name}! 

Te comparto los *beneficios principales* de Viaja Ligero:

✅ Acceso a plataforma privada de viajes
✅ Descuentos de hasta 70% en hoteles
✅ Precios especiales en vuelos y cruceros
✅ Programa Life Experiences (viajes de lujo)
✅ Créditos de viaje acumulables
✅ Soporte 24/7

La inversión es de solo $179 USD/año.

¿Te gustaría activar tu membresía? 🎯`
    },
    "cierre_membresia": {
      title: "Cierre - Membresía",
      template: (name: string) => `Hola ${name}! 

Para activar tu membresía de *Viaja Ligero* y empezar a ahorrar en tus viajes, aquí está el link de pago seguro:

🔗 [Link de registro]

Una vez que completes el pago:
✅ Acceso inmediato a la plataforma
✅ Descuentos disponibles 24/7
✅ Soporte personalizado

¿Tienes alguna duda antes de activar? 💳`
    },
    "oportunidad_ganar": {
      title: "Oportunidad de Ganar",
      template: (name: string) => `Hola ${name}! 

Además de *ahorrar en viajes*, ¿sabías que puedes *generar ingresos* con Viaja Ligero?

Como Lifestyle Ambassador puedes:
💰 Ganar $39.50 USD por cada referido directo
💰 Ganar $7.90 USD por referidos indirectos
💰 Construir tu red de viajeros

Es simple: compartes tu link personalizado y cuando alguien se registra, ganas comisiones.

¿Te interesa saber más sobre esta oportunidad? 🚀`
    },
    "recordatorio": {
      title: "Recordatorio",
      template: (name: string) => `Hola ${name}! 

Solo paso a recordarte que la oferta de *Viaja Ligero* sigue disponible.

¿Sigues interesado/a en:
• Ahorrar en tus viajes? ✈️
• Generar ingresos por recomendación? 💰
• Ambas opciones?

Estoy aquí para resolver cualquier duda que tengas. 

¿Hablamos hoy? 📱`
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ["Nombre", "Email", "Teléfono", "País", "Estado", "Fecha"];
      const rows = leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.country || "",
        getStatusText(lead.status),
        formatDate(lead.created_at)
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();

      toast({
        title: "Exportación exitosa",
        description: "Los leads se han exportado correctamente",
      });
    } catch (err) {
      console.error("Error exporting:", err);
      toast({
        title: "Error",
        description: "Error al exportar leads",
        variant: "destructive",
      });
    }
  };

  const loadLeadNotes = async (lead: Lead) => {
    try {
      const notes = await leadsService.getLeadNotes(lead.id);
      setLeadNotes(notes);
      setSelectedLead(lead);
      setShowNotesListDialog(true);
    } catch (error) {
      console.error("Error loading notes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notas",
        variant: "destructive"
      });
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const result = await leadsService.updateLeadStatus(leadId, newStatus);

      if (!result) {
        toast({
          title: "Error",
          description: "Error al actualizar estado",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Estado actualizado",
        description: `Lead marcado como ${getStatusText(newStatus)}`,
      });

      loadData();
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Error al actualizar estado",
        variant: "destructive",
      });
    }
  };

  const requestWithdrawal = async () => {
    if (!profile?.usdt_wallet_address) {
      toast({
        title: "Configura tu billetera",
        description: "Primero debes agregar tu dirección de billetera USDT (BSC)",
        variant: "destructive"
      });
      return;
    }

    const availableBalance = stats?.available_balance ?? 0;
    if (availableBalance < 39.50) {
      toast({
        title: "Saldo insuficiente",
        description: "Necesitas al menos $39.50 USD para solicitar un retiro",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("withdrawal_requests")
      .insert({
        user_id: profile.id,
        amount_usd: availableBalance,
        wallet_address: profile.usdt_wallet_address,
        status: "pending"
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud de retiro",
        variant: "destructive"
      });
    } else {
      toast({
        title: "✅ Solicitud creada",
        description: `Se procesará tu retiro de $${availableBalance.toFixed(2)} USD`
      });
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Dashboard Principal - Viaja Ligero"
        description="Panel de control principal para gestionar leads y comisiones"
      />
      <div className="min-h-screen bg-background relative">
        {/* Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Header */}
        <header className="bg-background border-b border-border/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                <Hand className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mi Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Bienvenido, {profile?.full_name || "Usuario"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-border/50 hover:border-primary/50 hover:bg-primary/10 text-xs md:text-sm px-2 md:px-3"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Salir</span>
            </Button>
          </div>
        </header>

        {/* Banner */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-48 md:h-64 overflow-hidden">
          <img 
            src="/dashboard-banner-clean.jpg" 
            alt="Dashboard Banner" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 -mt-32 relative z-10">
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid mb-8">
              <TabsTrigger value="resumen" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Mi Red</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Links</span>
              </TabsTrigger>
              <TabsTrigger value="perfil" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1 - RESUMEN */}
            <TabsContent value="resumen" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Total Ganado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-1">
                      ${(stats?.total_earned ?? 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Acumulado total</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-secondary/30 shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:border-secondary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                      Disponible para Retiro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-1">
                      ${(stats?.available_balance ?? 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Listo para retirar</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-accent/30 shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/30 hover:border-accent/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      Referidos Activos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-1">
                      {stats?.total_referrals ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">En tu red</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>
                    Herramientas para hacer crecer tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setActiveTab("links")}
                  >
                    <Link2 className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Compartir Embudo</div>
                      <div className="text-xs text-muted-foreground">
                        Copia tu link personalizado
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => setActiveTab("leads")}
                  >
                    <Users className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Ver Leads</div>
                      <div className="text-xs text-muted-foreground">
                        {allLeads.length} prospectos capturados
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2 - LEADS */}
            <TabsContent value="leads" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">{allLeads.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-accent/30 shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/30 hover:border-accent/50 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos</CardTitle>
                    <Clock className="w-5 h-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">
                      {allLeads.filter(l => l.status === "new").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/50 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Contactados</CardTitle>
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">
                      {allLeads.filter(l => l.status === "contacted").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-secondary/30 shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:border-secondary/50 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle>
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">
                      {allLeads.filter(l => l.status === "converted").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Gestión de Leads</CardTitle>
                      <CardDescription>
                        Administra y da seguimiento a tus prospectos
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative flex-1 md:flex-initial md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar leads..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background/60 border-primary/20 focus:border-primary/50"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px] bg-background/60 border-primary/20">
                          <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="new">Nuevos</SelectItem>
                          <SelectItem value="contacted">Contactados</SelectItem>
                          <SelectItem value="converted">Convertidos</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={exportToCSV}
                        variant="outline"
                        className="bg-background/60 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {leads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay leads que coincidan con tu búsqueda</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-4 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                        >
                          {/* Mobile & Desktop Layout */}
                          <div className="flex flex-col gap-4">
                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                                  {lead.name}
                                </h3>
                                <Badge className={getStatusBadgeColor(lead.status)}>
                                  {getStatusText(lead.status)}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}`, "_blank")}
                                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 shrink-0"
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Contactar</span>
                                <span className="sm:hidden">WhatsApp</span>
                              </Button>
                            </div>

                            {/* Info Grid */}
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-foreground truncate font-medium">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2">
                                <Phone className="w-4 h-4 text-accent shrink-0" />
                                <span className="text-foreground font-medium">{lead.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2">
                                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-foreground">{formatDate(lead.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowNoteDialog(true);
                                  }}
                                  className="flex-1 bg-background/60 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Nota
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadLeadNotes(lead)}
                                  className="flex-1 bg-background/60 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3 - NETWORK */}
            <TabsContent value="network" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Ganado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${(stats?.total_earned ?? 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disponible para Retiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${(stats?.available_balance ?? 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Referidos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.total_referrals ?? 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historial de Comisiones</CardTitle>
                  <CardDescription>
                    Comisiones ganadas del 50% por cada referido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {commissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aún no has ganado comisiones</p>
                      <p className="text-sm mt-2">Comparte tu link de referidos para empezar a ganar</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {commissions.map((commission) => (
                        <div
                          key={commission.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                        >
                          <div>
                            <div className="font-medium">
                              {commission.referred_user?.username || commission.referred_user?.email || "Usuario"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(commission.created_at).toLocaleDateString("es-ES")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-secondary">
                              ${(commission.amount_usd ?? 0).toFixed(2)}
                            </div>
                            <Badge variant={
                              commission.status === "paid" ? "default" :
                              commission.status === "pending" ? "secondary" :
                              "outline"
                            }>
                              {commission.status === "paid" ? "Pagado" :
                               commission.status === "pending" ? "Pendiente" : "Disponible"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Retiro</CardTitle>
                  <CardDescription>
                    Retiros mínimos de $39.50 USD a tu billetera USDT (BSC)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={requestWithdrawal}
                    disabled={!stats || (stats.available_balance ?? 0) < 39.50}
                    size="lg"
                    className="w-full"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Solicitar Retiro de ${(stats?.available_balance ?? 0).toFixed(2)}
                  </Button>
                  {stats && (stats.available_balance ?? 0) < 39.50 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Necesitas ${(39.50 - (stats.available_balance ?? 0)).toFixed(2)} más para solicitar un retiro
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4 - LINKS */}
            <TabsContent value="links" className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/20 to-accent/10 backdrop-blur-sm border-primary/40 shadow-2xl shadow-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                        <Link2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Tu Embudo de Ventas</CardTitle>
                        <CardDescription>Comparte este link para capturar leads</CardDescription>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/ambassador/${profile?.username || ""}`);
                        setCopiedFunnel(true);
                        setTimeout(() => setCopiedFunnel(false), 2000);
                      }}
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
                      {window.location.origin}/ambassador/{profile?.username || "tu-usuario"}
                    </code>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/20 to-accent/10 backdrop-blur-sm border-secondary/40 shadow-2xl shadow-secondary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-secondary/30 shadow-lg shadow-secondary/20">
                        <Gift className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle>Link de Referidos</CardTitle>
                        <CardDescription>Genera ingresos por cada persona que se una</CardDescription>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/?ref=${profile?.username || ""}`);
                        setCopiedReferral(true);
                        setTimeout(() => setCopiedReferral(false), 2000);
                      }}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/30"
                    >
                      {copiedReferral ? (
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
                  <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-secondary/30 shadow-inner">
                    <code className="text-sm text-secondary font-mono break-all">
                      {window.location.origin}/?ref={profile?.username || "tu-usuario"}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5 - PERFIL */}
            <TabsContent value="perfil" className="space-y-6">
              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 shadow-xl shadow-primary/20">
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Datos de tu cuenta y preferencias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <div className="p-3 bg-background/60 rounded-lg border border-primary/20">
                      {profile?.full_name || "No configurado"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="p-3 bg-background/60 rounded-lg border border-primary/20">
                      {profile?.email || "No configurado"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <div className="p-3 bg-background/60 rounded-lg border border-primary/20">
                      @{profile?.username || "No configurado"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Billetera USDT (BSC)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="flex-1 bg-background/60 border-primary/20 focus:border-primary/50"
                      />
                      <Button
                        onClick={async () => {
                          setSavingWallet(true);
                          const { error } = await supabase
                            .from("profiles")
                            .update({ usdt_wallet_address: walletAddress })
                            .eq("id", profile?.id || "");
                          
                          if (error) {
                            toast({
                              title: "Error",
                              description: "No se pudo guardar la billetera",
                              variant: "destructive"
                            });
                          } else {
                            toast({
                              title: "✅ Guardado",
                              description: "Dirección de billetera actualizada"
                            });
                            await loadData();
                          }
                          setSavingWallet(false);
                        }}
                        disabled={savingWallet}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      >
                        {savingWallet ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Guardar"
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Necesaria para recibir tus comisiones en USDT
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Dialog para agregar nota */}
          <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nota</DialogTitle>
                <DialogDescription>
                  Agrega una nota de seguimiento para {selectedLead?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <textarea
                  className="w-full min-h-32 p-3 border rounded-md bg-background"
                  placeholder="Escribe tu nota aquí..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNoteDialog(false);
                      setNoteText("");
                      setSelectedLead(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddNote}>
                    Guardar Nota
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog para seleccionar mensaje */}
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enviar Mensaje a {selectedLead?.name}</DialogTitle>
                <DialogDescription>
                  Selecciona un template de mensaje según la etapa del seguimiento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(messageTemplates).map(([key, template]) => (
                  <div
                    key={key}
                    className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition"
                    onClick={() => {
                      if (selectedLead) {
                        sendWhatsAppMessage(selectedLead, key);
                      }
                    }}
                  >
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      {template.title}
                    </h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedLead ? template.template(selectedLead.name).substring(0, 150) + "..." : ""}
                    </p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog para ver historial de notas */}
          <Dialog open={showNotesListDialog} onOpenChange={setShowNotesListDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Notas de {selectedLead?.name}</DialogTitle>
                <DialogDescription>
                  Historial completo de seguimiento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {leadNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <svg className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No hay notas para este lead</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setShowNotesListDialog(false);
                        setShowNoteDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar primera nota
                    </Button>
                  </div>
                ) : (
                  <>
                    {leadNotes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {note.profiles?.full_name?.[0] || note.profiles?.username?.[0] || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {note.profiles?.full_name || note.profiles?.username || "Usuario"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(note.created_at).toLocaleString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-line">{note.note}</p>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowNotesListDialog(false);
                        setShowNoteDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar nueva nota
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </>
  );
}