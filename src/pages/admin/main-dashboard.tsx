import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { referralService } from "@/services/referralService";
import { supabase } from "@/integrations/supabase/client";
import type { Commission, NetworkStats, ReferralTreeNode } from "@/services/referralService";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  TrendingUp,
  DollarSign,
  UserPlus,
  Search,
  Download,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  LogOut,
  Eye,
  FileText,
  Share2,
  Filter,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  Network,
  Link2,
  User,
  Wallet,
  Check,
  Copy,
  ExternalLink,
  Plus
} from "lucide-react";
import Link from "next/link";

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

  const copyFunnelLink = () => {
    if (!profile?.username) return;
    const link = `${window.location.origin}/ambassador/${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopiedFunnel(true);
    toast({
      title: "✅ Link copiado",
      description: "El link de tu embudo ha sido copiado al portapapeles"
    });
    setTimeout(() => setCopiedFunnel(false), 2000);
  };

  const copyReferralLink = () => {
    if (!profile?.username) return;
    const link = `${window.location.origin}/pricing?ref=${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopiedReferral(true);
    toast({
      title: "✅ Link copiado",
      description: "Tu link de referidos ha sido copiado al portapapeles"
    });
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const saveWalletAddress = async () => {
    if (!profile) return;

    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una dirección válida",
        variant: "destructive"
      });
      return;
    }

    setSavingWallet(true);

    const { error } = await supabase
      .from("profiles")
      .update({ usdt_wallet_address: walletAddress })
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la billetera",
        variant: "destructive"
      });
    } else {
      toast({
        title: "✅ Guardado",
        description: "Tu billetera USDT ha sido actualizada"
      });
      setProfile({ ...profile, usdt_wallet_address: walletAddress });
    }

    setSavingWallet(false);
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

    if (!stats || (stats.available_balance || 0) < 39.50) {
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
        amount_usd: stats.available_balance,
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
        description: `Se procesará tu retiro de $${stats.available_balance.toFixed(2)} USD`
      });
      await loadData();
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

  const contactViaWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  const contactViaEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const exportToCSV = () => {
    try {
      const headers = ["Nombre", "Email", "Teléfono", "País", "Interés", "Estado", "Fecha"];
      const rows = leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.country || "",
        "",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando dashboard...</p>
      </div>
    );
  }

  const funnelUrl = profile?.username ? `${window.location.origin}/ambassador/${profile.username}` : "";
  const referralUrl = profile?.username ? `${window.location.origin}/pricing?ref=${profile.username}` : "";

  return (
    <>
      <SEO 
        title="Mi Dashboard - Viaja Ligero"
        description="Panel de control para gestionar leads, red de referidos y comisiones"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/viaja-ligero-logo.png" 
                  alt="Viaja Ligero" 
                  className="h-8 md:h-10 w-auto"
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Mi Dashboard</h1>
                  <p className="text-sm text-muted-foreground hidden md:block">
                    Bienvenido, {profile?.full_name || profile?.username || "Usuario"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {profile?.role === 'admin' && (
                  <Link href="/admin/super-dashboard">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="hidden sm:inline">Super Admin</span>
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Banner */}
        <div className="container mx-auto px-4 mt-6">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <img 
              src="/dashboard-banner.jpg" 
              alt="Viaja Ligero - Vive más, lleva menos" 
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="resumen" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span className="hidden sm:inline">Mi Red</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Links</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1 - OVERVIEW */}
            <TabsContent value="resumen" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leads.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Capturados por tu embudo
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mi Red</CardTitle>
                    <Network className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_referrals || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Referidos activos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats?.total_earned?.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total ganado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disponible</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats?.available_balance?.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Para retirar
                    </p>
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
                        {leads.length} prospectos capturados
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2 - LEADS */}
            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Leads Capturados</CardTitle>
                  <CardDescription>
                    Gestiona todos los prospectos que han completado tu embudo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="nuevo">Nuevos</SelectItem>
                        <SelectItem value="contactado">Contactados</SelectItem>
                        <SelectItem value="interesado">Interesados</SelectItem>
                        <SelectItem value="convertido">Convertidos</SelectItem>
                        <SelectItem value="descartado">Descartados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay leads que coincidan con tu búsqueda</p>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Origen</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLeads.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="font-medium">{lead.name}</TableCell>
                              <TableCell>{lead.email}</TableCell>
                              <TableCell>{lead.phone}</TableCell>
                              <TableCell>{lead.country}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {lead.source}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={lead.status}
                                  onValueChange={(value) => updateLeadStatus(lead.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="nuevo">Nuevo</SelectItem>
                                    <SelectItem value="contactado">Contactado</SelectItem>
                                    <SelectItem value="interesado">Interesado</SelectItem>
                                    <SelectItem value="convertido">Convertido</SelectItem>
                                    <SelectItem value="descartado">Descartado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                {new Date(lead.created_at).toLocaleDateString("es-ES")}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      setShowMessageDialog(true);
                                    }}
                                    title="Enviar mensaje por WhatsApp"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      setShowNoteDialog(true);
                                    }}
                                    title="Agregar nota"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => loadLeadNotes(lead)}
                                    title="Ver notas"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                      ${stats?.total_earned?.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disponible para Retiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${stats?.available_balance?.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Referidos Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.total_referrals || 0}
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
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Referido</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {commissions.map((commission) => (
                            <TableRow key={commission.id}>
                              <TableCell>{commission.referred_user?.username || commission.referred_user?.email || "Usuario"}</TableCell>
                              <TableCell className="font-medium">
                                ${commission.amount_usd.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  commission.status === "paid" ? "default" :
                                  commission.status === "pending" ? "secondary" :
                                  "outline"
                                }>
                                  {commission.status === "paid" ? "Pagado" :
                                   commission.status === "pending" ? "Pendiente" : "Disponible"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(commission.created_at).toLocaleDateString("es-ES")}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                    disabled={!stats || stats.available_balance < 39.50}
                    size="lg"
                    className="w-full"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Solicitar Retiro de ${stats?.available_balance.toFixed(2) || "0.00"}
                  </Button>
                  {stats && stats.available_balance < 39.50 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Necesitas ${(39.50 - stats.available_balance).toFixed(2)} más para solicitar un retiro
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4 - LINKS */}
            <TabsContent value="links" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tu Embudo Personalizado</CardTitle>
                  <CardDescription>
                    Comparte este embudo para captar leads interesados en el club de viajes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Link del Embudo</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={funnelUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={copyFunnelLink} variant="outline">
                        {copiedFunnel ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a href={funnelUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver mi Embudo
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Link de Referidos del Funnel</CardTitle>
                  <CardDescription>
                    Comparte este link con otros miembros de tu equipo que quieran su propio embudo (ganas $39.50 por cada uno)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Link de Referidos</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={referralUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={copyReferralLink} variant="outline">
                        {copiedReferral ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mensaje Sugerido</CardTitle>
                  <CardDescription>
                    Usa este mensaje para compartir tu embudo por WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <p className="italic">
                      "¡Hola! 🌍✈️ ¿Te gustaría viajar más pagando menos? Te comparto info sobre el club de viajes con mejores tarifas que encontré. Echa un vistazo: {funnelUrl}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 5 - PROFILE */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Tus datos de perfil y configuración
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Nombre Completo</Label>
                      <Input value={profile?.full_name || ""} readOnly className="mt-2" />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input value={profile?.username || ""} readOnly className="mt-2" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={profile?.email || ""} readOnly className="mt-2" />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={profile?.whatsapp_number || ""} readOnly className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billetera USDT (BSC)</CardTitle>
                  <CardDescription>
                    Configura tu billetera para recibir pagos de comisiones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Dirección de Billetera</Label>
                    <Input
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="0x..."
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Solo billeteras USDT en la red Binance Smart Chain (BSC)
                    </p>
                  </div>
                  <Button
                    onClick={saveWalletAddress}
                    disabled={savingWallet}
                    className="w-full"
                  >
                    {savingWallet ? "Guardando..." : "Guardar Billetera"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

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
                className="w-full min-h-32 p-3 border rounded-md"
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
      </div>
    </>
  );
}