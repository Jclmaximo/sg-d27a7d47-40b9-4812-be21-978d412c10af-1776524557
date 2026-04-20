import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { mwrLeadsService } from "@/services/mwrLeadsService";

export default function MWRRegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    nivelMWR: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.nombre || !formData.email || !formData.whatsapp || !formData.nivelMWR) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const { data, error: leadError } = await mwrLeadsService.createLead({
        nombre: formData.nombre,
        email: formData.email,
        whatsapp: formData.whatsapp,
        nivel_mwr: formData.nivelMWR,
        estado: "nuevo",
        notas: null,
        referrer_username: null
      });

      if (leadError) {
        throw new Error(leadError.message || "Error al guardar registro");
      }

      console.log("Lead MWR creado:", data);
      
      // Redirect to VSL
      setTimeout(() => {
        router.push("/mwr/vsl");
      }, 500);
    } catch (err: any) {
      console.error("Error al registrar:", err);
      setError(err.message || "Error al procesar registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Registro - Sistema de Marketing MLM"
        description="Regístrate para acceder al sistema automático de prospectos"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="inline-block mx-auto">
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-full px-6 py-2">
                <span className="text-yellow-300 font-semibold">🚀 Paso 1 de 3</span>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-white">
              Comienza tu Prueba Piloto
            </CardTitle>
            <CardDescription className="text-lg text-slate-300">
              Completa tus datos para acceder al video de presentación del sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-white">Nombre Completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivelMWR" className="text-white">¿Cuál es tu nivel actual en MLM?</Label>
                <Select 
                  value={formData.nivelMWR} 
                  onValueChange={(value) => setFormData({ ...formData, nivelMWR: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo (menos de 3 meses)</SelectItem>
                    <SelectItem value="activo">Activo (3-12 meses)</SelectItem>
                    <SelectItem value="lider">Líder (más de 1 año)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Lo que recibirás:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Acceso inmediato al sistema piloto</li>
                      <li>• Embudo de viajes configurado</li>
                      <li>• CRM con IA incluido</li>
                      <li>• 14 días de prueba</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg font-semibold shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Continuar al Sistema
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Al registrarte, aceptas recibir comunicaciones sobre el sistema MWR
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}