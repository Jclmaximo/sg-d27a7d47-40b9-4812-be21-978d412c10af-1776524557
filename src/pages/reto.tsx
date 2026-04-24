import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { productivityService } from "@/services/productivityService";
import { SEO } from "@/components/SEO";
import { 
  Play, Pause, Copy, Check, Share2, Focus, 
  Circle, CheckCircle2, Maximize2, Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leadsCount, setLeadsCount] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [challengeActive, setChallengeActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24h en segundos
  const [focusMode, setFocusMode] = useState(false);
  
  const [protocols, setProtocols] = useState<DailyProtocol[]>([
    { id: "1", label: "Contactar 3 prospectos nuevos", completed: false, points: 10 },
    { id: "2", label: "Publicar contenido de valor", completed: false, points: 10 },
    { id: "3", label: "Hacer seguimiento a leads", completed: false, points: 10 },
    { id: "4", label: "Compartir link en 2 plataformas", completed: false, points: 10 },
    { id: "5", label: "Estudiar material de capacitación", completed: false, points: 10 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (challengeActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [challengeActive, timeRemaining]);

  // Supabase Realtime para leads
  useEffect(() => {
    if (!profile?.id) return;

    const setupRealtimeLeads = async () => {
      const channel = supabase
        .channel("leads-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "leads",
            filter: `referred_by=eq.${profile.id}`,
          },
          (payload) => {
            console.log("Lead realtime update:", payload);
            // Recargar leads del día
            loadTodayLeads();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeLeads();
  }, [profile?.id]);

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
        router.push("/admin");
        return;
      }

      setProfile(profileData as UserProfile);

      // Load leads count
      const leads = await leadsService.getLeads(session.user.id);
      setLeadsCount(leads.length);

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const toggleProtocol = async (id: string) => {
    setProtocols((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // Micro-animación
          const element = document.getElementById(`protocol-${id}`);
          if (element) {
            element.classList.add("scale-105");
            setTimeout(() => element.classList.remove("scale-105"), 200);
          }
          return { ...p, completed: !p.completed };
        }
        return p;
      })
    );

    // Guardar en base de datos
    if (profile?.id) {
      const protocol = protocols.find((p) => p.id === id);
      if (protocol) {
        await productivityService.saveDailyActivity(profile.id, {
          contacted_prospects: protocol.id === "1",
          contacted_prospects_count: protocol.id === "1" ? 3 : 0,
          posted_content: protocol.id === "2",
          did_followup: protocol.id === "3",
          presented_business: protocol.id === "4",
          attended_training: protocol.id === "5",
        });
      }
    }
  };

  const copyFunnelLink = () => {
    const link = `${window.location.origin}/mwr?ref=${profile?.username || ""}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareFunnelLink = (platform: "whatsapp" | "instagram") => {
    const link = `${window.location.origin}/mwr?ref=${profile?.username || ""}`;
    const text = "✨ Descubre cómo viajar con descuentos exclusivos y ganar dinero recomendando: ";
    
    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + link)}`, "_blank");
    } else {
      // Instagram no permite compartir links directamente, copiamos al portapapeles
      navigator.clipboard.writeText(text + link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const completionPercentage = (protocols.filter((p) => p.completed).length / protocols.length) * 100;

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
        title="Reto 24H - Zen Command Center"
        description="Tu centro de comando minimalista para productividad y crecimiento"
      />
      
      <div className="min-h-screen bg-white">
        {/* Header minimalista */}
        <header className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extralight text-[#1D1D1F] tracking-tight">
                Zen Command Center
              </h1>
              <p className="text-sm font-light text-gray-500 mt-1">
                {profile?.full_name}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/main-dashboard")}
              className="text-[#1D1D1F] hover:bg-gray-50 font-light"
            >
              ← Dashboard
            </Button>
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
                  setChallengeActive(!challengeActive);
                  if (!challengeActive) {
                    setTimeRemaining(86400); // Reset a 24h
                  }
                }}
                className={`
                  rounded-full px-8 py-3 font-light text-sm tracking-wide transition-all
                  ${challengeActive 
                    ? "bg-gray-900 hover:bg-gray-800 text-white" 
                    : "bg-primary hover:bg-primary/90 text-white"
                  }
                `}
              >
                {challengeActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Reto
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* B. MOTOR DE CRECIMIENTO */}
          <div className={`mb-16 transition-all duration-500 ${challengeActive ? "" : "opacity-30 blur-sm pointer-events-none"}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Link del Embudo */}
              <Card className="backdrop-blur-xl bg-white/80 border border-gray-100 shadow-sm p-8">
                <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-4">
                  Tu Embudo Personal
                </p>
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 font-mono text-sm text-[#1D1D1F] break-all">
                  {`${typeof window !== "undefined" ? window.location.origin : ""}/mwr?ref=${profile?.username || ""}`}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={copyFunnelLink}
                    className="flex-1 bg-[#1D1D1F] hover:bg-gray-800 text-white rounded-xl font-light"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Link
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => shareFunnelLink("whatsapp")}
                    className="flex-1 h-12 rounded-full border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all flex items-center justify-center gap-2 text-sm font-light text-[#1D1D1F]"
                  >
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareFunnelLink("instagram")}
                    className="flex-1 h-12 rounded-full border border-gray-200 hover:border-[#E4405F] hover:bg-[#E4405F]/5 transition-all flex items-center justify-center gap-2 text-sm font-light text-[#1D1D1F]"
                  >
                    <Share2 className="w-4 h-4" />
                    Instagram
                  </button>
                </div>
              </Card>

              {/* Live Lead Tracker */}
              <Card className="backdrop-blur-xl bg-white/80 border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-light text-gray-400 uppercase tracking-widest mb-6">
                  Leads Capturados
                </p>
                <div
                  id="lead-tracker"
                  className="text-8xl font-extralight text-[#1D1D1F] mb-4 transition-transform"
                >
                  {leadsCount}
                </div>
                <p className="text-sm font-light text-gray-500">
                  {leadsCount === 0 ? "Comparte tu link para empezar" : "En tiempo real"}
                </p>
              </Card>
            </div>
          </div>

          {/* C. ESTADO DE FLUJO - Checklist */}
          <div>
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
                  onClick={() => toggleProtocol(protocol.id)}
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
                    onClick={() => toggleProtocol(protocol.id)}
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
      </div>
    </>
  );
}