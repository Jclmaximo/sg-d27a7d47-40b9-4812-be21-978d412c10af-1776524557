import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { 
  Users, Clock, MessageSquare, CheckCircle2, 
  Download, LogOut, Mail, Phone, Calendar, Target, Plus, Eye,
  LayoutGrid, Share2, Copy, Check, Info, BookOpen, Network, DollarSign, Gift,
  TrendingUp, Shield, Link2, ExternalLink, Loader2, CheckCircle, User, Search, Hand, LayoutDashboard, PlayCircle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [leadNotes, setLeadNotes] = useState<any[]>([]);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

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

  // Load notes when lead is selected
  useEffect(() => {
    if (selectedLead) {
      loadLeadNotes(selectedLead.id);
    }
  }, [selectedLead]);

  const loadLeadNotes = async (leadId: string) => {
    try {
      setLoadingNotes(true);
      const notes = await leadsService.getLeadNotes(leadId);
      setLeadNotes(notes || []);
    } catch (error) {
      console.error("Error loading notes:", error);
      setLeadNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;

    try {
      setAddingNote(true);
      await leadsService.addLeadNote(selectedLead.id, newNote.trim());
      setNewNote("");
      await loadLeadNotes(selectedLead.id);
      toast({
        title: "Nota agregada",
        description: "La nota se guardó correctamente",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar la nota",
        variant: "destructive",
      });
    } finally {
      setAddingNote(false);
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

  useEffect(() => {
    loadData();
    loadMessageTemplates();
  }, []);

  const loadMessageTemplates = async () => {
    try {
      const templates = await leadsService.getMessageTemplates();
      setCustomTemplates(templates || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      setCustomTemplates([]);
    }
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
        <div className="bg-white border-b border-[#E2E8F0] mb-8">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Avatar + User Info */}
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#F1F5F9] text-[#2563EB] rounded-full flex items-center justify-center text-lg font-semibold border-2 border-white shadow-sm">
                    {profile?.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#64748B] mb-1">Bienvenido</p>
                  <h1 className="text-xl font-semibold text-[#0F172A]">
                    {profile?.full_name || "Usuario"}
                  </h1>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/reto")}
                  className="border-[#E2E8F0] hover:bg-[#F1F5F9] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Command Center</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await authService.signOut();
                      router.push("/admin");
                    } catch (error) {
                      console.error("Error al cerrar sesión:", error);
                    }
                  }}
                  className="text-[#64748B] hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Salir</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto w-full">
            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              <Button
                variant={activeTab === "resumen" ? "default" : "outline"}
                onClick={() => setActiveTab("resumen")}
                className="whitespace-nowrap"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Resumen
              </Button>
              <Button
                variant={activeTab === "leads" ? "default" : "outline"}
                onClick={() => setActiveTab("leads")}
                className="whitespace-nowrap"
              >
                <Users className="w-4 h-4 mr-2" />
                Leads
              </Button>
              <Button
                variant={activeTab === "red" ? "default" : "outline"}
                onClick={() => setActiveTab("red")}
                className="whitespace-nowrap"
              >
                <Network className="w-4 h-4 mr-2" />
                Mi Red
              </Button>
              <Button
                variant={activeTab === "productividad" ? "default" : "outline"}
                onClick={() => setActiveTab("productividad")}
                className="whitespace-nowrap"
              >
                <Target className="w-4 h-4 mr-2" />
                Productividad
              </Button>
              <Button
                variant={activeTab === "links" ? "default" : "outline"}
                onClick={() => setActiveTab("links")}
                className="whitespace-nowrap"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Mis Links
              </Button>
              <Button
                variant={activeTab === "perfil" ? "default" : "outline"}
                onClick={() => setActiveTab("perfil")}
                className="whitespace-nowrap"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </div>

            {/* TAB 1 - RESUMEN */}
            {activeTab === "resumen" && (
              <div className="space-y-6">
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
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Nuevos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "nuevo" || l.status === "new").length}
                      </div>
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
              </div>
            )}

            {/* TAB 2 - LEADS */}
            {activeTab === "leads" && (
              <div className="space-y-6">
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
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-[#0F172A]">
                        {allLeads.filter(l => l.status === "convertido" || l.status === "converted").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-[#E2E8F0]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-white border-[#E2E8F0]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="nuevo">Nuevos</SelectItem>
                      <SelectItem value="contactado">Contactados</SelectItem>
                      <SelectItem value="convertido">Convertidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Leads List */}
                <div className="space-y-4">
                  {filteredLeads.length === 0 ? (
                    <Card className="bg-white border border-[#E2E8F0]">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="w-12 h-12 text-[#CBD5E1] mb-4" />
                        <p className="text-[#64748B] text-center mb-2">
                          {searchTerm || statusFilter !== "all" 
                            ? "No se encontraron leads con ese filtro"
                            : "Aún no tienes leads capturados"}
                        </p>
                        <p className="text-sm text-[#94A3B8] text-center">
                          {!searchTerm && statusFilter === "all" && "Comparte tu link de embudo para empezar a capturar leads"}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredLeads.map((lead) => (
                      <Card key={lead.id} className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-lg font-semibold text-[#0F172A]">
                                  {lead.name}
                                </h3>
                                <Badge 
                                  variant={
                                    lead.status === "nuevo" || lead.status === "new" ? "secondary" :
                                    lead.status === "contactado" || lead.status === "contacted" ? "default" :
                                    "outline"
                                  }
                                  className="capitalize"
                                >
                                  {lead.status === "nuevo" || lead.status === "new" ? "Nuevo" :
                                   lead.status === "contactado" || lead.status === "contacted" ? "Contactado" :
                                   lead.status === "convertido" || lead.status === "converted" ? "Convertido" :
                                   lead.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#64748B]">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {lead.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(lead.created_at).toLocaleDateString("es-ES")}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const message = `Hola ${lead.name}, vi que te interesa Viaja Ligero. ¿Tienes alguna pregunta?`;
                                  window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
                                }}
                                className="border-[#E2E8F0] hover:bg-[#F1F5F9]"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Contactar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedLead(lead)}
                                className="border-[#E2E8F0] hover:bg-[#F1F5F9]"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Lead Details Modal */}
                <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Detalles del Lead</DialogTitle>
                      <DialogDescription>
                        Gestiona la información y seguimiento de este prospecto
                      </DialogDescription>
                    </DialogHeader>

                    {selectedLead && (
                      <div className="space-y-6">
                        {/* Lead Info */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-sm font-medium text-[#64748B]">Nombre</Label>
                            <p className="text-lg font-semibold text-[#0F172A] mt-1">{selectedLead.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[#64748B]">Estado</Label>
                            <Select
                              value={selectedLead.status}
                              onValueChange={async (newStatus) => {
                                try {
                                  await leadsService.updateLeadStatus(selectedLead.id, newStatus);
                                  setSelectedLead({ ...selectedLead, status: newStatus });
                                  const updatedLeads = allLeads.map(l => 
                                    l.id === selectedLead.id ? { ...l, status: newStatus } : l
                                  );
                                  setAllLeads(updatedLeads);
                                  toast({
                                    title: "Estado actualizado",
                                    description: `Lead marcado como ${newStatus}`,
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "No se pudo actualizar el estado",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nuevo">Nuevo</SelectItem>
                                <SelectItem value="contactado">Contactado</SelectItem>
                                <SelectItem value="convertido">Convertido</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[#64748B]">Email</Label>
                            <p className="text-[#0F172A] mt-1">{selectedLead.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[#64748B]">WhatsApp</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[#0F172A]">{selectedLead.phone}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const message = `Hola ${selectedLead.name}, vi que te interesa Viaja Ligero. ¿Tienes alguna pregunta?`;
                                  window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
                                }}
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[#64748B]">País</Label>
                            <p className="text-[#0F172A] mt-1">{selectedLead.country}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[#64748B]">Fecha de Captura</Label>
                            <p className="text-[#0F172A] mt-1">
                              {new Date(selectedLead.created_at).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Message Templates */}
                        <div>
                          <Label className="text-sm font-medium text-[#0F172A] mb-3 block">
                            📝 Biblioteca de Mensajes
                          </Label>
                          <div className="space-y-2">
                            {customTemplates.length === 0 ? (
                              <p className="text-sm text-[#64748B] py-4 text-center">
                                No hay plantillas guardadas
                              </p>
                            ) : (
                              customTemplates.map((template) => (
                                <Card
                                  key={template.id}
                                  className="p-4 hover:bg-[#F8FAFC] cursor-pointer transition-colors border-[#E2E8F0]"
                                  onClick={() => {
                                    const personalizedMessage = template.template
                                      .replace("{{nombre}}", selectedLead.name)
                                      .replace("{{email}}", selectedLead.email);
                                    navigator.clipboard.writeText(personalizedMessage);
                                    toast({
                                      title: "Mensaje copiado",
                                      description: "Pégalo en WhatsApp para enviarlo",
                                    });
                                  }}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-[#0F172A] mb-1">
                                        {template.name}
                                      </h4>
                                      <p className="text-sm text-[#64748B] line-clamp-2">
                                        {template.template.replace("{{nombre}}", selectedLead.name)}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const personalizedMessage = template.template
                                          .replace("{{nombre}}", selectedLead.name)
                                          .replace("{{email}}", selectedLead.email);
                                        navigator.clipboard.writeText(personalizedMessage);
                                        toast({
                                          title: "Copiado",
                                          description: "Mensaje listo para pegar",
                                        });
                                      }}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </Card>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div>
                          <Label className="text-sm font-medium text-[#0F172A] mb-3 block">
                            💬 Notas y Seguimiento
                          </Label>
                          
                          {/* Add Note Form */}
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Escribe una nota sobre este lead..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddNote();
                                }
                              }}
                              className="flex-1"
                            />
                            <Button
                              onClick={handleAddNote}
                              disabled={!newNote.trim() || addingNote}
                              size="sm"
                            >
                              {addingNote ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Agregar
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Notes List */}
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {loadingNotes ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                              </div>
                            ) : leadNotes.length === 0 ? (
                              <p className="text-sm text-[#64748B] text-center py-6">
                                No hay notas aún. Agrega la primera nota de seguimiento.
                              </p>
                            ) : (
                              leadNotes.map((note) => (
                                <div
                                  key={note.id}
                                  className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]"
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary">
                                          {note.profiles?.full_name?.charAt(0) || note.profiles?.username?.charAt(0) || "U"}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-[#0F172A]">
                                          {note.profiles?.full_name || note.profiles?.username || "Usuario"}
                                        </p>
                                        <p className="text-xs text-[#64748B]">
                                          {new Date(note.created_at).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-[#475569]">{note.note}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}