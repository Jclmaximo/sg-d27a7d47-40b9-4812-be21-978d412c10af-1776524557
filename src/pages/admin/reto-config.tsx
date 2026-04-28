import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { challengeService, type ChallengeTemplate, type ChallengeProtocol, type UserChallengeProgress } from "@/services/challengeService";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Save, Users, Clock, Award,
  Edit3, CheckCircle2, Circle, ArrowLeft, Edit
} from "lucide-react";

export default function RetoConfig() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<ChallengeTemplate | null>(null);
  const [allProgress, setAllProgress] = useState<UserChallengeProgress[]>([]);
  const [editMode, setEditMode] = useState(false);
  
  // Edit form state
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  const [protocols, setProtocols] = useState<ChallengeProtocol[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Realtime subscription for template changes
  useEffect(() => {
    const channel = challengeService.subscribeToTemplateChanges((template) => {
      setActiveTemplate(template);
      toast({
        title: "✅ Plantilla actualizada",
        description: "Los cambios se reflejarán en todos los usuarios",
        duration: 3000,
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Realtime subscription for user progress
  useEffect(() => {
    const channel = challengeService.subscribeToAllProgressChanges((progress) => {
      setAllProgress((prev) => {
        const index = prev.findIndex((p) => p.id === progress.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = progress;
          return updated;
        }
        return [progress, ...prev];
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/admin");
        return;
      }

      // Load active template
      const template = await challengeService.getActiveTemplate();
      if (template) {
        setActiveTemplate(template);
        setTemplateName(template.name);
        setTemplateDescription(template.description || "");
        setDurationHours(template.duration_hours);
        setProtocols(template.protocols);
      }

      // Load all users' progress
      const progress = await challengeService.getAllUsersProgress();
      setAllProgress(progress);

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const addProtocol = () => {
    const newProtocol: ChallengeProtocol = {
      id: String(Date.now()),
      label: "Nueva tarea",
      points: 10,
    };
    setProtocols([...protocols, newProtocol]);
  };

  const updateProtocol = (id: string, field: keyof ChallengeProtocol, value: string | number) => {
    setProtocols(protocols.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const deleteProtocol = (id: string) => {
    setProtocols(protocols.filter((p) => p.id !== id));
  };

  const saveTemplate = async () => {
    if (!activeTemplate) {
      toast({
        title: "❌ Error",
        description: "No hay plantilla activa para actualizar",
        variant: "destructive",
      });
      return;
    }

    const result = await challengeService.updateTemplate(activeTemplate.id, {
      name: templateName,
      description: templateDescription,
      protocols,
      duration_hours: durationHours,
    });

    if (result.success) {
      toast({
        title: "✅ Plantilla actualizada",
        description: "Los cambios se sincronizarán automáticamente con todos los usuarios",
        duration: 5000,
      });
      setEditMode(false);
      loadData();
    } else {
      toast({
        title: "❌ Error",
        description: result.error || "No se pudo guardar la plantilla",
        variant: "destructive",
      });
    }
  };

  const getProgressPercentage = (progress: UserChallengeProgress): number => {
    if (!activeTemplate) return 0;
    return (progress.protocols_completed.length / activeTemplate.protocols.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1D1D1F] text-sm font-light">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Configuración del Reto - Admin"
        description="Panel de administración del Reto 24 Horas"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/admin/main-dashboard")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Volver</span>
                </Button>
              </div>

              {/* Title */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Configuración del Reto 24 Horas
                </h1>
                <p className="text-sm text-gray-500">
                  Gestiona protocolos y monitorea progreso en tiempo real
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!editMode && (
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Editar Plantilla</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna Izquierda - Configuración de Plantilla */}
            <div>
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4">
                  Plantilla Activa
                </h2>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Reto
                      </label>
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Ej: Reto 24 Horas Diamante"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <Input
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Descripción breve del reto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración (horas)
                      </label>
                      <Input
                        type="number"
                        value={durationHours}
                        onChange={(e) => setDurationHours(parseInt(e.target.value))}
                        min={1}
                        max={72}
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-[#1D1D1F]">
                          Protocolos ({protocols.length})
                        </h3>
                        <Button
                          onClick={addProtocol}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {protocols.map((protocol, index) => (
                          <div key={protocol.id} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Input
                                value={protocol.label}
                                onChange={(e) => updateProtocol(protocol.id, "label", e.target.value)}
                                placeholder="Descripción de la tarea"
                                className="mb-2"
                              />
                              <Input
                                type="number"
                                value={protocol.points}
                                onChange={(e) => updateProtocol(protocol.id, "points", parseInt(e.target.value))}
                                placeholder="Puntos"
                                min={1}
                                max={100}
                              />
                            </div>
                            <Button
                              onClick={() => deleteProtocol(protocol.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={saveTemplate}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          loadData();
                        }}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="text-base font-medium text-[#1D1D1F]">
                        {activeTemplate?.name || "Sin nombre"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Duración</p>
                      <p className="text-base font-medium text-[#1D1D1F]">
                        {activeTemplate?.duration_hours || 24} horas
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Protocolos ({activeTemplate?.protocols.length || 0})</p>
                      <div className="space-y-2">
                        {activeTemplate?.protocols.map((protocol, index) => (
                          <div key={protocol.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Circle className="w-4 h-4 text-gray-400" />
                            <span className="flex-1 text-sm text-[#1D1D1F]">
                              {protocol.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {protocol.points} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Columna Derecha - Progreso de Usuarios */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1D1D1F]">
                    Progreso de Usuarios
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {allProgress.filter(p => p.status === "active").length} activos
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {allProgress.filter(p => p.status === "active").length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Ningún usuario ha iniciado el reto aún
                      </p>
                    </div>
                  ) : (
                    allProgress
                      .filter(p => p.status === "active")
                      .map((progress) => {
                        const percentage = getProgressPercentage(progress);
                        return (
                          <div key={progress.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm font-medium text-[#1D1D1F]">
                                  Usuario: {progress.user_id.substring(0, 8)}...
                                </p>
                                <p className="text-xs text-gray-500">
                                  Iniciado: {new Date(progress.started_at).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-primary">
                                  {Math.round(percentage)}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  {progress.protocols_completed.length}/{activeTemplate?.protocols.length || 0}
                                </p>
                              </div>
                            </div>

                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                              <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div>
                                <p className="text-xs text-gray-500">Copias</p>
                                <p className="text-sm font-semibold text-[#1D1D1F]">
                                  {progress.copy_count}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Leads</p>
                                <p className="text-sm font-semibold text-[#1D1D1F]">
                                  {progress.leads_captured}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Estado</p>
                                <p className="text-sm font-semibold text-green-600">
                                  {progress.status === "active" ? "Activo" : "Completado"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}