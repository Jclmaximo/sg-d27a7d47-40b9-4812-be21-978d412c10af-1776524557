import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { leadsService, type Lead, type LeadNote, type MessageTemplate } from "@/services/leadsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Plus, MessageSquare, Trash2, Loader2, Phone, Settings, Users, TrendingUp } from "lucide-react";
import { SEO } from "@/components/SEO";
import { subscriptionService } from "@/services/subscriptionService";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [adminWhatsApp, setAdminWhatsApp] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const messageTemplates = [
    {
      name: "Primer Contacto",
      template: (lead: Lead) => 
        `Hola ${lead.name}, soy Embajador de Viaja Ligero. Vi tu interés en conocer cómo acceder a precios exclusivos en viajes. ¿Tienes unos minutos para platicarte cómo funciona?`
    },
    {
      name: "Seguimiento 1",
      template: (lead: Lead) => 
        `Hola ${lead.name}, te contacté hace unos días sobre Viaja Ligero. ¿Tuviste oportunidad de pensar en cómo podríamos ayudarte a ahorrar en tus próximos viajes? Como Embajador de Viaja Ligero, puedo resolver cualquier duda.`
    },
    {
      name: "Seguimiento 2",
      template: (lead: Lead) => 
        `${lead.name}, solo quería recordarte que como Embajador de Viaja Ligero tengo acceso a tarifas exclusivas que no están disponibles al público. ¿Te gustaría ver algunos ejemplos de ahorro real de nuestros miembros?`
    },
    {
      name: "Recordatorio",
      template: (lead: Lead) => 
        `Hola ${lead.name}, ¿sigues interesado en conocer cómo funciona Viaja Ligero? Como tu Embajador de Viaja Ligero, puedo mostrarte cómo ahorrar hasta 60% en tus viajes. ¿Cuándo te viene bien una breve llamada?`
    },
    {
      name: "Cierre",
      template: (lead: Lead) => 
        `${lead.name}, muchas gracias por tu tiempo. Como Embajador de Viaja Ligero, estoy aquí cuando decidas aprovechar los beneficios exclusivos del club. ¡Que tengas un excelente día!`
    }
  ];

  useEffect(() => {
    checkAuthAndSubscription();
  }, []);

  const checkAuthAndSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      setIsAdmin(true);
    }

    // Check subscription
    const isActive = await subscriptionService.hasActiveSubscription(user.id);
    setHasActiveSubscription(isActive);

    if (!isActive && profile?.role !== "admin") {
      router.push("/pricing");
      return;
    }

    // Load admin settings
    const settings = await subscriptionService.getAdminSettings(user.id);
    if (settings) {
      setAdminWhatsApp(settings.whatsapp_number);
    }

    loadData();
  };

  const handleSaveWhatsApp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await subscriptionService.updateAdminSettings(user.id, {
        whatsapp_number: adminWhatsApp
      });
      alert("WhatsApp guardado exitosamente");
      setShowSettings(false);
    } catch (error) {
      console.error("Error saving WhatsApp:", error);
      alert("Error al guardar WhatsApp");
    }
  };

  const sendWhatsApp = (lead: Lead, message: string) => {
    window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin");
    } else {
      loadData();
    }
  }

  async function loadData() {
    try {
      const [leadsData, templatesData] = await Promise.all([
        leadsService.getLeads(),
        leadsService.getMessageTemplates()
      ]);
      setLeads(leadsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  async function handleStatusChange(leadId: string, status: Lead["status"]) {
    try {
      await leadsService.updateLeadStatus(leadId, status);
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status } : lead
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function loadLeadNotes(lead: Lead) {
    setSelectedLead(lead);
    const { data: notes } = await supabase
      .from("lead_notes")
      .select(`
        id,
        lead_id,
        note,
        created_at,
        created_by,
        profiles (
          full_name,
          username,
          email
        )
      `)
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false });

    if (notes) {
      setNotes(notes);
    }
  }

  async function handleAddNote() {
    if (!selectedLead || !newNote.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await leadsService.addNote({
        lead_id: selectedLead.id,
        note: newNote,
        created_by: user.id
      });

      setNewNote("");
      loadLeadNotes(selectedLead);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  async function handleDeleteLead(leadId: string) {
    if (!confirm("¿Estás seguro de eliminar este lead?")) return;
    
    try {
      await leadsService.deleteLead(leadId);
      setLeads(leads.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  }

  function sendWhatsAppMessage(lead: Lead, templateId?: string) {
    let message = "";
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        message = template.template.replace("{name}", lead.name);
      }
    } else {
      // Custom message
      message = `Hola ${lead.name}, soy de Viaja Ligero. Vi que te interesa conocer más sobre nuestro club de viajes exclusivo.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${lead.phone}?text=${encodedMessage}`, "_blank");
  }

  const statusColors = {
    nuevo: "bg-blue-500",
    contactado: "bg-yellow-500",
    interesado: "bg-purple-500",
    convertido: "bg-green-500",
    descartado: "bg-gray-500"
  };

  const statusLabels = {
    nuevo: "Nuevo",
    contactado: "Contactado",
    interesado: "Interesado",
    convertido: "Convertido",
    descartado: "Descartado"
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
      <SEO title="Panel de Administración - Viaja Ligero" />
      
      <div className="min-h-screen bg-background p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Admin de Leads</h1>
              <p className="text-muted-foreground mt-2">
                Gestiona todos los prospectos capturados por tu embudo
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/super-dashboard">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Super Admin
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* WhatsApp Settings Modal */}
        {showSettings && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de WhatsApp</h2>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="Ej: 523314300767"
                value={adminWhatsApp}
                onChange={(e) => setAdminWhatsApp(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveWhatsApp}>Guardar</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Los leads se enviarán a este número de WhatsApp
            </p>
          </Card>
        )}

        {/* Stats */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-6">
              <div className="text-2xl font-bold text-blue-500">{leads.filter(l => l.status === "nuevo").length}</div>
              <div className="text-sm text-muted-foreground">Nuevos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold text-yellow-500">{leads.filter(l => l.status === "contactado").length}</div>
              <div className="text-sm text-muted-foreground">Contactados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold text-purple-500">{leads.filter(l => l.status === "interesado").length}</div>
              <div className="text-sm text-muted-foreground">Interesados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-500">{leads.filter(l => l.status === "convertido").length}</div>
              <div className="text-sm text-muted-foreground">Convertidos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{leads.length}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Capturados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads.length}</div>
                <Link href="/admin/leads">
                  <Button variant="link" className="px-0 mt-2">
                    Ver todos los leads →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mi Red de Referidos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">MLM</div>
                <Link href="/admin/network">
                  <Button variant="link" className="px-0 mt-2">
                    Ver mi red →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Leads Table */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Gestión de Leads</h2>
            <div className="space-y-4">
              {leads.map((lead) => (
                <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{lead.name}</h3>
                        <Badge className={statusColors[lead.status || "nuevo"]}>
                          {statusLabels[lead.status || "nuevo"]}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>📧 {lead.email}</div>
                        <div>📱 {lead.phone}</div>
                        <div>🌍 {lead.country}</div>
                        <div>📅 {new Date(lead.created_at).toLocaleDateString("es-MX")}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Select
                        value={lead.status || "nuevo"}
                        onValueChange={(value) => handleStatusChange(lead.id, value as Lead["status"])}
                      >
                        <SelectTrigger className="w-full lg:w-40">
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

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => loadLeadNotes(lead)}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Notas
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Notas de {selectedLead?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Agregar nueva nota..."
                                  value={newNote}
                                  onChange={(e) => setNewNote(e.target.value)}
                                  rows={3}
                                />
                                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Agregar Nota
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-semibold">Historial de Notas</h4>
                                {notes.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No hay notas aún</p>
                                ) : (
                                  notes.map((note) => (
                                    <Card key={note.id} className="p-3">
                                      <p className="text-sm">{note.note}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(note.created_at).toLocaleString("es-MX")}
                                      </p>
                                    </Card>
                                  ))
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                              <Phone className="w-4 h-4 mr-2" />
                              WhatsApp
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Enviar mensaje a {lead.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Selecciona un template o envía mensaje personalizado:
                                </label>
                                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un template" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {templates.map((template) => (
                                      <SelectItem key={template.id} value={template.id}>
                                        {template.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {selectedTemplate && (
                                <Card className="p-3 bg-muted">
                                  <p className="text-sm">
                                    {templates.find(t => t.id === selectedTemplate)?.template.replace("{name}", lead.name)}
                                  </p>
                                </Card>
                              )}

                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => sendWhatsAppMessage(lead, selectedTemplate)}
                                  className="flex-1 bg-secondary hover:bg-secondary/90"
                                >
                                  Enviar por WhatsApp
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => sendWhatsAppMessage(lead)}
                                >
                                  Mensaje Libre
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {leads.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No hay leads registrados aún
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}