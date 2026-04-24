import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { 
  Users, Clock, MessageSquare, CheckCircle2, 
  Download, LogOut, Mail, Phone, Calendar, Target, Plus, Eye,
  LayoutGrid, Share2, Copy, Check, Info, BookOpen, Network, DollarSign, Gift,
  TrendingUp, Shield, Link2, ExternalLink, Loader2, CheckCircle, User, Search, Hand
} from "lucide-react";
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
import { productivityService } from "@/services/productivityService";
import { supabase } from "@/integrations/supabase/client";
import type { NetworkStats } from "@/services/referralService";
import type { ProductivityStats, TeamMemberStats, DailyActivity } from "@/services/productivityService";
import { useToast } from "@/hooks/use-toast";

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
  mwr_link?: string | null;
  avatar_url?: string | null;
}

interface MessageTemplate {
  title: string;
  emoji: string;
  color: string;
  template: (name: string) => string;
}

export default function MainDashboard() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showResourcesSidebar, setShowResourcesSidebar] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    username: "",
    mwr_link: "",
    avatar_url: ""
  });
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

  // Productivity
  const [todayActivity, setTodayActivity] = useState<DailyActivity>({
    contacted_prospects: false,
    contacted_prospects_count: 0,
    did_followup: false,
    presented_business: false,
    posted_content: false,
    attended_training: false
  });
  const [productivityStats, setProductivityStats] = useState<ProductivityStats | null>(null);
  const [teamStats, setTeamStats] = useState<TeamMemberStats[]>([]);
  const [savingActivity, setSavingActivity] = useState(false);

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

  // Message templates for different stages
  const messageTemplates: Record<string, MessageTemplate> = {
    "bienvenida": {
      title: "Bienvenida Inicial",
      emoji: "👋",
      color: "from-blue-500 to-cyan-400",
      template: (name: string) => `Hola ${name}! 👋

Vi que te interesa *Viaja Ligero*. Te cuento rápido:

✅ Plataforma privada de viajes
✅ Hasta 70% descuento en hoteles
✅ Vuelos y cruceros con tarifa preferencial
✅ Créditos de viaje acumulables

¿Tienes 5 minutos para que te explique cómo funciona? 😊`
    },
    "recordatorio": {
      title: "Recordatorio Amigable",
      emoji: "🔔",
      color: "from-purple-500 to-pink-400",
      template: (name: string) => `Hola ${name}! 

¿Pudiste revisar la info sobre Viaja Ligero?

Sé que estás ocupado/a, pero solo quería saber si tienes alguna pregunta. 

Estoy aquí para ayudarte 🙂`
    },
    "beneficios": {
      title: "Beneficios Exclusivos",
      emoji: "💎",
      color: "from-amber-500 to-orange-400",
      template: (name: string) => `Hola ${name}! 

Los *beneficios clave* de Viaja Ligero:

✨ Programa Life Experiences (viajes de lujo)
💰 Inversión: solo $179 USD/año
🌍 Descuentos en +100 países
🎁 Créditos de viaje por cada reserva
📱 Soporte 24/7

¿Listo/a para activar tu membresía? 🚀`
    },
    "casos_exito": {
      title: "Casos de Éxito",
      emoji: "🌍",
      color: "from-green-500 to-emerald-400",
      template: (name: string) => `Hola ${name}! 

Te comparto resultados *reales* de miembros:

🇨🇴 Lorenzo ahorró $493 USD en Colombia
🇹🇷 Elena ahorró $1,092 USD en Turquía
💰 Total ahorrado en 2024: $2.8M USD

Tú también puedes viajar más por menos.

¿Empezamos? ✈️`
    },
    "urgencia": {
      title: "Urgencia Limitada",
      emoji: "🔥",
      color: "from-red-500 to-rose-400",
      template: (name: string) => `Hola ${name}! 

Solo paso a recordarte que los precios especiales de lanzamiento están por terminar.

🎯 Membresía anual: $179 USD
⏰ Oferta válida: Últimos días

¿Aseguramos tu lugar ahora? 💳`
    },
    "dudas": {
      title: "Resolver Dudas",
      emoji: "💬",
      color: "from-indigo-500 to-violet-400",
      template: (name: string) => `Hola ${name}! 

¿Hay algo específico que te gustaría saber sobre Viaja Ligero?

Puedo resolver dudas sobre:
• Cómo funcionan los descuentos
• Destinos disponibles
• Proceso de reserva
• Programa de referidos

¿Qué te gustaría aclarar? 🤔`
    }
  };

  const sendWhatsAppMessage = (lead: Lead, templateKey: string) => {
    const template = messageTemplates[templateKey];
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
        setProfileForm({
          full_name: profileData.full_name || "",
          username: profileData.username || "",
          mwr_link: profileData.mwr_link || "",
          avatar_url: profileData.avatar_url || ""
        });
      }

      // Load leads
      const leadsResult = await leadsService.getLeads(session.user.id);
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

      // Load productivity data - pass profile data to ensure role check works
      await loadProductivityData(profileData);

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

  const updateProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.full_name,
          username: profileForm.username,
          mwr_link: profileForm.mwr_link,
          avatar_url: profileForm.avatar_url
        })
        .eq("id", session.user.id);

      if (error) throw error;

      await loadData();
      setIsEditingProfile(false);
      toast({
        title: "✅ Perfil actualizado",
        description: "Los cambios se guardaron correctamente"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Error al actualizar perfil",
        variant: "destructive"
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(fileName);

      // Update profile form
      setProfileForm({ ...profileForm, avatar_url: publicUrl });

      // Save to database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      await loadData();
      toast({
        title: "✅ Foto actualizada",
        description: "Tu foto de perfil se actualizó correctamente"
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Error al subir la foto",
        variant: "destructive"
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
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

  const loadProductivityData = async (userProfile?: UserProfile) => {
    try {
      const session = await authService.getCurrentSession();
      if (!session) return;

      // Cargar actividad de hoy
      const today = await productivityService.getTodayProductivity(session.user.id);
      if (today) {
        setTodayActivity({
          contacted_prospects: today.contacted_prospects || false,
          contacted_prospects_count: today.contacted_prospects_count || 0,
          did_followup: today.did_followup || false,
          presented_business: today.presented_business || false,
          posted_content: today.posted_content || false,
          attended_training: today.attended_training || false
        });
      }

      // Cargar estadísticas personales
      const stats = await productivityService.getProductivityStats(session.user.id);
      setProductivityStats(stats);

      // Cargar estadísticas del equipo (solo admin) - usar el profile pasado como parámetro
      const currentProfile = userProfile || profile;
      if (currentProfile?.role === "admin") {
        const team = await productivityService.getTeamProductivityStats(session.user.id);
        console.log("Team stats loaded:", team); // Debug log
        setTeamStats(team);
      }
    } catch (error) {
      console.error("Error loading productivity data:", error);
    }
  };

  const saveActivity = async () => {
    try {
      setSavingActivity(true);
      const session = await authService.getCurrentSession();
      if (!session) return;

      const result = await productivityService.saveDailyActivity(session.user.id, todayActivity);

      if (result.success) {
        toast({
          title: "✅ Actividad guardada",
          description: "Tu progreso del día se actualizó correctamente"
        });
        await loadProductivityData();
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar la actividad",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      toast({
        title: "Error",
        description: "Error al guardar actividad",
        variant: "destructive"
      });
    } finally {
      setSavingActivity(false);
    }
  };

  const copyReferralLink = async () => {
    if (!profile?.username) return;
    
    const link = `${window.location.origin}/mwr?ref=${profile.username}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "¡Copiado!",
      description: "Link de referidos copiado al portapapeles",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const funnelUrl = typeof window !== "undefined" ? `${window.location.origin}/mwr?ref=${profile?.username || ""}` : "";
  const networkMembers = (stats as any)?.network_members || (stats as any)?.referrals || [];

  return (
    <>
      <SEO 
        title="Dashboard Principal - Viaja Ligero"
        description="Panel de control principal para gestionar leads y comisiones"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A] mb-1">
              Command Center
            </h1>
            <p className="text-sm text-[#64748B]">{profile?.full_name || profile?.username}</p>
          </div>
          <Button
            onClick={() => router.push("/admin/welcome")}
            className="bg-[#4285F4] hover:bg-[#3367D6] text-white"
          >
            Ir a Mi Dashboard →
          </Button>
        </div>

        <main className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full inline-flex h-auto flex-nowrap overflow-x-auto overflow-y-hidden gap-2 bg-white border border-[#E2E8F0] p-1 rounded-lg shadow-sm">
                <TabsTrigger 
                  value="resumen" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                  onClick={() => router.push("/admin/welcome")}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Resumen
                </TabsTrigger>
                <TabsTrigger 
                  value="leads"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Leads
                </TabsTrigger>
                <TabsTrigger 
                  value="network"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <Network className="w-4 h-4 mr-2" />
                  Mi Red
                </TabsTrigger>
                <TabsTrigger 
                  value="productividad"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Productividad
                </TabsTrigger>
                <TabsTrigger 
                  value="links"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Links
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="recursos"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Recursos
                </TabsTrigger>
                <TabsTrigger 
                  value="equipo"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[#F1F5F9] text-[#475569]"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Equipo
                </TabsTrigger>
              </TabsList>

              {/* TAB 1 - RESUMEN */}
              <TabsContent value="resumen" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                  <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Total Ganado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        ${(stats?.total_earned ?? 0).toFixed(2)}
                      </div>
                      <p className="text-sm text-[#475569]">Acumulado total</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Nuevos</CardTitle>
                      <Clock className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "nuevo" || l.status === "new").length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Contactados</CardTitle>
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "contactado" || l.status === "contacted").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-white border border-[#E2E8F0] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Acciones Rápidas</CardTitle>
                    <CardDescription className="text-[#475569]">
                      Herramientas para hacer crecer tu negocio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-primary transition-all"
                      onClick={() => setActiveTab("links")}
                    >
                      <Link2 className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-semibold text-[#0F172A]">Compartir Embudo</div>
                        <div className="text-sm text-[#475569]">
                          Copia tu link personalizado
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-primary transition-all"
                      onClick={() => setActiveTab("leads")}
                    >
                      <Users className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-semibold text-[#0F172A]">Ver Leads</div>
                        <div className="text-sm text-[#475569]">
                          {allLeads.length} prospectos capturados
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-primary transition-all"
                      onClick={() => router.push("/admin/recursos")}
                    >
                      <Gift className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-semibold text-[#0F172A]">Recursos de Marketing</div>
                        <div className="text-sm text-[#475569]">
                          Imágenes, copys y enlaces
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 2 - LEADS */}
              <TabsContent value="leads" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-4 mb-6">
                  <Card className="bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Total Leads</CardTitle>
                      <Clock className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-[#0F172A]">{allLeads.length}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Nuevos</CardTitle>
                      <Clock className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "nuevo" || l.status === "new").length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Contactados</CardTitle>
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "contactado" || l.status === "contacted").length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Convertidos</CardTitle>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "convertido" || l.status === "converted").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg font-semibold text-[#0F172A]">Gestión de Leads</CardTitle>
                        <CardDescription className="text-[#64748B]">
                          Administra y da seguimiento a tus prospectos
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="relative flex-1 md:flex-initial md:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                          <Input
                            placeholder="Buscar leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-full sm:w-[180px] bg-white border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="nuevo">Nuevos</SelectItem>
                            <SelectItem value="contactado">Contactados</SelectItem>
                            <SelectItem value="interesado">Interesados</SelectItem>
                            <SelectItem value="convertido">Convertidos</SelectItem>
                            <SelectItem value="descartado">Descartados</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={exportToCSV}
                          variant="outline"
                          className="bg-white border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-primary"
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
                            className="p-4 rounded-lg bg-white border border-[#E2E8F0] hover:border-primary hover:shadow-md transition-all"
                          >
                            {/* Mobile & Desktop Layout */}
                            <div className="flex flex-col gap-4">
                              {/* Header Row */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-semibold text-[#0F172A] mb-1 truncate">
                                    {lead.name}
                                  </h3>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => loadLeadNotes(lead)}
                                    className="border-[#E2E8F0] hover:border-primary hover:bg-[#F1F5F9] transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      setShowNoteDialog(true);
                                    }}
                                    className="border-[#E2E8F0] hover:border-primary hover:bg-[#F1F5F9] transition-all"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      setShowMessageDialog(true);
                                    }}
                                    className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                                  >
                                    <MessageSquare className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Contactar</span>
                                  </Button>
                                </div>
                              </div>

                              {/* Info Grid */}
                              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#E2E8F0] min-w-0">
                                  <Mail className="w-4 h-4 text-[#64748B] shrink-0" />
                                  <span className="text-[#0F172A] truncate font-medium min-w-0">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#E2E8F0]">
                                  <Phone className="w-4 h-4 text-[#64748B] shrink-0" />
                                  <span className="text-[#0F172A] font-medium">{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#E2E8F0]">
                                  <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
                                  <span className="text-[#0F172A]">{formatDate(lead.created_at)}</span>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#E2E8F0]">
                                  <Select
                                    value={lead.status}
                                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                                  >
                                    <SelectTrigger className="h-8 border-[#E2E8F0] bg-white hover:border-[#CBD5E1] focus:border-primary focus:ring-2 focus:ring-primary/20">
                                      <SelectValue>
                                        <Badge className={getStatusBadgeColor(lead.status)}>
                                          {getStatusText(lead.status)}
                                        </Badge>
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="nuevo">
                                        <span className="flex items-center gap-2">
                                          <Clock className="w-3 h-3" />
                                          Nuevo
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="contactado">
                                        <span className="flex items-center gap-2">
                                          <MessageSquare className="w-3 h-3" />
                                          Contactado
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="interesado">
                                        <span className="flex items-center gap-2">
                                          <TrendingUp className="w-3 h-3" />
                                          Interesado
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="convertido">
                                        <span className="flex items-center gap-2">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Convertido
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="descartado">
                                        <span className="flex items-center gap-2">
                                          <Hand className="w-3 h-3" />
                                          Descartado
                                        </span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
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

              {/* TAB 3 - MI RED */}
              <TabsContent value="network" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                  <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Total Referidos</CardTitle>
                      <Network className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        {networkMembers.length}
                      </div>
                      <p className="text-sm text-[#475569]">Personas en tu red</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Total Comisiones</CardTitle>
                      <DollarSign className="w-5 h-5 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        ${commissions.reduce((sum, c) => sum + Number(c.amount_usd), 0).toFixed(2)}
                      </div>
                      <p className="text-sm text-[#475569]">Ganadas en total</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-[#64748B]">Tasa de Conversión</CardTitle>
                      <TrendingUp className="w-5 h-5 text-success" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        {allLeads.length > 0 
                          ? ((networkMembers.length / allLeads.length) * 100).toFixed(1)
                          : "0.0"}%
                      </div>
                      <p className="text-sm text-[#475569]">De leads a referidos</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Tu Red de Referidos</CardTitle>
                    <CardDescription className="text-[#64748B]">
                      Personas que se unieron usando tu código de referido
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {networkMembers.length === 0 ? (
                      <div className="text-center py-12 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                        <Network className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                        <p className="text-[#64748B]">
                          Aún no tienes referidos en tu red
                        </p>
                        <Button 
                          onClick={() => setActiveTab("links")}
                          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartir mi enlace
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {networkMembers.map((referral: any) => (
                          <div
                            key={referral.id || referral.user_id}
                            className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB] hover:border-primary transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                {referral.full_name?.charAt(0) || referral.email?.charAt(0) || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {referral.full_name || referral.email}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {referral.email}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                              Activo
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 4 - PRODUCTIVIDAD */}
              <TabsContent value="productividad" className="space-y-6">
                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Actividad de Hoy</CardTitle>
                    <CardDescription className="text-[#64748B]">
                      Marca tus actividades diarias para mantener tu racha
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-[#0F172A]">Contacté prospectos</p>
                          {todayActivity.contacted_prospects && (
                            <p className="text-sm text-[#64748B]">
                              {todayActivity.contacted_prospects_count || 0} prospectos contactados
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {todayActivity.contacted_prospects && (
                          <input
                            type="number"
                            min="0"
                            value={todayActivity.contacted_prospects_count || 0}
                            onChange={(e) =>
                              setTodayActivity((prev) => ({
                                ...prev,
                                contacted_prospects_count: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-20 px-2 py-1 text-center border border-[#E5E7EB] rounded bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        )}
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={todayActivity.contacted_prospects}
                            onChange={(e) => {
                              setTodayActivity((prev) => ({
                                ...prev,
                                contacted_prospects: e.target.checked,
                              }));
                            }}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${todayActivity.contacted_prospects ? "bg-primary" : "bg-[#E5E7EB]"}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${todayActivity.contacted_prospects ? "translate-x-6" : "translate-x-0.5"}`} />
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <p className="font-medium text-[#0F172A]">Hice seguimiento</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={todayActivity.did_followup}
                          onChange={(e) => {
                            setTodayActivity((prev) => ({
                              ...prev,
                              did_followup: e.target.checked,
                            }));
                          }}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${todayActivity.did_followup ? "bg-primary" : "bg-[#E5E7EB]"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${todayActivity.did_followup ? "translate-x-6" : "translate-x-0.5"}`} />
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-primary" />
                        <p className="font-medium text-[#0F172A]">Presenté el negocio</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={todayActivity.presented_business}
                          onChange={(e) => {
                            setTodayActivity((prev) => ({
                              ...prev,
                              presented_business: e.target.checked,
                            }));
                          }}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${todayActivity.presented_business ? "bg-primary" : "bg-[#E5E7EB]"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${todayActivity.presented_business ? "translate-x-6" : "translate-x-0.5"}`} />
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-primary" />
                        <p className="font-medium text-[#0F172A]">Publiqué contenido</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={todayActivity.posted_content}
                          onChange={(e) => {
                            setTodayActivity((prev) => ({
                              ...prev,
                              posted_content: e.target.checked,
                            }));
                          }}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${todayActivity.posted_content ? "bg-primary" : "bg-[#E5E7EB]"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${todayActivity.posted_content ? "translate-x-6" : "translate-x-0.5"}`} />
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <p className="font-medium text-[#0F172A]">Asistí a capacitación</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={todayActivity.attended_training}
                          onChange={(e) => {
                            setTodayActivity((prev) => ({
                              ...prev,
                              attended_training: e.target.checked,
                            }));
                          }}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${todayActivity.attended_training ? "bg-primary" : "bg-[#E5E7EB]"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${todayActivity.attended_training ? "translate-x-6" : "translate-x-0.5"}`} />
                        </div>
                      </label>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button onClick={saveActivity} disabled={savingActivity}>
                        {savingActivity ? "Guardando..." : "Guardar Actividad"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B]">Días Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        {(productivityStats as any)?.active_days_this_week || (productivityStats as any)?.active_days || 0}
                      </div>
                      <p className="text-sm text-[#64748B]">de 7 esta semana</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B]">Racha Actual</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        {(productivityStats as any)?.current_streak || 0}
                      </div>
                      <p className="text-sm text-[#64748B]">días consecutivos</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B]">Puntos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A] mb-1">
                        {(productivityStats as any)?.total_points || 0}
                      </div>
                      <p className="text-sm text-[#64748B]">acumulados</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* TAB 5 - LINKS */}
              <TabsContent value="links" className="space-y-6">
                {/* Link del Embudo */}
                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Link del Embudo (MWR)</CardTitle>
                    <CardDescription className="text-[#64748B]">
                      Comparte este enlace para que vean tu embudo de ventas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-[#0F172A] mb-2 block">
                        Tu Link de Embudo
                      </label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={funnelUrl}
                          className="flex-1 bg-white border-[#E2E8F0] font-mono text-sm text-primary hover:border-[#CBD5E1] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                        >
                          {copiedFunnel ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
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
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(funnelUrl)}`,
                            "_blank"
                          )
                        }
                        className="border-[#E5E7EB] hover:border-[#25D366] hover:bg-[#25D366]/10 text-[#25D366]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(funnelUrl)}`,
                            "_blank"
                          )
                        }
                        className="border-[#E5E7EB] hover:border-[#1877F2] hover:bg-[#1877F2]/10 text-[#1877F2]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(funnelUrl)}`,
                            "_blank"
                          )
                        }
                        className="border-[#E5E7EB] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 text-[#1DA1F2]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(funnelUrl)}`,
                            "_blank"
                          )
                        }
                        className="border-[#E5E7EB] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 text-[#0A66C2]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div className="text-sm text-[#0F172A]">
                          <p className="font-medium mb-1">¿Cómo funciona?</p>
                          <p className="text-[#64748B]">
                            Este link lleva a tu página de embudo personalizada (MWR). 
                            Cuando alguien se registre, aparecerá en tu lista de leads.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Link de Referidos */}
                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Link de Referidos (Ambassador)</CardTitle>
                    <CardDescription className="text-[#64748B]">
                      Link directo para referir personas a Travel Advantage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-[#0F172A] mb-2 block">
                        Tu Link de Referidos
                      </label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={`${typeof window !== "undefined" ? window.location.origin : ""}/ambassador/${profile?.username || ""}`}
                          className="flex-1 bg-white border-[#E2E8F0] font-mono text-sm text-primary hover:border-[#CBD5E1] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Button
                          onClick={() => {
                            const referralUrl = `${window.location.origin}/ambassador/${profile?.username || ""}`;
                            navigator.clipboard.writeText(referralUrl);
                            setCopiedReferral(true);
                            setTimeout(() => setCopiedReferral(false), 2000);
                          }}
                          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                        >
                          {copiedReferral ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
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
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const referralUrl = `${window.location.origin}/ambassador/${profile?.username || ""}`;
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(referralUrl)}`,
                            "_blank"
                          );
                        }}
                        className="border-[#E5E7EB] hover:border-[#25D366] hover:bg-[#25D366]/10 text-[#25D366]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const referralUrl = `${window.location.origin}/ambassador/${profile?.username || ""}`;
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
                            "_blank"
                          );
                        }}
                        className="border-[#E5E7EB] hover:border-[#1877F2] hover:bg-[#1877F2]/10 text-[#1877F2]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const referralUrl = `${window.location.origin}/ambassador/${profile?.username || ""}`;
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}`,
                            "_blank"
                          );
                        }}
                        className="border-[#E5E7EB] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 text-[#1DA1F2]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const referralUrl = `${window.location.origin}/ambassador/${profile?.username || ""}`;
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
                            "_blank"
                          );
                        }}
                        className="border-[#E5E7EB] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 text-[#0A66C2]"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>

                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-success mt-0.5 shrink-0" />
                        <div className="text-sm text-[#0F172A]">
                          <p className="font-medium mb-1">¿Qué es esto?</p>
                          <p className="text-[#64748B]">
                            Este es tu link personal de ambassador. Úsalo para invitar personas directamente 
                            a unirse como miembros o ambassadors de Travel Advantage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 6 - PERFIL */}
              <TabsContent value="perfil" className="space-y-6">
                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Información Personal</CardTitle>
                    <CardDescription className="text-[#64748B]">
                      Actualiza tus datos de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#E5E7EB]"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                          {profile?.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">Foto de perfil</p>
                        <p className="text-sm text-[#64748B] mb-2">
                          JPG o PNG. Máximo 2MB.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-[#E5E7EB] hover:border-primary hover:bg-[#F8FAFC]"
                        >
                          Cambiar foto
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0F172A]">
                          Nombre completo
                        </label>
                        <Input
                          value={profile?.full_name || ""}
                          readOnly
                          className="bg-white border-[#E2E8F0] text-[#475569]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0F172A]">
                          Email
                        </label>
                        <Input
                          value={profile?.email || ""}
                          readOnly
                          className="bg-white border-[#E2E8F0] text-[#475569]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0F172A]">
                          Código de referido
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={profile?.username || ""}
                            readOnly
                            className="bg-white border-[#E2E8F0] font-mono text-[#475569]"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(profile?.username || "");
                            }}
                            className="border-[#E2E8F0] hover:border-primary hover:bg-[#F1F5F9] transition-all"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#0F172A]">
                          Rol
                        </label>
                        <Input
                          value={profile?.role || ""}
                          readOnly
                          className="bg-white border-[#E2E8F0] capitalize text-[#475569]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E5E7EB]">
                      <Button 
                        variant="outline"
                        className="border-[#E5E7EB] hover:border-primary hover:bg-[#F8FAFC]"
                      >
                        Guardar cambios
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 7 - RECURSOS */}
              <TabsContent value="recursos" className="space-y-6">
                <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      Recursos de Marketing
                    </CardTitle>
                    <CardDescription className="text-[#64748B]">
                      Materiales para promocionar Travel Advantage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Gift className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                        Próximamente
                      </h3>
                      <p className="text-[#475569] mb-6 max-w-md mx-auto">
                        Esta sección contendrá imágenes, copys y materiales de marketing para compartir en redes sociales.
                      </p>
                      <Button
                        onClick={() => router.push("/admin/recursos")}
                        className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver página completa de recursos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 8 - EQUIPO */}
              <TabsContent value="equipo" className="space-y-6">
                {profile?.role === "admin" ? (
                  <>
                    <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Top del Equipo
                        </CardTitle>
                        <CardDescription className="text-[#64748B]">
                          Los más activos esta semana
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {teamStats.length === 0 ? (
                          <div className="text-center py-12 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                            <Network className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                            <p className="text-[#64748B]">Aún no hay datos de equipo disponibles</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {teamStats.slice(0, 3).map((member, index) => {
                              const medals = ["🥇", "🥈", "🥉"];
                              return (
                                <div
                                  key={member.user_id}
                                  className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB] hover:border-primary transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{medals[index]}</span>
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                      {member.full_name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-[#0F172A]">
                                        {member.full_name || (member as any).email || "Usuario"}
                                      </p>
                                      <p className="text-sm text-[#64748B]">
                                        {(member as any).active_days || 0} días activos esta semana
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-semibold text-[#0F172A]">
                                      {(member as any).completion_percentage || 0}%
                                    </div>
                                    <p className="text-sm text-[#64748B]">
                                      {member.total_points || 0} pts
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-[#0F172A]">Equipo Completo</CardTitle>
                        <CardDescription className="text-[#64748B]">
                          Vista detallada de todos los miembros
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {teamStats.length === 0 ? (
                          <div className="text-center py-12 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                            <Users className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                            <p className="text-[#64748B]">
                              No hay datos de equipo disponibles
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">
                                    Nombre
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">
                                    % Cumplimiento
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">
                                    Días Activos
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">
                                    Puntos
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#0F172A]">
                                    Última Actividad
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {teamStats.map((member) => (
                                  <tr
                                    key={member.user_id}
                                    className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors"
                                  >
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                          {member.full_name?.charAt(0) || "U"}
                                        </div>
                                        <span className="font-medium text-[#0F172A]">
                                          {member.full_name || (member as any).email || "Usuario"}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 max-w-[100px]">
                                          <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${(member as any).completion_percentage || 0}%` }}
                                          />
                                        </div>
                                        <span className="text-sm font-medium text-[#0F172A]">
                                          {(member as any).completion_percentage || 0}%
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-[#0F172A]">
                                      {(member as any).active_days || 0}/7
                                    </td>
                                    <td className="py-3 px-4">
                                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                        {member.total_points || 0}
                                      </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-[#64748B]">
                                      Hace {(member as any).days_since_last_activity || 0} días
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="bg-white border border-[#E5E7EB] shadow-sm">
                    <CardContent className="text-center py-12">
                      <Shield className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                      <p className="text-[#64748B]">
                        Solo los administradores pueden ver esta sección
                      </p>
                    </CardContent>
                  </Card>
                )}
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
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Mensajes Sugeridos con IA ✨
                  </DialogTitle>
                  <DialogDescription>
                    Templates personalizados para {selectedLead?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] pr-2">
                  {Object.entries(messageTemplates).map(([key, template]) => (
                    <div
                      key={key}
                      className="group relative overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 transition-all cursor-pointer bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/20"
                      onClick={() => {
                        if (selectedLead) {
                          sendWhatsAppMessage(selectedLead, key);
                        }
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className="p-5 relative z-10">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-3xl bg-gradient-to-br ${template.color} bg-clip-text">
                            {template.emoji}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                              {template.title}
                            </h4>
                          </div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/30">
                          <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">
                            {selectedLead ? template.template(selectedLead.name) : ""}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-green-600" />
                            WhatsApp
                          </span>
                          <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">
                            Click para enviar →
                          </span>
                        </div>
                      </div>
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
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-gray-800/50 rounded-full p-3 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {note.profiles?.full_name?.[0] || note.profiles?.username?.[0] || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {note.profiles?.full_name || note.profiles?.username || "Usuario"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(note.created_at).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                              </p>
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
        </main>
      </div>
    </>
  );
}