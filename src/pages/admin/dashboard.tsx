import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { leadsService, type Lead, type LeadNote, type MessageTemplate } from "@/services/leadsService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Plus, MessageSquare, Trash2, Loader2, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

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
    const notesData = await leadsService.getLeadNotes(lead.id);
    setNotes(notesData);
  }

  async function handleAddNote() {
    if (!selectedLead || !newNote.trim()) return;
    
    try {
      await leadsService.addLeadNote(selectedLead.id, newNote);
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
      message = `Hola ${lead.name}, soy de Travel Advantage. Vi que te interesa conocer más sobre nuestro club de viajes exclusivo.`;
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
      <SEO 
        title="Dashboard - Admin Travel Advantage"
        description="Panel de administración de leads"
      />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Travel Advantage</h1>
              <p className="text-sm text-muted-foreground">Panel de Administración</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

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