import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { productivityService } from "@/services/productivityService";
import { challengeService, type ChallengeProtocol, type ChallengeTemplate, type UserChallengeProgress } from "@/services/challengeService";
import { SEO } from "@/components/SEO";
// Deploy trigger: fix funnelLink error and force vercel deployment
import { 
  Play, Pause, Copy, Check, Share2, Focus, 
  Circle, CheckCircle2, Maximize2, Minimize2,
  Zap, Users, BookOpen, Lock, Instagram, TrendingUp, LogOut, Clock, ExternalLink, Trophy, Target, BarChart3, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
}

interface DailyProtocol {
  id: string;
  label: string;
  completed: boolean;
  points: number;
}

export default function ZenCommandCenter() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challengeActive, setChallengeActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays, setTotalDays] = useState(7);
  const [leadsCount, setLeadsCount] = useState(0);
  const [copyCount, setCopyCount] = useState(0);
  const [navigationVisible, setNavigationVisible] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [protocols, setProtocols] = useState<DailyProtocol[]>([]);
  
  // NEW: Dynamic template & progress
  const [activeTemplate, setActiveTemplate] = useState<ChallengeTemplate | null>(null);
  const [userProgress, setUserProgress] = useState<UserChallengeProgress | null>(null);

  // NUEVOS ESTADOS - Sistema de Desbloqueo
  const [shareCount, setShareCount] = useState(0);
  const [leadsUnlocked, setLeadsUnlocked] = useState(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useState(false);
  const [previousLeadsCount, setPreviousLeadsCount] = useState(0);
  
  // Productivity stats for streak
  const [currentStreak, setCurrentStreak] = useState(0);

  // Define funnelLink early so it can be used in JSX
  const funnelLink = profile?.username ? `https://mwr.hubia.vip/leads-registro?ref=${profile.username}` : "";

  useEffect(() => {
    loadData();
  }, []);

  // Calculate time until end of day (23:59:59) based on user's local timezone
  useEffect(() => {
    const calculateTimeUntilEndOfDay = () => {
      const now = new Date();
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59, 999
      );
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) {
        // Past midnight - new day starts
        return { hours: 23, minutes: 59, seconds: 59 };
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeUntilEndOfDay());

    // Update every second
    const interval = setInterval(() => {
      const newTime = calculateTimeUntilEndOfDay();
      setTimeLeft(newTime);
      
      // Reset at midnight (when all values are max again)
      if (newTime.hours === 23 && newTime.minutes === 59 && newTime.seconds === 59) {
        // New day - could trigger data refresh here
        console.log("🌅 Nuevo día comenzado - Reset automático");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // REALTIME: Subscribe to template changes from admin
  useEffect(() => {
    if (!activeTemplate) return;

    const channel = challengeService.subscribeToTemplateChanges((updatedTemplate) => {
      setActiveTemplate(updatedTemplate);
      
      // Rebuild protocols with updated template
      if (userProgress) {
        const updatedProtocols = updatedTemplate.protocols.map((p: ChallengeProtocol) => ({
          ...p,
          completed: userProgress.protocols_completed.includes(p.id)
        }));
        setProtocols(updatedProtocols as DailyProtocol[]);
      } else {
        const newProtocols = updatedTemplate.protocols.map((p: ChallengeProtocol) => ({
          ...p,
          completed: false
        }));
        setProtocols(newProtocols as DailyProtocol[]);
      }

      toast({
        title: "🔄 Reto actualizado",
        description: "El administrador ha modificado las tareas del reto",
        duration: 4000,
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTemplate, userProgress, toast]);

  // Auto-reset challenge when countdown reaches 0
  useEffect(() => {
    if (challengeActive && timeLeft.seconds === 0 && timeLeft.minutes === 0 && timeLeft.hours === 0) {
      const resetChallenge = async () => {
        // Reset all states
        setChallengeActive(false);
        setTimeLeft({ hours: 23, minutes: 59, seconds: 59 });
        setCopyCount(0);
        setProtocols([]);

        // Save reset state to database
        await saveChallengeState({
          challengeActive: false,
          copyCount: 0,
          protocols: []
        });

        toast({
          title: "🎉 Reto Completado",
          description: "24 horas cumplidas. ¡Puedes iniciar un nuevo reto!",
          duration: 5000,
        });
      };

      resetChallenge();
    }
  }, [challengeActive, timeLeft, toast]);

  // Show navigation dock when challenge starts
  useEffect(() => {
    if (challengeActive) {
      setNavigationVisible(true);
    }
  }, [challengeActive]);

  // NUEVO - Detectar primer lead y desbloquear
  useEffect(() => {
    if (leadsCount > 0 && previousLeadsCount === 0 && !leadsUnlocked) {
      setLeadsUnlocked(true);
      toast({
        title: "Primer contacto detectado",
        description: "Módulo de Gestión Activado",
        duration: 5000,
      });
    }
    setPreviousLeadsCount(leadsCount);
  }, [leadsCount, previousLeadsCount, leadsUnlocked, toast]);

  // Supabase Realtime para leads
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase.channel(`leads-realtime-${profile.id}`);
    
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `referred_by=eq.${profile.id}`,
        },
        async (payload) => {
          console.log("Lead realtime update:", payload);
          try {
            const leads = await leadsService.getLeads(profile.id);
            setLeadsCount(leads.length);
            
            const tracker = document.getElementById("lead-tracker");
            if (tracker) {
              tracker.classList.add("scale-110", "text-primary");
              setTimeout(() => tracker.classList.remove("scale-110", "text-primary"), 500);
            }
          } catch (error) {
            console.error("Error reloading leads:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const loadShareCount = () => {
    const saved = localStorage.getItem("reto_share_count");
    if (saved) {
      const count = parseInt(saved, 10);
      setCopyCount(count);
      if (count >= 5) {
        setResourcesUnlocked(true);
      }
    }
  };

  const incrementShareCount = () => {
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem("reto_share_count", newCount.toString());

    if (newCount >= 5 && !resourcesUnlocked) {
      setResourcesUnlocked(true);
      toast({
        title: "🎉 Meta alcanzada",
        description: "Has copiado tu link 5 veces. Recursos desbloqueados",
        duration: 5000,
      });
    }
  };

  const loadData = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/admin");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profileData) {
        console.error("Profile load error:", error);
        router.push("/admin");
        return;
      }

      setProfile(profileData as UserProfile);

      // Load active template from database
      const template = await challengeService.getActiveTemplate();
      setActiveTemplate(template);

      // Load user's active challenge progress
      const progress = await challengeService.getUserActiveChallenge(session.user.id);
      
      if (progress) {
        setUserProgress(progress);
        setChallengeActive(true);
        setNavigationVisible(true);
        
        // Calculate current day based on start date
        if (progress.started_at) {
          const startDate = new Date(progress.started_at);
          const today = new Date();
          startDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          setCurrentDay(Math.min(daysDiff + 1, totalDays));
        }

        // Ya no calculamos el timeLeft desde el inicio, sino hasta el final del día
        // (esto ya se maneja en el useEffect del timer principal)
        
        setCopyCount(progress.copy_count);
        
        // Build protocols from template + user progress
        if (template) {
          const protocolsWithCompletion = template.protocols.map((p: ChallengeProtocol) => ({
            ...p,
            completed: progress.protocols_completed.includes(p.id)
          }));
          setProtocols(protocolsWithCompletion as DailyProtocol[]);
        }
      } else if (template) {
        // No active progress, use template protocols as base
        const defaultProtocols = template.protocols.map((p: ChallengeProtocol) => ({
          ...p,
          completed: false
        }));
        setProtocols(defaultProtocols as DailyProtocol[]);
      }

      // Load leads with error handling
      try {
        const leads = await leadsService.getLeads(session.user.id);
        setLeadsCount(leads?.length || 0);
      } catch (leadError) {
        console.error("Error loading leads:", leadError);
        setLeadsCount(0);
      }

      // Load productivity stats for streak
      try {
        const stats = await productivityService.getProductivityStats(session.user.id);
        if (stats) {
          setCurrentStreak(stats.current_streak || 0);
        }
      } catch (statsError) {
        console.error("Error loading productivity stats:", statsError);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const toggleProtocol = async (id: number | string) => {
    const protocol = protocols.find(p => Number(p.id) === Number(id));
    if (!protocol) return;

    const updatedProtocols = protocols.map((p) =>
      Number(p.id) === Number(id) ? { ...p, completed: !p.completed } : p
    );
    setProtocols(updatedProtocols);

    // Update in database if user has active progress
    if (userProgress) {
      const completedIds = updatedProtocols
        .filter(p => p.completed)
        .map(p => p.id);

      await challengeService.updateUserProgress(userProgress.id, {
        protocols_completed: completedIds
      });
    }
  };

  const copyFunnelLink = async () => {
    const link = profile?.username ? `https://mwr.hubia.vip/leads-registro?ref=${profile.username}` : "";
    navigator.clipboard.writeText(link);
    const newCount = copyCount + 1;
    setCopyCount(newCount);
    await saveChallengeState({ copyCount: newCount });
    
    // Save to localStorage for resources unlock (keeping backward compatibility)
    localStorage.setItem("reto_share_count", newCount.toString());
    
    // Auto-complete protocol when reached 5 copies
    if (newCount === 5) {
      const updatedProtocols = protocols.map((p) =>
        Number(p.id) === 1 ? { ...p, completed: true } : p
      );
      setProtocols(updatedProtocols as DailyProtocol[]);
      await saveChallengeState({ protocols: updatedProtocols as DailyProtocol[] });
      
      // Unlock resources
      setResourcesUnlocked(true);
      toast({
        title: "🎉 Recursos Desbloqueados",
        description: "Has copiado el link 5 veces. Bóveda de Recursos activada",
        duration: 5000,
      });
    }
  };

  const shareToWhatsApp = () => {
    const funnelUrl = `https://mwr.hubia.vip/leads-registro?ref=${profile?.username || ""}`;
    const message = encodeURIComponent(`¡Descubre cómo viajar más por menos! ${funnelUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareToInstagram = () => {
    const funnelUrl = `https://mwr.hubia.vip/leads-registro?ref=${profile?.username || ""}`;
    navigator.clipboard.writeText(funnelUrl);
    toast({
      title: "Link copiado",
      description: "Pégalo en tu historia de Instagram",
      duration: 3000,
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const completionPercentage = (protocols.filter((p) => p.completed).length / protocols.length) * 100;

  // Dynamic color based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return { stroke: "#E5E7EB", text: "#6B7280", glow: false };
    if (percentage <= 30) return { stroke: "#DC2626", text: "#DC2626", glow: false }; // Rojo fuerte
    if (percentage <= 49) return { stroke: "#F87171", text: "#EF4444", glow: false }; // Rojo suave
    if (percentage <= 65) return { stroke: "#FBBF24", text: "#F59E0B", glow: false }; // Amarillo bajo
    if (percentage <= 79) return { stroke: "#FACC15", text: "#EAB308", glow: false }; // Amarillo alto
    if (percentage <= 90) return { stroke: "#10B981", text: "#059669", glow: false }; // Verde
    return { stroke: "#047857", text: "#047857", glow: false }; // Verde intenso (sin glow)
  };

  const progressColor = getProgressColor(completionPercentage);

  const saveChallengeState = async (updates: {
    challengeActive?: boolean;
    startTime?: string;
    copyCount?: number;
    protocols?: DailyProtocol[];
  }) => {
    if (!profile?.id) return;

    try {
      const updateData: any = {};
      
      if (updates.challengeActive !== undefined) {
        updateData.challenge_active = updates.challengeActive;
      }
      
      if (updates.startTime) {
        updateData.challenge_start_time = updates.startTime;
      }
      
      if (updates.copyCount !== undefined) {
        updateData.challenge_copy_count = updates.copyCount;
      }
      
      if (updates.protocols) {
        updateData.challenge_protocols = updates.protocols;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profile.id);

      if (error) {
        console.error("Error saving challenge state:", error);
      }
    } catch (error) {
      console.error("Error saving challenge state:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1D1D1F] text-sm font-light">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Reto 24 Horas - Zen Command Center"
        description="Tu centro de comando minimalista para hacer crecer tu negocio en 24 horas"
      />

      <style jsx global>{`
        @keyframes unlock-pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 rgba(66, 133, 244, 0);
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.9;
            box-shadow: 0 0 20px rgba(66, 133, 244, 0.4);
          }
        }
        
        .unlock-animation {
          animation: unlock-pulse 0.8s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Fixed header with navigation */}
        {navigationVisible && (
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              {/* Left: Title */}
              <h1 className="text-xl font-bold text-[#1D1D1F]">Reto 24 Horas</h1>

              {/* Center: User profile */}
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Usuario"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-[#1D1D1F]">
                    {profile?.full_name || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{profile?.username || "usuario"}
                  </p>
                </div>
              </div>

              {/* Right: Exit button */}
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/main-dashboard")}
                className="text-gray-600 hover:text-[#1D1D1F]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Salir</span>
              </Button>
            </div>
          </div>
        )}

        {/* Main content with top padding to account for fixed header */}
        <div className="pt-20">
          <div className={`max-w-7xl mx-auto px-6 py-12 ${focusMode ? "hidden" : ""}`}>
            
            {/* HERO SECTION - Show when challenge is NOT active */}
            {!challengeActive && activeTemplate && (
              <div className="max-w-3xl mx-auto text-center py-6 md:py-16">
                <div className="mb-6 md:mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 md:mb-6">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Reto de Productividad</span>
                  </div>
                  <p className="text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto">
                    {activeTemplate.description}
                  </p>
                </div>

                {/* Challenge info - Compact grid for mobile */}
                <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-12">
                  <Card className="p-4 md:p-6 text-center border-gray-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                      <Circle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-[#1D1D1F] text-sm md:text-base mb-1 md:mb-2">Duración</h3>
                    <p className="text-xs md:text-sm text-gray-600">7 días</p>
                  </Card>

                  <Card className="p-4 md:p-6 text-center border-gray-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-[#1D1D1F] text-sm md:text-base mb-1 md:mb-2">Protocolos</h3>
                    <p className="text-xs md:text-sm text-gray-600">{activeTemplate.protocols.length} acciones</p>
                  </Card>

                  <Card className="p-4 md:p-6 text-center border-gray-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-[#1D1D1F] text-sm md:text-base mb-1 md:mb-2">Objetivo</h3>
                    <p className="text-xs md:text-sm text-gray-600">Hábitos productivos</p>
                  </Card>
                </div>

                {/* Start button */}
                <Button
                  onClick={async () => {
                    if (!profile?.id || !activeTemplate) return;

                    try {
                      // Create new challenge in database
                      const response = await challengeService.startUserChallenge(
                        profile.id,
                        activeTemplate.id
                      );

                      if (response.success && response.data) {
                        setUserProgress(response.data);
                        setChallengeActive(true);
                        setNavigationVisible(true);
                        setCurrentDay(1);

                        // Initialize protocols from template
                        const initialProtocols = activeTemplate.protocols.map((p: ChallengeProtocol) => ({
                          ...p,
                          completed: false
                        }));
                        setProtocols(initialProtocols as DailyProtocol[]);

                        toast({
                          title: "✅ Reto iniciado",
                          description: "Comienza tu día. Los protocolos se reinician a las 00:00",
                          duration: 5000,
                        });
                      } else {
                        throw new Error(response.error || "No se pudo crear el reto");
                      }
                    } catch (error) {
                      console.error("Error starting challenge:", error);
                      toast({
                        title: "❌ Error",
                        description: "No se pudo iniciar el reto. Intenta de nuevo.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-8 md:px-12 py-4 md:py-6 text-base md:text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                  Iniciar Reto Ahora
                </Button>

                <p className="text-xs md:text-sm text-gray-500 mt-4 md:mt-6">
                  El reto comienza hoy y se reinicia cada día a las 00:00
                </p>
              </div>
            )}

            {/* A. PRUEBA SOCIAL - Contador de progreso de streak */}
            <div className="grid gap-6">
              {/* B. ESCASEZ - Cuenta regresiva del día */}
              {challengeActive && (
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-3xl p-4 md:p-8 shadow-lg border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary animate-pulse" />
                    <p className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider">
                      Tiempo Restante del Día
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                    {/* Hours */}
                    <div className="text-center">
                      <div className="bg-white rounded-xl md:rounded-2xl w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mb-2 md:mb-3 shadow-md border-2 border-primary/20 hover:border-primary/40 transition-all">
                        <span className="text-2xl md:text-4xl font-bold text-[#1D1D1F] tabular-nums">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#64748B] font-medium uppercase tracking-wide">Horas</p>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center pb-6 md:pb-8">
                      <span className="text-xl md:text-3xl font-light text-primary">:</span>
                    </div>

                    {/* Minutes */}
                    <div className="text-center">
                      <div className="bg-white rounded-xl md:rounded-2xl w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mb-2 md:mb-3 shadow-md border-2 border-primary/20 hover:border-primary/40 transition-all">
                        <span className="text-2xl md:text-4xl font-bold text-[#1D1D1F] tabular-nums">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#64748B] font-medium uppercase tracking-wide">Minutos</p>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center pb-6 md:pb-8">
                      <span className="text-xl md:text-3xl font-light text-primary">:</span>
                    </div>

                    {/* Seconds */}
                    <div className="text-center">
                      <div className="bg-white rounded-xl md:rounded-2xl w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mb-2 md:mb-3 shadow-md border-2 border-secondary/30 hover:border-secondary/50 transition-all">
                        <span className="text-2xl md:text-4xl font-bold text-[#1D1D1F] tabular-nums">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-[#64748B] font-medium uppercase tracking-wide">Segundos</p>
                    </div>
                  </div>

                  {/* Day counter indicator with progress bar */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full shadow-sm border border-primary/20">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-pulse"></div>
                      <p className="text-xs md:text-sm text-[#475569] font-medium">
                        Día <span className="font-bold text-primary">{currentDay}</span> de {totalDays}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* B. SCORE DE HOY - Progreso prominente */}
            {challengeActive && (
              <div className="mb-16 transition-all duration-500">
                <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-6 text-center">
                  Score de Hoy
                </p>
                
                <div className="max-w-2xl mx-auto">
                  <Card className="backdrop-blur-xl bg-white border border-gray-100 shadow-sm p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
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
                            stroke={progressColor.stroke}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                            style={progressColor.glow ? {
                              filter: "drop-shadow(0 0 8px rgba(4, 120, 87, 0.6))"
                            } : {}}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span 
                            className="text-4xl font-light transition-colors duration-500"
                            style={{ color: progressColor.text }}
                          >
                            {Math.round(completionPercentage)}%
                          </span>
                        </div>
                      </div>

                      {/* Status & Message */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 
                          className="text-2xl font-light mb-2 transition-colors duration-500"
                          style={{ color: progressColor.text }}
                        >
                          {completionPercentage === 0 ? "Comienza ahora" :
                           completionPercentage < 40 ? "Productividad baja" :
                           completionPercentage < 80 ? "Productividad media" :
                           completionPercentage < 100 ? "Casi lo logras" : "¡Objetivo alcanzado!"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 font-light">
                          {completionPercentage === 0 ? "Empieza marcando tu primer protocolo" :
                           completionPercentage < 40 ? "Sigue así para alcanzar tu objetivo" :
                           completionPercentage < 80 ? "Buen progreso. Continúa con el siguiente protocolo" :
                           completionPercentage < 100 ? "¡Estás muy cerca! Un protocolo más" : "Has completado todos los protocolos del día"}
                        </p>
                        {completionPercentage < 100 && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            <span className="text-sm text-amber-700 font-light">
                              Estás a {protocols.filter(p => !p.completed).length} {protocols.filter(p => !p.completed).length === 1 ? 'acción' : 'acciones'} de completar el día
                            </span>
                          </div>
                        )}
                        {completionPercentage === 100 && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm text-emerald-700 font-light">
                              ¡Todos los protocolos completados! 🎉
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* C. PROTOCOLOS - Daily action checklist */}
            {challengeActive && (
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-3xl p-6 md:p-8 shadow-lg border border-primary/20 mb-24">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-primary uppercase tracking-wider">
                    Protocolos de Hoy
                  </h2>
                </div>

                <div className="space-y-3 mb-8">
                  {protocols.map((protocol) => (
                    <div
                      key={protocol.id}
                      onClick={() => toggleProtocol(protocol.id)}
                      className={`
                        bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200 
                        border-2 hover:shadow-md
                        ${
                          protocol.completed
                            ? "border-primary/40 shadow-sm"
                            : "border-gray-200 hover:border-primary/30"
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div
                          className={`
                            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${
                              protocol.completed
                                ? "bg-primary border-primary"
                                : "border-gray-300 hover:border-primary"
                            }
                          `}
                        >
                          {protocol.completed && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium transition-all ${
                              protocol.completed
                                ? "text-primary line-through"
                                : "text-[#1D1D1F]"
                            }`}
                          >
                            {protocol.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Referral link section */}
                <div className="bg-white rounded-2xl p-6 border-2 border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1D1D1F]">Comparte tu link</h3>
                      <p className="text-xs text-gray-500">Invita a otros a unirse</p>
                    </div>
                  </div>
                  
                  <a
                    href={`https://mwr.hubia.vip/leads-registro?ref=${profile?.username || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary hover:bg-primary/90 text-white text-center py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir embudo de registro</span>
                    </div>
                  </a>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Tu referido: {profile?.username || "cargando..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* MODO ENFOQUE - Pantalla Completa */}
          {focusMode && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-extralight text-[#1D1D1F]">Modo Enfoque</h2>
                <Button
                  variant="ghost"
                  onClick={() => setFocusMode(false)}
                  className="text-[#1D1D1F] hover:bg-gray-50 font-light"
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-12">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="mb-12">
                    <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <p className="text-sm font-light text-gray-500">
                      {protocols.filter((p) => p.completed).length} de {protocols.length} completados
                    </p>
                  </div>
                  
                  {protocols.map((protocol) => (
                    <button
                      key={protocol.id}
                      onClick={() => toggleProtocol(parseInt(protocol.id, 10))}
                      className="w-full flex items-center gap-6 p-8 rounded-3xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all text-left"
                    >
                      <div className="relative">
                        {protocol.completed ? (
                          <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={1} />
                        ) : (
                          <Circle className="w-8 h-8 text-gray-300" strokeWidth={1} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-lg font-light ${protocol.completed ? "line-through text-gray-400" : "text-[#1D1D1F]"}`}>
                          {protocol.label}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Dock - Invisible hasta iniciar reto */}
          <div
            className={`
              fixed bottom-8 left-1/2 -translate-x-1/2 z-50
              transition-all duration-700 ease-out
              ${navigationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
            `}
          >
            <div className="backdrop-blur-xl bg-white/80 border border-gray-100/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-3">
              <div className="flex items-center gap-2">
                {/* Centro de Comando - Siempre activo */}
                <button
                  onClick={() => router.push("/reto")}
                  className="group relative p-4 rounded-xl hover:bg-white/50 transition-all"
                >
                  <Zap className="w-6 h-6 text-[#4285F4] stroke-[1.5]" />
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Centro de Comando
                  </span>
                </button>

                {/* Divisor */}
                <div className="w-px h-8 bg-gray-200/50" />

                {/* Gestión de Leads - Bloqueado hasta primer lead */}
                <button
                  onClick={() => {
                    if (leadsUnlocked) {
                      router.push("/admin/main-dashboard?tab=leads");
                    }
                  }}
                  disabled={!leadsUnlocked}
                  className={`
                    group relative p-4 rounded-xl transition-all
                    ${leadsUnlocked 
                      ? "hover:bg-white/80 cursor-pointer shadow-sm unlock-animation" 
                      : "opacity-40 cursor-not-allowed hover:bg-gray-50/50"
                    }
                  `}
                >
                  {!leadsUnlocked && (
                    <Lock className="absolute top-2 right-2 w-3 h-3 text-gray-400 group-hover:text-red-400 transition-colors" />
                  )}
                  <Users className={`w-6 h-6 stroke-[1.5] ${leadsUnlocked ? "text-[#4285F4]" : "text-gray-400"}`} />
                  {/* Badge with lead count */}
                  {leadsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {leadsCount}
                    </span>
                  )}
                  {leadsUnlocked && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Gestión de Leads
                    </span>
                  )}
                  {!leadsUnlocked && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-center">
                      Bloqueado<br/>Necesitas 1 lead
                    </span>
                  )}
                </button>

                {/* Divisor */}
                <div className="w-px h-8 bg-gray-200/50" />

                {/* Bóveda de Recursos - Bloqueado hasta 5 shares */}
                <button
                  onClick={() => {
                    if (resourcesUnlocked) {
                      router.push("/admin/recursos");
                    }
                  }}
                  disabled={!resourcesUnlocked}
                  className={`
                    group relative p-4 rounded-xl transition-all
                    ${resourcesUnlocked 
                      ? "hover:bg-white/80 cursor-pointer shadow-sm unlock-animation" 
                      : "opacity-40 cursor-not-allowed hover:bg-gray-50/50"
                    }
                  `}
                >
                  {!resourcesUnlocked && (
                    <Lock className="absolute top-2 right-2 w-3 h-3 text-gray-400 group-hover:text-red-400 transition-colors" />
                  )}
                  <BookOpen className={`w-6 h-6 stroke-[1.5] ${resourcesUnlocked ? "text-[#4285F4]" : "text-gray-400"}`} />
                  {resourcesUnlocked && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Bóveda de Recursos
                    </span>
                  )}
                  {!resourcesUnlocked && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-center">
                      Bloqueado<br/>{copyCount}/5 veces copiado
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}