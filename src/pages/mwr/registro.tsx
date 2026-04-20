import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { mwrLeadsService } from "@/services/mwrLeadsService";
import { ArrowRight, Loader2, Shield, Sparkles, Users, TrendingUp, Zap, Check } from "lucide-react";

export default function MWRRegistroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    negocio_mlm: "",
    acepta_terminos: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acepta_terminos) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await mwrLeadsService.createLead({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        pais: formData.pais,
        negocio_mlm: formData.negocio_mlm,
        estado: "nuevo",
      });

      if (error) {
        console.error("Error creating MWR lead:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al enviar tu información. Por favor intenta de nuevo.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Redirigiendo al checkout...",
      });

      // Redirect to checkout with lead ID
      if (data?.id) {
        router.push(`/mwr/checkout?lead_id=${data.id}`);
      } else {
        router.push("/mwr/checkout");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Registro - Sistema MWR"
        description="Únete al sistema automático para hacer crecer tu negocio MLM"
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating Orbs Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="relative py-20 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-6 px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                <Sparkles className="w-4 h-4 mr-2" />
                Acceso al Sistema Piloto
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
                Crea Tu Cuenta
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Comienza a generar prospectos calificados en las próximas 24 horas
              </p>
            </div>

            {/* Benefits Quick View */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">Prospectos Diarios</div>
                      <div className="text-xs text-muted-foreground">5-10 leads calificados automáticos</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">CRM Inteligente</div>
                      <div className="text-xs text-muted-foreground">Seguimiento automatizado 24/7</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">IA Conversacional</div>
                      <div className="text-xs text-muted-foreground">89% tasa de respuesta</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl shadow-primary/10">
              <CardHeader>
                <CardTitle>Información de Registro</CardTitle>
                <CardDescription>
                  Completa tus datos para acceder al sistema piloto
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        placeholder="Juan"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        placeholder="Pérez"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">WhatsApp (con código de país)</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      required
                      className="bg-background/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Select value={formData.pais} onValueChange={(value) => setFormData({ ...formData, pais: value })}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Selecciona tu país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mexico">México</SelectItem>
                        <SelectItem value="colombia">Colombia</SelectItem>
                        <SelectItem value="españa">España</SelectItem>
                        <SelectItem value="argentina">Argentina</SelectItem>
                        <SelectItem value="chile">Chile</SelectItem>
                        <SelectItem value="peru">Perú</SelectItem>
                        <SelectItem value="venezuela">Venezuela</SelectItem>
                        <SelectItem value="ecuador">Ecuador</SelectItem>
                        <SelectItem value="usa">Estados Unidos</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="negocio_mlm">¿En qué negocio MLM participas?</Label>
                    <Input
                      id="negocio_mlm"
                      placeholder="Ej: Herbalife, Amway, etc."
                      value={formData.negocio_mlm}
                      onChange={(e) => setFormData({ ...formData, negocio_mlm: e.target.value })}
                      required
                      className="bg-background/50 border-border/50"
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terminos"
                      checked={formData.acepta_terminos}
                      onCheckedChange={(checked) => setFormData({ ...formData, acepta_terminos: checked as boolean })}
                    />
                    <Label htmlFor="terminos" className="text-sm cursor-pointer leading-relaxed">
                      Acepto los términos y condiciones del sistema piloto. Entiendo que solo pagaré la mensualidad si genero actividad en mi negocio MLM.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 border border-primary/50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Continuar al Pago - $29 USD
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span>Pago seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-secondary" />
                      <span>Garantía 30 días</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-secondary" />
                      <span>Cancela cuando quieras</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Back Link */}
            <div className="mt-8 text-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/mwr")}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Volver a la página anterior
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}