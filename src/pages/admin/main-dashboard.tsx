import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { 
  Users, Clock, MessageSquare, CheckCircle2, 
  Download, LogOut, Mail, Phone, Calendar, Target, Plus, Eye,
  LayoutGrid, Share2, Copy, Check, Info, BookOpen, Network, DollarSign, Gift,
  TrendingUp, TrendingDown, Minus, Shield, Link2, ExternalLink, Loader2, CheckCircle, User, Search, Hand, LayoutDashboard, PlayCircle, Zap, Upload, Circle, BarChart3
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
import { challengeService, type ChallengeTemplate, type UserChallengeProgress } from "@/services/challengeService";
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
  const [copiedLeads, setCopiedLeads] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  
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

  // Challenge sync (NEW)
  const [activeTemplate, setActiveTemplate] = useState<ChallengeTemplate | null>(null);
  const [userProgress, setUserProgress] = useState<UserChallengeProgress | null>(null);
  const [challengeProtocols, setChallengeProtocols] = useState<any[]>([]);
  const [allTemplates, setAllTemplates] = useState<ChallengeTemplate[]>([]);
  const [allUsersProgress, setAllUsersProgress] = useState<UserChallengeProgress[]>([]);

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

  const loadDashboardData = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/admin");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);

        // Load leads with error handling
        try {
          const leadsData = await leadsService.getLeads(session.user.id);
          setLeads(leadsData || []);
        } catch (error) {
          console.error("Error loading leads:", error);
          setLeads([]);
        }

        // Load network stats
        try {
          const networkData = await referralService.getNetworkStats(session.user.id);
          setStats(networkData);
        } catch (error) {
          console.error("Error loading network stats:", error);
        }

        // Load productivity stats
        try {
          const prodStats = await productivityService.getProductivityStats(session.user.id);
          setProductivityStats(prodStats);
        } catch (error) {
          console.error("Error loading productivity stats:", error);
        }

        // Load active challenge progress for protocols
        try {
          const activeChallenge = await challengeService.getUserActiveChallenge(session.user.id);
          if (activeChallenge) {
            const template = await challengeService.getActiveTemplate();
            if (template) {
              // Store protocols with completion status
              const protocolsWithStatus = template.protocols.slice(0, 5).map((p: any) => ({
                ...p,
                completed: activeChallenge.protocols_completed.includes(p.id)
              }));
              setChallengeProtocols(protocolsWithStatus);
            }
          }
        } catch (error) {
          console.error("Error loading challenge progress:", error);
        }

        // Load all challenge templates (for admin)
        try {
          const templates = await challengeService.getAllTemplates();
          setAllTemplates(templates);
        } catch (error) {
          console.error("Error loading templates:", error);
        }

        // Load all users' progress (for admin)
        try {
          const allProgress = await challengeService.getAllUsersProgress();
          setAllUsersProgress(allProgress);
        } catch (error) {
          console.error("Error loading all users progress:", error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

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

      // Load active challenge template
      const template = await challengeService.getActiveTemplate();
      setActiveTemplate(template);

      // Load user's active challenge progress
      const progress = await challengeService.getUserActiveChallenge(session.user.id);
      setUserProgress(progress);

      // Cargar estadísticas personales (mantener para el panel de resumen)
      const stats = await productivityService.getProductivityStats(session.user.id);
      setProductivityStats(stats);

      // Cargar estadísticas del equipo (solo admin)
      const currentProfile = userProfile || profile;
      if (currentProfile?.role === "admin") {
        const team = await productivityService.getTeamProductivityStats(session.user.id);
        console.log("Team stats loaded:", team);
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

      // If user has active challenge, update progress
      if (userProgress && activeTemplate) {
        // Get current protocols from template
        const updatedCompletedIds = activeTemplate.protocols
          .map((p, index) => {
            // Map old activity fields to protocol completion
            const isCompleted = 
              (index === 0 && todayActivity.contacted_prospects) ||
              (index === 1 && todayActivity.posted_content) ||
              (index === 2 && todayActivity.did_followup) ||
              (index === 3 && todayActivity.presented_business) ||
              (index === 4 && todayActivity.attended_training);
            
            return isCompleted ? p.id : null;
          })
          .filter(Boolean) as string[];

        const result = await challengeService.updateUserProgress(userProgress.id, {
          protocols_completed: updatedCompletedIds
        });

        if (result.success) {
          toast({
            title: "✅ Progreso guardado",
            description: "Tu actividad se sincronizó con el reto",
          });
          await loadProductivityData();
        } else {
          toast({
            title: "Error",
            description: result.error || "No se pudo guardar",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "⚠️ Sin reto activo",
          description: "Inicia el reto desde /reto para registrar tu progreso",
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

  useEffect(() => {
    loadDashboardData();

    // Realtime subscription for challenge progress
    if (profile?.id) {
      const channel = challengeService.subscribeToTemplateChanges((updatedTemplate) => {
        // Reload challenge protocols when template changes
        loadDashboardData();
      });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

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
                {profile?.role === "admin" && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/admin/reto-config")}
                    className="border-[#E2E8F0] hover:bg-[#F1F5F9] flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">Config Reto</span>
                  </Button>
                )}
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
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                        {template.emoji}
                                      </div>
                                      <p className="text-sm font-medium text-[#0F172A]">
                                        {template.name}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-[#475569] leading-relaxed">
                                    {template.template.replace("{{nombre}}", selectedLead.name)}
                                  </p>
                                </Card>
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

            {/* TAB 3 - MI RED */}
            {activeTab === "red" && (
              <div className="space-y-6">
                {/* Network Stats */}
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                  <Card className="bg-white border border-[#E2E8F0] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Total Ganado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A]">
                        ${(stats?.total_earned ?? 0).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E2E8F0] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Disponible
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A]">
                        ${(stats?.available_balance ?? 0).toFixed(2)}
                      </div>
                      {(stats?.available_balance ?? 0) >= 39.50 && (
                        <Button
                          size="sm"
                          onClick={requestWithdrawal}
                          className="mt-3"
                        >
                          Solicitar Retiro
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-[#E2E8F0] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" />
                        Referidos Directos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-semibold text-[#0F172A]">
                        {networkMembers.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Network Members */}
                <Card className="bg-white border border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle>Mi Red de Referidos</CardTitle>
                    <CardDescription>
                      Miembros que se han unido a través de tu enlace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {networkMembers.length === 0 ? (
                      <div className="text-center py-8">
                        <Network className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
                        <p className="text-[#64748B] mb-2">
                          Aún no tienes referidos en tu red
                        </p>
                        <p className="text-sm text-[#94A3B8]">
                          Comparte tu link personalizado para empezar a construir tu red
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {networkMembers.map((member: any) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-[#0F172A]">
                                  {member.full_name || member.username || member.email}
                                </p>
                                <p className="text-sm text-[#64748B]">
                                  {new Date(member.created_at).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {member.role || "member"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Commissions History */}
                {commissions.length > 0 && (
                  <Card className="bg-white border border-[#E2E8F0]">
                    <CardHeader>
                      <CardTitle>Historial de Comisiones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {commissions.map((commission) => (
                          <div
                            key={commission.id}
                            className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]"
                          >
                            <div>
                              <p className="font-medium text-[#0F172A]">
                                {commission.commission_type === "direct" ? "Comisión Directa" : "Comisión Indirecta"}
                              </p>
                              <p className="text-sm text-[#64748B]">
                                {new Date(commission.created_at).toLocaleDateString("es-ES")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-green-600">
                                +${commission.amount_usd.toFixed(2)}
                              </p>
                              <Badge variant="outline" className="mt-1">
                                {commission.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* TAB 4 - PRODUCTIVIDAD */}
            {activeTab === "productividad" && (
              <div className="space-y-8">
                {/* 1. SCORE DEL DÍA - Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Score Principal */}
                  <Card className="p-8 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Score de Hoy</h2>
                      {productivityStats && productivityStats.current_streak > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
                          <span className="text-lg">🔥</span>
                          <span className="text-sm font-medium text-orange-700">
                            Racha: {productivityStats.current_streak} {productivityStats.current_streak === 1 ? 'día' : 'días'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Circular Progress */}
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke={
                              (productivityStats?.daily_score || 0) >= 80 ? "#10B981" :
                              (productivityStats?.daily_score || 0) >= 50 ? "#F59E0B" :
                              "#EF4444"
                            }
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - (productivityStats?.daily_score || 0) / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span 
                            className="text-4xl font-bold"
                            style={{
                              color: 
                                (productivityStats?.daily_score || 0) >= 80 ? "#10B981" :
                                (productivityStats?.daily_score || 0) >= 50 ? "#F59E0B" :
                                "#EF4444"
                            }}
                          >
                            {Math.round(productivityStats?.daily_score || 0)}%
                          </span>
                        </div>
                      </div>

                      {/* Status & Message */}
                      <div className="flex-1">
                        <h3 
                          className="text-2xl font-semibold mb-2"
                          style={{
                            color: 
                              (productivityStats?.daily_score || 0) >= 80 ? "#10B981" :
                              (productivityStats?.daily_score || 0) >= 50 ? "#F59E0B" :
                              "#EF4444"
                          }}
                        >
                          {(productivityStats?.daily_score || 0) >= 80 ? "Productividad Alta" :
                           (productivityStats?.daily_score || 0) >= 50 ? "Productividad Media" :
                           "Productividad Baja"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {(productivityStats?.daily_score || 0) >= 80 
                            ? "¡Excelente! Mantén este ritmo" 
                            : (productivityStats?.daily_score || 0) >= 50
                            ? "Buen progreso, sigue así"
                            : `Te faltan ${Math.ceil((80 - (productivityStats?.daily_score || 0)) / 10)} acciones para nivel alto`
                          }
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            {productivityStats?.total_actions_today || 0} acciones completadas hoy
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {productivityStats?.contacts_today || 0}
                          </p>
                          <p className="text-xs text-gray-500">Contactos hoy</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {productivityStats?.follow_ups_today || 0}
                          </p>
                          <p className="text-xs text-gray-500">Seguimientos</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {productivityStats?.presentations_today || 0}
                          </p>
                          <p className="text-xs text-gray-500">Presentaciones</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Share2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {productivityStats?.posts_today || 0}
                          </p>
                          <p className="text-xs text-gray-500">Publicaciones</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* 2. ACTIVIDAD DIARIA - Protocolos del Reto Activo */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Actividad Diaria</h3>
                    {challengeProtocols.length > 0 ? (
                      <span className="text-sm text-gray-500">
                        {challengeProtocols.filter(p => p.completed).length} / {challengeProtocols.length} completados
                      </span>
                    ) : (
                      <Button
                        onClick={() => router.push("/reto")}
                        size="sm"
                        variant="outline"
                        className="text-sm"
                      >
                        Iniciar Reto
                      </Button>
                    )}
                  </div>

                  {challengeProtocols.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {challengeProtocols.map((protocol, index) => {
                        const colors = [
                          { bg: "bg-blue-50", border: "border-blue-100", bar: "bg-blue-500", text: "text-blue-700" },
                          { bg: "bg-green-50", border: "border-green-100", bar: "bg-green-500", text: "text-green-700" },
                          { bg: "bg-purple-50", border: "border-purple-100", bar: "bg-purple-500", text: "text-purple-700" },
                          { bg: "bg-orange-50", border: "border-orange-100", bar: "bg-orange-500", text: "text-orange-700" },
                          { bg: "bg-red-50", border: "border-red-100", bar: "bg-red-500", text: "text-red-700" }
                        ];
                        const color = colors[index % 5];

                        return (
                          <div key={protocol.id} className={`p-4 ${color.bg} border ${color.border} rounded-lg`}>
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700 line-clamp-2">
                                {protocol.label}
                              </span>
                              {protocol.completed && (
                                <CheckCircle2 className={`w-5 h-5 ${color.text} flex-shrink-0 ml-2`} />
                              )}
                            </div>
                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${color.bar} transition-all duration-300`}
                                style={{ width: protocol.completed ? "100%" : "0%" }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              {protocol.points} puntos
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-2">No hay reto activo</p>
                      <p className="text-sm text-gray-500 mb-4">Inicia el reto de 24 horas para ver tus protocolos aquí</p>
                      <Button
                        onClick={() => router.push("/reto")}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Ir al Reto
                      </Button>
                    </div>
                  )}
                </Card>

                {/* 3. RESÚMENES - Semanal, Mensual y Conversión */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Resumen Semanal */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Semanal</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Días activos</span>
                          <span className="text-sm font-medium text-gray-900">
                            {productivityStats?.active_days_week || 0}/7
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${((productivityStats?.active_days_week || 0) / 7) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Estado</span>
                        <span className={`text-sm font-medium ${
                          (productivityStats?.active_days_week || 0) >= 5 ? "text-green-600" :
                          (productivityStats?.active_days_week || 0) >= 3 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {(productivityStats?.active_days_week || 0) >= 5 ? "Alto" :
                           (productivityStats?.active_days_week || 0) >= 3 ? "Medio" :
                           "Bajo"}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Promedio diario</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round((productivityStats?.total_actions_week || 0) / 7)} acciones
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(productivityStats?.total_actions_week || 0) / 7 < 5 
                            ? "Por debajo del objetivo (5)" 
                            : "Objetivo alcanzado"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Resumen Mensual */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Mensual</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Días activos</span>
                          <span className="text-sm font-medium text-gray-900">
                            {productivityStats?.active_days_month || 0}/31
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 transition-all duration-300"
                            style={{ width: `${((productivityStats?.active_days_month || 0) / 31) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Consistencia</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(((productivityStats?.active_days_month || 0) / 31) * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Estado</span>
                        <span className={`text-sm font-medium ${
                          (productivityStats?.active_days_month || 0) >= 20 ? "text-green-600" :
                          (productivityStats?.active_days_month || 0) >= 10 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {(productivityStats?.active_days_month || 0) >= 20 ? "Alta" :
                           (productivityStats?.active_days_month || 0) >= 10 ? "Media" :
                           "Baja"}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Conversión */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversión</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Presentaciones</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {productivityStats?.presentations_total || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Decisiones</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {productivityStats?.decisions_total || 0}
                        </span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Tasa de conversión</span>
                          <span className={`text-2xl font-bold ${
                            ((productivityStats?.decisions_total || 0) / (productivityStats?.presentations_total || 1)) * 100 >= 25 
                              ? "text-green-600" 
                              : "text-yellow-600"
                          }`}>
                            {Math.round(((productivityStats?.decisions_total || 0) / (productivityStats?.presentations_total || 1)) * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Meta recomendada: 25%+
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Team Stats (Admin only) */}
                {profile?.role === "admin" && teamStats.length > 0 && (
                  <Card className="bg-white border border-[#E2E8F0]">
                    <CardHeader>
                      <CardTitle>Productividad del Equipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {teamStats.map((member) => (
                          <div
                            key={member.user_id}
                            className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]"
                          >
                            <div className="flex items-center gap-3">
                              {member.avatar_url ? (
                                <img src={member.avatar_url} alt={member.full_name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {member.full_name?.charAt(0) || "U"}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-[#0F172A]">
                                  {member.full_name}
                                </p>
                                <p className="text-sm text-[#64748B]">
                                  {member.days_active} días activos esta semana
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-[#0F172A]">
                                {member.total_points} puntos
                              </p>
                              <div className="flex items-center justify-end gap-2 mt-1">
                                <Badge variant={member.status === "active" ? "default" : member.status === "medium" ? "secondary" : "outline"}>
                                  {member.percentage}%
                                </Badge>
                                <span className="text-xs text-[#64748B] ml-2">{member.last_activity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 4. GRÁFICA DE TENDENCIA - Últimos 30 Días */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Tendencia de Productividad</h3>
                      <p className="text-sm text-gray-500 mt-1">Últimos 30 días</p>
                    </div>
                    {productivityStats?.monthly_data && productivityStats.monthly_data.length > 1 && (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const firstHalf = productivityStats.monthly_data.slice(0, 15);
                          const secondHalf = productivityStats.monthly_data.slice(15);
                          const avgFirst = firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length;
                          const avgSecond = secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length;
                          const trend = avgSecond > avgFirst ? 'up' : avgSecond < avgFirst ? 'down' : 'stable';
                          
                          return (
                            <>
                              {trend === 'up' && (
                                <>
                                  <TrendingUp className="w-5 h-5 text-green-600" />
                                  <span className="text-sm font-medium text-green-600">Subiendo</span>
                                </>
                              )}
                              {trend === 'down' && (
                                <>
                                  <TrendingDown className="w-5 h-5 text-red-600" />
                                  <span className="text-sm font-medium text-red-600">Bajando</span>
                                </>
                              )}
                              {trend === 'stable' && (
                                <>
                                  <Minus className="w-5 h-5 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-600">Estable</span>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {productivityStats?.monthly_data && productivityStats.monthly_data.length > 0 ? (
                    <div className="w-full h-64 relative">
                      <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={200 - (y * 2)}
                            x2="800"
                            y2={200 - (y * 2)}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Line chart */}
                        {(() => {
                          const points = productivityStats.monthly_data.map((d, i) => ({
                            x: (i / (productivityStats.monthly_data.length - 1)) * 800,
                            y: 200 - (d.score * 2)
                          }));

                          const pathD = points
                            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                            .join(' ');

                          return (
                            <>
                              {/* Area fill */}
                              <path
                                d={`${pathD} L 800 200 L 0 200 Z`}
                                fill="url(#gradient)"
                                opacity="0.2"
                              />
                              
                              {/* Line */}
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Gradient definition */}
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                              </defs>

                              {/* Points */}
                              {points.map((p, i) => (
                                <g key={i}>
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="4"
                                    fill="#3B82F6"
                                    stroke="white"
                                    strokeWidth="2"
                                  />
                                  {/* Show value on hover or every 5th point */}
                                  {(i % 5 === 0 || i === points.length - 1) && (
                                    <text
                                      x={p.x}
                                      y={p.y - 10}
                                      textAnchor="middle"
                                      fontSize="10"
                                      fill="#6B7280"
                                    >
                                      {productivityStats.monthly_data[i].score}%
                                    </text>
                                  )}
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>

                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                      </div>

                      {/* X-axis labels */}
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        {productivityStats.monthly_data
                          .filter((_, i) => i % 5 === 0 || i === productivityStats.monthly_data.length - 1)
                          .map((d, i) => (
                            <span key={i}>{d.day}</span>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No hay datos suficientes para mostrar la tendencia</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* TAB 5 - MIS LINKS */}
            {activeTab === "links" && (
              <div className="space-y-6">
                <Card className="bg-white border border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle>Link de Embudo de Registro</CardTitle>
                    <CardDescription>
                      Link directo para registro de leads con tu código de referido
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/leads-registro${profile?.username ? `?ref=${profile.username}` : ""}`}
                        readOnly
                        className="flex-1 bg-[#F8FAFC] border-[#E2E8F0]"
                      />
                      <Button
                        onClick={async () => {
                          const leadsUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/leads-registro${profile?.username ? `?ref=${profile.username}` : ""}`;
                          await navigator.clipboard.writeText(leadsUrl);
                          setCopiedLeads(true);
                          setTimeout(() => setCopiedLeads(false), 2000);
                          toast({
                            title: "¡Link copiado!",
                            description: "Link de registro copiado al portapapeles",
                          });
                        }}
                        variant="outline"
                      >
                        {copiedLeads ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => {
                          const leadsUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/leads-registro${profile?.username ? `?ref=${profile.username}` : ""}`;
                          window.open(leadsUrl, "_blank");
                        }}
                        className="flex-1"
                        variant="outline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir en nueva pestaña
                      </Button>
                      <Button
                        onClick={() => {
                          const leadsUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/leads-registro${profile?.username ? `?ref=${profile.username}` : ""}`;
                          const message = `📋 Regístrate aquí para recibir acceso exclusivo:\n\n${leadsUrl}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
                        }}
                        className="flex-1"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir por WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle>Link de Funnel de Referidos</CardTitle>
                    <CardDescription>
                      Comparte este link para capturar leads y ganar comisiones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={funnelUrl}
                        readOnly
                        className="flex-1 bg-[#F8FAFC] border-[#E2E8F0]"
                      />
                      <Button
                        onClick={async () => {
                          await navigator.clipboard.writeText(funnelUrl);
                          setCopiedFunnel(true);
                          setTimeout(() => setCopiedFunnel(false), 2000);
                          toast({
                            title: "¡Link copiado!",
                            description: "Pégalo donde quieras compartirlo",
                          });
                        }}
                        variant="outline"
                      >
                        {copiedFunnel ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => window.open(funnelUrl, "_blank")}
                        className="flex-1"
                        variant="outline"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir en nueva pestaña
                      </Button>
                      <Button
                        onClick={() => {
                          const message = `¡Descubre cómo viajar más por menos! 🌍✈️\n\n${funnelUrl}`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
                        }}
                        className="flex-1"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir por WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {profile?.mwr_link && (
                  <Card className="bg-white border border-[#E2E8F0]">
                    <CardHeader>
                      <CardTitle>Link MWR Personalizado</CardTitle>
                      <CardDescription>
                        Tu link de referidos para el programa MWR
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={profile.mwr_link}
                          readOnly
                          className="flex-1 bg-[#F8FAFC] border-[#E2E8F0]"
                        />
                        <Button
                          onClick={async () => {
                            await navigator.clipboard.writeText(profile.mwr_link || "");
                            setCopiedReferral(true);
                            setTimeout(() => setCopiedReferral(false), 2000);
                            toast({
                              title: "¡Link copiado!",
                              description: "Link MWR copiado al portapapeles",
                            });
                          }}
                          variant="outline"
                        >
                          {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* TAB 6 - PERFIL */}
            {activeTab === "perfil" && (
              <div className="space-y-6">
                <Card className="bg-white border border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      {profileForm.avatar_url ? (
                        <img
                          src={profileForm.avatar_url}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-[#F1F5F9] text-primary rounded-full flex items-center justify-center text-3xl font-semibold border-4 border-white shadow-lg">
                          {profileForm.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex-1">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 text-primary hover:text-primary/80">
                            <Upload className="w-4 h-4" />
                            <span className="font-medium">
                              {uploadingAvatar ? "Subiendo..." : "Cambiar foto"}
                            </span>
                          </div>
                        </Label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={uploadAvatar}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                        <p className="text-sm text-[#64748B] mt-1">
                          JPG, PNG o GIF. Máximo 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <Label>Nombre Completo</Label>
                        <Input
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            full_name: e.target.value
                          })}
                          placeholder="Juan Pérez"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Username (para links personalizados)</Label>
                        <Input
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                          })}
                          placeholder="juanperez"
                          className="mt-2"
                        />
                        <p className="text-sm text-[#64748B] mt-1">
                          Solo letras minúsculas y números, sin espacios
                        </p>
                      </div>

                      <div>
                        <Label>Link MWR Personalizado (opcional)</Label>
                        <Input
                          value={profileForm.mwr_link}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            mwr_link: e.target.value
                          })}
                          placeholder="https://tu-link-mwr.com"
                          className="mt-2"
                        />
                      </div>

                      <Button
                        onClick={updateProfile}
                        className="w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Configuration */}
                <Card className="bg-white border border-[#E2E8F0]">
                  <CardHeader>
                    <CardTitle>Billetera USDT (BSC)</CardTitle>
                    <CardDescription>
                      Configura tu dirección de billetera para recibir retiros
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Dirección de Billetera USDT (BEP-20)</Label>
                      <Input
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="0x..."
                        className="mt-2 font-mono"
                      />
                      <p className="text-sm text-[#64748B] mt-1">
                        Solo BEP-20 (Binance Smart Chain). Verifica bien la dirección.
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        try {
                          setSavingWallet(true);
                          const session = await authService.getCurrentSession();
                          if (!session) return;

                          const { error } = await supabase
                            .from("profiles")
                            .update({ usdt_wallet_address: walletAddress })
                            .eq("id", session.user.id);

                          if (error) throw error;

                          await loadData();
                          toast({
                            title: "✅ Billetera guardada",
                            description: "Tu dirección USDT se actualizó correctamente",
                          });
                        } catch (error) {
                          console.error("Error saving wallet:", error);
                          toast({
                            title: "Error",
                            description: "No se pudo guardar la billetera",
                            variant: "destructive",
                          });
                        } finally {
                          setSavingWallet(false);
                        }
                      }}
                      disabled={!walletAddress || savingWallet}
                      className="w-full"
                    >
                      {savingWallet ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      Guardar Billetera
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}