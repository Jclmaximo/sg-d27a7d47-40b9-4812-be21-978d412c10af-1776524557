import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { 
  Loader2,
  CheckCircle2,
  Plane,
  Globe,
  DollarSign,
  Shield
} from "lucide-react";

export default function LeadsRegistroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralUsername, setReferralUsername] = useState<string | null>(null);
  const [ambassadorUserId, setAmbassadorUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    acepta_terminos: false,
  });

  useEffect(() => {
    const fetchAmbassador = async () => {
      const { ref } = router.query;
      
      if (ref && typeof ref === "string") {
        setReferralUsername(ref);
        
        // Find ambassador user_id by username
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", ref.toLowerCase())
          .single();
        
        if (profile) {
          setAmbassadorUserId(profile.id);
        }
      }
    };

    if (router.isReady) {
      fetchAmbassador();
    }
  }, [router.query, router.isReady]);

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

    if (!ambassadorUserId) {
      toast({
        title: "Error",
        description: "No se pudo identificar al embajador que te refirió",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create lead in database
      await leadsService.createLead({
        name: `${formData.nombre} ${formData.apellido}`.trim(),
        email: formData.email,
        phone: formData.telefono,
        country: formData.pais,
        source: "ambassador_landing",
        interest: "membresia_viajes",
        contact_method: "whatsapp",
        user_id: ambassadorUserId
      });

      toast({
        title: "¡Registro exitoso!",
        description: "Nos pondremos en contacto contigo pronto para completar tu membresía.",
      });

      // Redirect to thank you page or show success
      setTimeout(() => {
        router.push("/gracias");
      }, 2000);

    } catch (err: any) {
      console.error("Error creating lead:", err);
      toast({
        title: "Error al registrarse",
        description: err.message || "Ocurrió un error. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Registrarme - Viaja Ligero"
        description="Únete al club exclusivo de viajes y comienza a ahorrar en tus próximas aventuras"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <Plane className="w-4 h-4 mr-2" />
                Club Exclusivo de Viajes
              </Badge>
              
              {referralUsername && (
                <Badge variant="secondary" className="mb-4 ml-2">
                  Referido por: {referralUsername}
                </Badge>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Únete a Viaja Ligero
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Completa tus datos y comienza a disfrutar de tarifas exclusivas en hoteles, vuelos y experiencias de lujo
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column - Benefits */}
              <div className="space-y-6">
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl">Lo que obtienes como miembro</CardTitle>
                    <CardDescription>Acceso inmediato a beneficios exclusivos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Ahorra hasta 60%</h3>
                        <p className="text-sm text-muted-foreground">Tarifas preferenciales en hoteles, vuelos y más</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Globe className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">180+ Países</h3>
                        <p className="text-sm text-muted-foreground">Destinos en todo el mundo disponibles</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Plane className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Life Experiences®</h3>
                        <p className="text-sm text-muted-foreground">Viajes de lujo curados especialmente para ti</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Shield className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">100% Seguro</h3>
                        <p className="text-sm text-muted-foreground">Certificado por autoridades de viajes internacionales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Removed Trust Indicators section - not needed for info capture funnel */}
              </div>

              {/* Right Column - Form */}
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Registro de Membresía</CardTitle>
                  <CardDescription>
                    Completa tus datos para comenzar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
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
                      <Select 
                        value={formData.pais} 
                        onValueChange={(value) => setFormData({ ...formData, pais: value })}
                        required
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona tu país" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mexico">México</SelectItem>
                          <SelectItem value="colombia">Colombia</SelectItem>
                          <SelectItem value="argentina">Argentina</SelectItem>
                          <SelectItem value="chile">Chile</SelectItem>
                          <SelectItem value="peru">Perú</SelectItem>
                          <SelectItem value="espana">España</SelectItem>
                          <SelectItem value="usa">Estados Unidos</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-2 pt-4">
                      <Checkbox 
                        id="terms" 
                        checked={formData.acepta_terminos}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, acepta_terminos: checked as boolean })
                        }
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                        Acepto recibir información sobre la membresía de viajes y los términos del servicio
                      </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Registrarme Ahora
                          <CheckCircle2 className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Un asesor se pondrá en contacto contigo.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p className="mb-2">
                Licencias: Florida ST-37449 | Iowa 951 | California 2106836-40
              </p>
              <p>
                Oficinas: Hong Kong • Florida • París • Dubái
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}