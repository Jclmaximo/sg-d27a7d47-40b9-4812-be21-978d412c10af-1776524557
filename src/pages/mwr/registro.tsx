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
        title="Registro - Sistema MWR"
        description="Regístrate para acceder al sistema automático de prospectos MWR"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('/mountain-lake-boats.jpg')] bg-cover bg-center opacity-10" />
        
        <Card className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Accede al Sistema Piloto
            </CardTitle>
            <CardDescription className="text-lg">
              Completa tus datos para empezar a generar prospectos automáticamente
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
                <Label htmlFor="nombre" className="text-base font-semibold">
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="h-12 text-lg"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 text-lg"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-base font-semibold">
                  WhatsApp (con código de país)
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="h-12 text-lg"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel" className="text-base font-semibold">
                  ¿Cuál es tu nivel en MWR?
                </Label>
                <Select
                  value={formData.nivelMWR}
                  onValueChange={(value) => setFormData({ ...formData, nivelMWR: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo (recién empezando)</SelectItem>
                    <SelectItem value="activo">Activo (vendiendo regularmente)</SelectItem>
                    <SelectItem value="lider">Líder (con equipo)</SelectItem>
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