import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plane, 
  Hotel, 
  Ship, 
  Car,
  Sparkles,
  Globe,
  DollarSign,
  Shield,
  Star,
  MapPin,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function AmbassadorPage() {
  const router = useRouter();
  const { username } = router.query;
  const [ambassadorName, setAmbassadorName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAmbassador = async () => {
      if (!username || typeof username !== "string") return;

      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, username")
          .eq("username", username.toLowerCase())
          .single();

        if (data) {
          setAmbassadorName(data.full_name || data.username || username);
        }
      } catch (error) {
        console.error("Error loading ambassador:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAmbassador();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Viaja Ligero - Club Exclusivo de Viajes"
        description="Accede a tarifas exclusivas en hoteles, vuelos, cruceros y experiencias de lujo en más de 180 países"
      />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Header */}
        <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/30">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Viaja Ligero
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/admin")}
              className="border-primary/30 hover:bg-primary/10"
            >
              Iniciar Sesión
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            {ambassadorName && (
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary px-4 py-1">
                <Sparkles className="w-4 h-4 mr-2" />
                {ambassadorName} te invita a unirte
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Viaja Más,
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Gasta Menos
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Accede a <span className="text-primary font-semibold">tarifas exclusivas</span> en hoteles, vuelos, cruceros y experiencias de lujo que no están disponibles al público. Ahorra hasta <span className="text-secondary font-semibold">60%</span> en cada viaje.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push(`/registro?ref=${username}`)}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg shadow-primary/30 text-base px-8"
              >
                Empezar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push("/pricing")}
                className="border-primary/30 hover:bg-primary/10 text-base px-8"
              >
                Ver Planes
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Licencias Florida, Iowa, California</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>Oficinas en 4 continentes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>Pago 100% Seguro</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: Globe, value: "50,000+", label: "Miembros Activos" },
              { icon: MapPin, value: "180+", label: "Países Disponibles" },
              { icon: DollarSign, value: "$2,800", label: "Ahorro Promedio" },
              { icon: Star, value: "25+", label: "Años de Experiencia" }
            ].map((stat, idx) => (
              <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Plane,
                title: "Vuelos con Descuento",
                description: "Tarifas preferenciales en aerolíneas de todo el mundo",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: Hotel,
                title: "Hoteles Exclusivos",
                description: "Ahorra hasta 60% en hoteles y resorts de lujo",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Ship,
                title: "Cruceros Premium",
                description: "Acceso a las mejores navieras con precios especiales",
                gradient: "from-cyan-500/20 to-blue-500/20"
              },
              {
                icon: Car,
                title: "Alquiler de Autos",
                description: "Renta vehículos con tarifas corporativas",
                gradient: "from-orange-500/20 to-red-500/20"
              }
            ].map((benefit, idx) => (
              <Card key={idx} className={`bg-gradient-to-br ${benefit.gradient} backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-xl transition-all group`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Proof Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-secondary/30 bg-secondary/10 text-secondary px-4 py-1">
                <DollarSign className="w-4 h-4 mr-2" />
                Resultados Reales
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nuestros miembros ahorraron
                <span className="block text-secondary mt-2">$2,813,359 USD en 2024</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Lorenzo M.", country: "Colombia", savings: "$493", text: "He viajado a 3 países en 6 meses ahorrando casi $500 USD. ¡Increíble!" },
                { name: "Elena R.", country: "Turquía", savings: "$1,092", text: "Reservé un resort de lujo en Maldivas por menos de la mitad del precio público." },
                { name: "Carlos V.", country: "España", savings: "$847", text: "Las tarifas de cruceros son incomparables. Ya he hecho 2 viajes este año." }
              ].map((testimonial, idx) => (
                <Card key={idx} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{testimonial.name[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{testimonial.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {testimonial.country}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {testimonial.savings} ahorrados
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <Card className="bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 backdrop-blur-sm border-primary/30 shadow-2xl shadow-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Únete al Club Exclusivo
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Comienza a ahorrar en tus viajes hoy mismo
                </p>
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 mb-6 inline-block">
                  <div className="text-sm text-muted-foreground mb-2">Membresía anual</div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$179 USD</div>
                  <div className="text-sm text-muted-foreground">Acceso completo durante 12 meses</div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Tarifas exclusivas en 180+ países
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Programa Life Experiences® incluido
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Créditos de viaje acumulables
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Soporte personalizado 24/7
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => router.push(`/registro?ref=${username}`)}
                  className="bg-white hover:bg-white/90 text-primary shadow-xl text-lg px-12"
                >
                  Registrarme Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  🔒 Pago seguro con tarjeta o criptomonedas
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-sm mt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Licencias Oficiales</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Florida ST-37449</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Iowa 951</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>California 2106836-40</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Ubicaciones Corporativas</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>Hong Kong • Florida • París • Dubái</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
              <p>&copy; 2026 Viaja Ligero. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}