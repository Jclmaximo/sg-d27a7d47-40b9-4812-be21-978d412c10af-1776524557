import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { productivityService } from "@/services/productivityService";
import { SEO } from "@/components/SEO";
import { 
  Play, Pause, Copy, Check, Share2, Focus, 
  Circle, CheckCircle2, Maximize2, Minimize2,
  Zap, Users, BookOpen, Lock, Instagram, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
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
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24 horas en segundos
  const [leadsCount, setLeadsCount] = useState(0);
  const [copyCount, setCopyCount] = useState(0);
  const [navigationVisible, setNavigationVisible] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [protocols, setProtocols] = useState<DailyProtocol[]>([
    { id: "1", label: "Contactar 3 prospectos nuevos", completed: false, points: 10 },
    { id: "2", label: "Publicar contenido de valor", completed: false, points: 10 },
    { id: "3", label: "Hacer seguimiento a leads", completed: false, points: 10 },
    { id: "4", label: "Compartir link en 2 plataformas", completed: false, points: 10 },
    { id: "5", label: "Estudiar material de capacitación", completed: false, points: 10 },
  ]);

  // NUEVOS ESTADOS - Sistema de Desbloqueo
  const [shareCount, setShareCount] = useState(0);
  const [leadsUnlocked, setLeadsUnlocked] = useState(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useState(false);
  const [previousLeadsCount, setPreviousLeadsCount] = useState(0);

  useEffect(() => {
    loadData();
    restoreChallengeState();
    loadShareCount();
  }, []);

  const restoreChallengeState = () => {
    try {
      const savedState = localStorage.getItem("challenge-state");
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // Restore challenge active state
        if (state.challengeActive) {
          setChallengeActive(true);
          setNavigationVisible(true);
          
          // Calculate elapsed time since start
          const startTime = new Date(state.startTime).getTime();
          const now = new Date().getTime();
          const elapsedSeconds = Math.floor((now - startTime) / 1000);
          const remaining = Math.max(0, 86400 - elapsedSeconds);
          
          setTimeRemaining(remaining);
        }
        
        // Restore copy count
        if (state.copyCount) {
          setCopyCount(state.copyCount);
        }
        
        // Restore protocols
        if (state.protocols) {
          setProtocols(state.protocols);
        }
      }
    } catch (error) {
      console.error("Error restoring challenge state:", error);
    }
  };

  const saveChallengeState = (updates: {
    challengeActive?: boolean;
    startTime?: string;
    copyCount?: number;
    protocols?: DailyProtocol[];
  }) => {
    try {
      const savedState = localStorage.getItem("challenge-state");
      const currentState = savedState ? JSON.parse(savedState) : {};
      
      const newState = {
        ...currentState,
        ...updates
      };
      
      localStorage.setItem("challenge-state", JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving challenge state:", error);
    }
  };

  useEffect(() => {
    if (challengeActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [challengeActive, timeRemaining]);

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

      // Load leads with error handling
      try {
        const leads = await leadsService.getLeads(session.user.id);
        setLeadsCount(leads?.length || 0);
      } catch (leadError) {
        console.error("Error loading leads:", leadError);
        setLeadsCount(0);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
      // Don't redirect on error, just show empty state
    }
  };

  const toggleProtocol = (id: number | string) => {
    const updatedProtocols = protocols.map((p) =>
      Number(p.id) === Number(id) ? { ...p, completed: !p.completed } : p
    );
    setProtocols(updatedProtocols);
    saveChallengeState({ protocols: updatedProtocols });
  };

  const copyFunnelLink = () => {
    const link = profile?.username ? `https://mwr.hubia.vip/mwr?ref=${profile.username}` : "";
    navigator.clipboard.writeText(link);
    const newCount = copyCount + 1;
    setCopyCount(newCount);
    saveChallengeState({ copyCount: newCount });
    
    // Save to localStorage for resources unlock
    localStorage.setItem("reto_share_count", newCount.toString());
    
    // Auto-complete protocol when reached 5 copies
    if (newCount === 5) {
      const updatedProtocols = protocols.map((p) =>
        Number(p.id) === 1 ? { ...p, completed: true } : p
      );
      setProtocols(updatedProtocols);
      saveChallengeState({ protocols: updatedProtocols });
      
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
    const funnelUrl = `https://mwr.hubia.vip/mwr?ref=${profile?.username || ""}`;
    const message = encodeURIComponent(`¡Descubre cómo viajar más por menos! ${funnelUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareToInstagram = () => {
    const funnelUrl = `https://mwr.hubia.vip/mwr?ref=${profile?.username || ""}`;
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

  const funnelLink = profile?.username ? `https://mwr.hubia.vip/mwr?ref=${profile.username}` : "";

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

      <div className="min-h-screen bg-white relative overflow-hidden pb-24">
        {/* Header minimalista */}
        <header className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extralight text-[#1D1D1F] tracking-tight">
                Command Center
              </h1>
              <p className="text-sm font-light text-gray-500 mt-1">
                {profile?.full_name}
              </p>
            </div>
          </div>
        </header>

        <div className={`max-w-7xl mx-auto px-6 py-12 ${focusMode ? "hidden" : ""}`}>
          {/* A. EL PULSO - Cronómetro 24h */}
          <div className="mb-16 text-center">
            <div className="inline-block">
              <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-4">
                Reto de 24 Horas
              </p>
              <div className="text-7xl font-extralight text-[#1D1D1F] tracking-tighter mb-6">
                {formatTime(timeRemaining)}
              </div>
              <Button
                onClick={() => {
                  const newState = !challengeActive;
                  setChallengeActive(newState);
                  
                  if (newState) {
                    // Starting challenge - save start time
                    saveChallengeState({
                      challengeActive: true,
                      startTime: new Date().toISOString()
                    });
                  } else {
                    // Pausing challenge - keep state but mark as paused
                    saveChallengeState({
                      challengeActive: false
                    });
                  }
                }}
                className="bg-[#1D1D1F] hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-light"
              >
                {!challengeActive ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar Reto
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* B. MOTOR DE CRECIMIENTO - Link de referido */}
          {challengeActive && (
            <div className="mb-16">
              <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-6 text-center">
                Tu Embudo Personal
              </p>
              
              {/* Link container - responsive layout */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
                <input
                  type="text"
                  value={funnelLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-light"
                />
                <Button
                  onClick={copyFunnelLink}
                  className="bg-[#1D1D1F] hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-light whitespace-nowrap"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
              </div>

              {/* Botones de compartir */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={shareToWhatsApp}
                  className="bg-green-50 hover:bg-green-100 text-green-700 px-6 py-3 rounded-lg font-light border border-green-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
                <Button
                  onClick={shareToInstagram}
                  className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-6 py-3 rounded-lg font-light border border-pink-200"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
          )}

          {/* B. MOTOR DE CRECIMIENTO */}
          {challengeActive && (
            <div className="mb-16 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Live Lead Tracker */}
                <Card className="backdrop-blur-xl bg-white/80 border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-6">
                    Leads Capturados
                  </p>
                  <div
                    id="lead-tracker"
                    className="text-8xl font-extralight text-[#1D1D1F] mb-4 transition-transform duration-300"
                  >
                    {leadsCount}
                  </div>
                  <p className="text-sm font-light text-gray-500">
                    {leadsCount === 0 ? "Comparte tu link para empezar" : "En tiempo real"}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* C. ESTADO DE FLUJO - Checklist */}
          {challengeActive && (
            <div className="transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-2">
                    Protocolos de Hoy
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-light text-[#1D1D1F]">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setFocusMode(true)}
                  className="text-[#1D1D1F] hover:bg-gray-50 font-light"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Modo Enfoque
                </Button>
              </div>

              <div className="space-y-4">
                {protocols.map((protocol) => (
                  <button
                    key={protocol.id}
                    id={`protocol-${protocol.id}`}
                    onClick={() => toggleProtocol(parseInt(protocol.id, 10))}
                    className="w-full flex items-center gap-4 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all text-left group"
                  >
                    <div className="relative">
                      {protocol.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" strokeWidth={1} />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 group-hover:text-gray-400" strokeWidth={1} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-light ${protocol.completed ? "line-through text-gray-400" : "text-[#1D1D1F]"}`}>
                        {protocol.label}
                      </p>
                    </div>
                    <div className="text-xs font-light text-gray-400">
                      {protocol.points} pts
                    </div>
                  </button>
                ))}
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
                    Bloqueado<br/>{shareCount}/5 veces copiado
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}