import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { leadsService } from "@/services/leadsService";
import { 
  ArrowRight, 
  Check, 
  Loader2, 
  Shield,
  Sparkles,
  Globe,
  DollarSign,
  Plane
} from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    interes: "",
    metodo_contacto: "whatsapp",
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
      const { data, error } = await leadsService.createLead({
        name: `${formData.nombre} ${formData.apellido}`.trim(),
        email: formData.email,
        phone: formData.telefono,
        country: formData.pais,
        source: "landing",
        interest: formData.interes as "ahorrar" | "ganar" | "ambas",
        contact_method: formData.metodo_contacto as "whatsapp" | "email" | "telefono",
        user_id: "anonymous", // Temporal id for public forms
      });

      if (error) {
        console.error("Error creating lead:", error);
        toast({
          title: "Error",
          description: "Hubo un problema al enviar tu información. Por favor intenta de nuevo.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      // Redirect to checkout page
      router.push("/checkout");
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
        title="Registro - Viaja Ligero"
        description="Únete al club exclusivo de viajes y accede a tarifas preferenciales"
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating Orbs Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="relative py-20 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-6 px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
                <Sparkles className="w-4 h-4 mr-2" />
                Registro Exclusivo
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
                Únete al Club
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Accede a tarifas exclusivas y experiencias de viaje premium
              </p>
            </div>

            {/* Benefits Quick View */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Plane className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-sm font-semibold">Descuentos hasta 70%</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="text-sm font-semibold">Genera Ingresos</div>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Globe className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-sm font-semibold">Experiencias Exclusivas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl shadow-primary/10">
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>
                  Completa el formulario para comenzar tu experiencia exclusiva
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
                    <Label htmlFor="telefono">Teléfono (con código de país)</Label>
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
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Interest Selection */}
                  <div className="space-y-4">
                    <Label>¿Qué te interesa más?</Label>
                    <RadioGroup value={formData.interes} onValueChange={(value) => setFormData({ ...formData, interes: value })}>
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                        <RadioGroupItem value="ahorrar" id="ahorrar" />
                        <Label htmlFor="ahorrar" className="cursor-pointer flex-1">
                          <div className="font-semibold">Solo ahorrar en viajes</div>
                          <div className="text-sm text-muted-foreground">Accede a tarifas exclusivas y descuentos</div>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                        <RadioGroupItem value="ganar" id="ganar" />
                        <Label htmlFor="ganar" className="cursor-pointer flex-1">
                          <div className="font-semibold">Generar ingresos</div>
                          <div className="text-sm text-muted-foreground">Conviértete en Lifestyle Ambassador</div>
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-accent/50 bg-accent/5 hover:bg-accent/10 transition-colors">
                        <RadioGroupItem value="ambas" id="ambas" />
                        <Label htmlFor="ambas" className="cursor-pointer flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            Ambas opciones
                            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">Recomendado</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">Ahorra y genera ingresos simultáneamente</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Contact Method */}
                  <div className="space-y-2">
                    <Label htmlFor="metodo_contacto">¿Cómo prefieres que te contactemos?</Label>
                    <Select value={formData.metodo_contacto} onValueChange={(value) => setFormData({ ...formData, metodo_contacto: value })}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="telefono">Llamada telefónica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terminos"
                      checked={formData.acepta_terminos}
                      onCheckedChange={(checked) => setFormData({ ...formData, acepta_terminos: checked as boolean })}
                    />
                    <Label htmlFor="terminos" className="text-sm cursor-pointer leading-relaxed">
                      Acepto los términos y condiciones, y autorizo el uso de mis datos para contacto según la política de privacidad
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
                        Enviando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-secondary" />
                    <span>Información protegida y segura</span>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Legal Info */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Licencias de operación: Florida ST-37449, Iowa 951, California 2106836-40
              </p>
              <p className="text-xs text-muted-foreground">
                Oficinas corporativas: Hong Kong • Florida, USA • París, Francia • Dubái, UAE
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}