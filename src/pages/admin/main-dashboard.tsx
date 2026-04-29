import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { 
  Users, Clock, MessageSquare, CheckCircle2, 
  Download, LogOut, Mail, Phone, Calendar, Target, Plus, Eye,
  LayoutGrid, Share2, Copy, Check, Info, BookOpen, Network, DollarSign, Gift,
  TrendingUp, TrendingDown, Minus, Shield, Link2, ExternalLink, Loader2, CheckCircle, User, Search, Hand, LayoutDashboard, PlayCircle, Zap, Upload, Circle, BarChart3, ChevronRight, Award, Save, Edit
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
  mwr_custom_link?: string | null;
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
  const [profile, setProfile] = useState<any>(null);
  
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
  const [mwrCustomLink, setMwrCustomLink] = useState("");
  const [isEditingMwrLink, setIsEditingMwrLink] = useState(false);
  const [mwrLinkError, setMwrLinkError] = useState("");
  
  // Wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [isEditingWallet, setIsEditingWallet] = useState(false);

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

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "¡Copiado!",
        description: successMessage,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
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
        setMwrCustomLink(profileData.mwr_custom_link || "");
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

            {/* TAB: LINKS */}
            {activeTab === "links" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Link de Registro */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">Link de Registro</h3>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-600 break-all font-mono">
                        {typeof window !== "undefined" ? `${window.location.origin}/leads-registro?ref=${profile?.username || ''}` : ''}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/leads-registro?ref=${profile?.username || ''}` : '';
                        copyToClipboard(link, "Link de registro copiado");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Link
                    </Button>
                  </div>

                  {/* Link MWR Personalizado */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">Link MWR Personalizado</h3>
                        <Badge variant="secondary" className="text-xs">Opcional</Badge>
                      </div>
                    </div>

                    {isEditingMwrLink ? (
                      <div className="space-y-3">
                        <div>
                          <Input
                            type="url"
                            value={mwrCustomLink}
                            onChange={(e) => {
                              setMwrCustomLink(e.target.value);
                              setMwrLinkError("");
                            }}
                            placeholder="https://tu-landing-personalizada.com"
                            className={mwrLinkError ? "border-red-500" : ""}
                          />
                          {mwrLinkError && (
                            <p className="text-xs text-red-500 mt-1">{mwrLinkError}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Ejemplo: https://mwr.hubia.vip/leads-registro
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={async () => {
                              const trimmedLink = mwrCustomLink.trim();
                              
                              if (trimmedLink && !/^https?:\/\/.+\..+/.test(trimmedLink)) {
                                setMwrLinkError("Por favor ingresa una URL válida (debe comenzar con https:// o http://)");
                                return;
                              }

                              const { error } = await supabase
                                .from("profiles")
                                .update({ mwr_custom_link: trimmedLink || null })
                                .eq("id", profile.id);

                              if (error) {
                                toast({
                                  title: "Error",
                                  description: "No se pudo guardar el link",
                                  variant: "destructive",
                                });
                              } else {
                                setProfile({ ...profile, mwr_custom_link: trimmedLink });
                                setIsEditingMwrLink(false);
                                toast({
                                  title: "¡Guardado!",
                                  description: "Link MWR actualizado correctamente",
                                });
                              }
                            }}
                            className="flex-1"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                          </Button>
                          <Button
                            onClick={() => {
                              setMwrCustomLink(profile?.mwr_custom_link || "");
                              setIsEditingMwrLink(false);
                              setMwrLinkError("");
                            }}
                            variant="outline"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-600 break-all font-mono">
                            {profile?.mwr_custom_link || `https://mwr.hubia.vip/leads-registro?ref=${profile?.username || ''}`}
                          </p>
                          {!profile?.mwr_custom_link && (
                            <p className="text-xs text-gray-400 mt-2">Por defecto (no personalizado)</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const link = profile?.mwr_custom_link || `https://mwr.hubia.vip/leads-registro?ref=${profile?.username || ''}`;
                              copyToClipboard(link, "Link MWR copiado");
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Link
                          </Button>
                          <Button
                            onClick={() => setIsEditingMwrLink(true)}
                            variant="outline"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs: Placeholder for now - you had full content before */}
            {activeTab === "resumen" && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tab Resumen - Contenido restaurado próximamente</p>
              </div>
            )}
            {activeTab === "leads" && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tab Leads - Contenido restaurado próximamente</p>
              </div>
            )}
            {activeTab === "red" && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tab Red - Contenido restaurado próximamente</p>
              </div>
            )}
            {activeTab === "productividad" && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tab Productividad - Contenido restaurado próximamente</p>
              </div>
            )}
            {activeTab === "perfil" && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tab Perfil - Contenido restaurado próximamente</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}