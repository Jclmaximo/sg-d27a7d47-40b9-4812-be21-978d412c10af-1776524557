import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/services/authService";
import { leadsService } from "@/services/leadsService";
import { supabase } from "@/integrations/supabase/client";
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
  Eye,
  ArrowLeft,
  MapPin,
  Filter,
  Send,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";

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

interface MessageTemplate {
  id: number;
  title: string;
  message: string;
  emoji: string;
  color: string;
}

const messageTemplates: MessageTemplate[] = [
  {
    id: 1,
    title: "Bienvenida Inicial",
    message: "¡Hola {nombre}! 👋 Gracias por tu interés en Viaja Ligero. Vi que te registraste y quiero ayudarte a descubrir cómo ahorrar hasta 60% en tus viajes. ¿Tienes 5 minutos para una breve llamada?",
    emoji: "👋",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Recordatorio Amigable",
    message: "Hola {nombre}, soy {ambassador} 😊 Te contacté hace unos días sobre la membresía de Viaja Ligero. ¿Tuviste oportunidad de revisar la información? Estoy aquí para resolver cualquier duda que tengas.",
    emoji: "🔔",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Beneficios Exclusivos",
    message: "¡{nombre}! ✨ Quiero compartirte algo: Nuestros miembros ahorraron más de $2.8M USD el año pasado. Imagina tu próximo viaje con 40-60% de descuento en hoteles, vuelos y experiencias. ¿Te interesa saber cómo?",
    emoji: "💎",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: 4,
    title: "Casos de Éxito",
    message: "Hola {nombre} 🌟 Te cuento: Laura viajó a Turquía y ahorró $1,092 USD, Carlos a Dubai y ahorró $847 USD. Todo con nuestra membresía. ¿Cuál es tu próximo destino soñado?",
    emoji: "🌍",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 5,
    title: "Urgencia Limitada",
    message: "¡{nombre}! ⏰ Este mes tenemos una promoción especial en la membresía anual. Solo quedan {días} días y los cupos son limitados. ¿Hablamos hoy para que no pierdas esta oportunidad?",
    emoji: "🔥",
    color: "from-red-500 to-rose-500"
  },
  {
    id: 6,
    title: "Resolver Dudas",
    message: "Hola {nombre} 🤔 Noto que aún no has dado el paso. ¿Hay algo que te preocupe o alguna duda que pueda resolver? Estoy aquí para ayudarte a tomar la mejor decisión para tus viajes.",
    emoji: "💬",
    color: "from-indigo-500 to-violet-500"
  }
];

export default function LeadsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [username, setUsername] = useState("");

  const checkAuth = useCallback(async () => {
    const session = await authService.getCurrentSession();
    
    // TEMPORARILY DISABLED FOR TESTING
    // if (!session) {
    //   router.push("/auth/reset-password");
    //   return;
    // }

    // Get username for redirect (use default if no session)
    let profileUsername = "test-user";
    
    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (profile?.username) {
        profileUsername = profile.username;
      }
    }
    
    setUsername(profileUsername);
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
      case "nuevo": return "bg-accent/20 text-accent border-accent/30";
      case "contactado": return "bg-primary/20 text-primary border-primary/30";
      case "convertido": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-muted/20 text-muted-foreground border-border/30";
    }
  };

  const getInterestIcon = (interest?: string) => {
    return interest === "ahorrar" ? "💰" : interest === "ganar" ? "📈" : "🎯";
  };

  const handleOpenMessages = (lead: Lead) => {
    setSelectedLead(lead);
    setShowMessagesModal(true);
  };

  const handleSendMessage = async (template: MessageTemplate) => {
    if (!selectedLead) return;

    // Personalize message
    const personalizedMessage = template.message
      .replace("{nombre}", selectedLead.name.split(" ")[0])
      .replace("{ambassador}", "tu asesor")
      .replace("{días}", "7");

    // Copy to clipboard
    await navigator.clipboard.writeText(personalizedMessage);
    
    setCopiedMessageId(template.id);
    setTimeout(() => setCopiedMessageId(null), 2000);

    toast({
      title: "Mensaje copiado",
      description: "Abre WhatsApp para enviarlo",
    });

    // Open WhatsApp with personalized message
    const whatsappUrl = `https://wa.me/${selectedLead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(personalizedMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleFinishMessages = () => {
    setShowMessagesModal(false);
    setShowThanksModal(true);

    // Auto-redirect after 5 seconds
    setTimeout(() => {
      router.push(`/?ref=${username}`);
    }, 5000);
  };

  return (
    <>
      <SEO title="Leads - Dashboard" description="Gestiona tus prospectos" />

      {/* Messages Modal */}
      <Dialog open={showMessagesModal} onOpenChange={setShowMessagesModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Mensajes Sugeridos con IA
            </DialogTitle>
            <DialogDescription>
              Selecciona un mensaje para enviarlo por WhatsApp con 1 click
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">{selectedLead.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedLead.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {messageTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleSendMessage(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white`}>
                          <span className="text-lg">{template.emoji}</span>
                        </div>
                        <h4 className="font-semibold text-foreground">{template.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {template.message
                          .replace("{nombre}", selectedLead?.name.split(" ")[0] || "")
                          .replace("{ambassador}", "tu asesor")
                          .replace("{días}", "7")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${template.color} hover:opacity-90 text-white shrink-0`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(template);
                      }}
                    >
                      {copiedMessageId === template.id ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMessagesModal(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button
              onClick={handleFinishMessages}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            >
              Terminar Seguimiento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thanks Modal */}
      <Dialog open={showThanksModal} onOpenChange={setShowThanksModal}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ¡Excelente Trabajo!
            </h2>
            <p className="text-muted-foreground mb-6">
              Has completado el seguimiento de tus leads. Sigue así y alcanzarás tus metas.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirigiendo a tu funnel de distribuidor en 5 segundos...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/ambassador/${username}`)}
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
                    variant={filterStatus === "nuevo" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("nuevo")}
                    className={filterStatus === "nuevo" ? "bg-accent" : "border-border/50"}
                  >
                    Nuevos
                  </Button>
                  <Button
                    variant={filterStatus === "contactado" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("contactado")}
                    className={filterStatus === "contactado" ? "bg-primary" : "border-border/50"}
                  >
                    Contactados
                  </Button>
                  <Button
                    variant={filterStatus === "convertido" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("convertido")}
                    className={filterStatus === "convertido" ? "bg-secondary" : "border-border/50"}
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
                            {lead.status === "nuevo" ? "Nuevo" : lead.status === "contactado" ? "Contactado" : "Convertido"}
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
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                        onClick={() => handleOpenMessages(lead)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
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