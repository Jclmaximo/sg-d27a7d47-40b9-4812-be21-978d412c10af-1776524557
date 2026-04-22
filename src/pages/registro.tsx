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
import { referralService } from "@/services/referralService";
import { 
  ArrowRight, 
  Check, 
  Loader2, 
  Shield,
  Sparkles,
  Bot,
  BarChart3,
  Users,
  Zap
} from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    pais: "",
    mwr_link: "",
    acepta_terminos: false,
  });

  // Redirect to /mwr if ref parameter exists
  useEffect(() => {
    const { ref } = router.query;
    if (ref && typeof ref === 'string') {
      router.push(`/mwr?ref=${ref}`);
    }
  }, [router]);

  useEffect(() => {
    const { ref } = router.query;
    if (ref && typeof ref === 'string') {
      setReferralCode(ref);
    }
  }, [router.query]);

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

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.nombre} ${formData.apellido}`.trim(),
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario");
      }

      // Update profile with MWR link if provided
      if (formData.mwr_link) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ mwr_link: formData.mwr_link })
          .eq("id", authData.user.id);

        if (profileError) {
          console.error("Error updating MWR link:", profileError);
        }
      }

      if (referralCode) {
        try {
          await referralService.processReferral(authData.user.id, referralCode);
        } catch (refError) {
          console.error("Error processing referral:", refError);
        }
      }

      toast({
        title: "¡Cuenta creada exitosamente!",
        description: "Redirigiendo al pago seguro...",
      });

      router.push("/checkout");
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error al registrarse",
        description: err.message || "Ocurrió un error inesperado. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Bot,
      title: "IA Potenciada",
      description: "Seguimiento automatizado de leads con mensajes personalizados"
    },
    {
      icon: BarChart3,
      title: "Dashboard Completo",
      description: "Panel de control profesional con todas tus métricas"
    },
    {
      icon: Zap,
      title: "Funnel Automático",
      description: "Sistema de ventas que trabaja por ti 24/7"
    },
    {
      icon: Users,
      title: "Red MLM",
      description: "Gestión completa de tu red y comisiones"
    }
  ];

  return (
    <>
      <SEO 
        title="Registrarse - Sistema MLM Automatizado"
        description="Crea tu cuenta y accede al sistema MLM más completo del mercado"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column - Benefits */}
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Sistema MLM Profesional
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Comienza a Construir
                  </span>
                  <br />
                  <span className="text-foreground">
                    Tu Negocio Digital
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  Obtén acceso completo al sistema MLM más avanzado del mercado. Dashboard profesional, IA integrada, funnel automatizado y gestión de red.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                    <CardContent className="p-4 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Pago seguro con crypto</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Acceso instantáneo</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Soporte 24/7</span>
                </div>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <Card className="bg-background/80 backdrop-blur-sm border-border/50 shadow-2xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
                <CardDescription>
                  Completa tus datos para acceder al sistema completo
                </CardDescription>
                {referralCode && (
                  <Badge variant="secondary" className="w-fit">
                    <Users className="w-3 h-3 mr-1" />
                    Referido por: {referralCode}
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
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

                  {/* Account Fields */}
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
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="bg-background/50 border-border/50"
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono (con código de país)</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+52 1 234 567 8900"
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
                        <SelectItem value="MX">México</SelectItem>
                        <SelectItem value="CO">Colombia</SelectItem>
                        <SelectItem value="AR">Argentina</SelectItem>
                        <SelectItem value="CL">Chile</SelectItem>
                        <SelectItem value="PE">Perú</SelectItem>
                        <SelectItem value="ES">España</SelectItem>
                        <SelectItem value="US">Estados Unidos</SelectItem>
                        <SelectItem value="otros">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mwr_link">MWR Link (Opcional)</Label>
                    <Input
                      id="mwr_link"
                      type="url"
                      placeholder="https://www.mwrlife.com/username/join"
                      value={formData.mwr_link}
                      onChange={(e) => setFormData({ ...formData, mwr_link: e.target.value })}
                      className="bg-background/50 border-border/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Link donde redirigiremos a tus referidos para unirse a MWR
                    </p>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acepta_terminos}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, acepta_terminos: checked as boolean })
                      }
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                      Acepto los términos y condiciones, y autorizo el uso de mis datos para el servicio del sistema MLM
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        Crear Cuenta y Continuar
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Al registrarte, serás redirigido al pago seguro de $29 USD para activar tu acceso completo
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/30 bg-background/50 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Ubicaciones Corporativas</h4>
                <p>Hong Kong • Florida, USA • París, Francia • Dubái, UAE</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Licencias Oficiales</h4>
                <p>Florida ST-37449 | Iowa 951 | California 2106836-40</p>
              </div>
              <div className="md:text-right">
                <p>© 2026 Viaja Ligero. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}