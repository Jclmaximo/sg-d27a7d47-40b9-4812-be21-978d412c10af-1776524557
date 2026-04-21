import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plane, 
  DollarSign, 
  Globe, 
  Shield, 
  Star, 
  TrendingUp, 
  Users,
  Sparkles,
  Check,
  ArrowRight,
  MapPin,
  Calendar,
  Award
} from "lucide-react";

export default function AmbassadorReferralPage() {
  const router = useRouter();
  const { username } = router.query;
  const [referrerName, setReferrerName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferrer() {
      if (!username || typeof username !== "string") return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("username", username.toLowerCase())
        .single();

      if (!error && data) {
        setReferrerName(data.full_name || username);
      } else {
        setReferrerName(username);
      }
      setLoading(false);
    }

    fetchReferrer();
  }, [username]);

  const handleCTA = () => {
    router.push(`/registro?ref=${username}`);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Ahorra hasta 60% en Viajes",
      description: "Accede a tarifas exclusivas en hoteles, vuelos, cruceros y más",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Globe,
      title: "180+ Países Disponibles",
      description: "Reserva en cualquier destino del mundo con descuentos garantizados",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "Experiencias de Lujo",
      description: "Viajes curados a destinos como Dubái, Maldivas, París y más",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "100% Seguro y Legal",
      description: "Licencias en Florida, Iowa, California. Oficinas en 4 continentes",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Miembros Activos", value: "50,000+", icon: Users },
    { label: "Países Disponibles", value: "180+", icon: MapPin },
    { label: "Ahorro Promedio", value: "$2,800", icon: TrendingUp },
    { label: "Años de Experiencia", value: "25+", icon: Award }
  ];

  const testimonials = [
    {
      name: "Lorenzo M.",
      country: "Colombia",
      savings: "$493",
      text: "Increíble plataforma. Ahorré casi $500 en mi último viaje a Cancún."
    },
    {
      name: "Elena R.",
      country: "España",
      savings: "$1,092",
      text: "Las tarifas son realmente exclusivas. Viajé a Turquía por una fracción del precio."
    },
    {
      name: "Carlos V.",
      country: "México",
      savings: "$856",
      text: "Vale cada centavo. Los descuentos en hoteles son impresionantes."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`Únete a Viaja Ligero | Invitación de ${referrerName}`}
        description="Accede a tarifas exclusivas en viajes que no están disponibles al público. Ahorra hasta 60% en hoteles, vuelos, cruceros y experiencias de lujo."
      />

      <div className="min-h-screen bg-background">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-primary fill-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                  Viaja Ligero
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Club Exclusivo de Viajes
              </Badge>
            </div>
          </header>

          {/* Hero Section */}
          <section className="py-16 md:py-24 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {referrerName} te invita a unirte
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Viaja Más,
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Gasta Menos
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Accede a <span className="text-foreground font-semibold">tarifas exclusivas de viaje</span> que no están disponibles al público. 
                Ahorra hasta <span className="text-foreground font-semibold">60% en hoteles, vuelos, cruceros</span> y más.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="text-lg h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  onClick={handleCTA}
                >
                  Empezar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg h-14 px-8 border-2"
                  onClick={() => router.push("/pricing")}
                >
                  Ver Planes
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Licencias Florida, Iowa, California</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>Oficinas en 4 continentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Pagos 100% seguros</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 px-4 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="bg-background/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 text-center">
                      <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-primary to-cyan-500 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 md:py-24 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4" variant="secondary">Beneficios Exclusivos</Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Por qué más de 50,000 viajeros eligen Viaja Ligero
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  No es solo un club de viajes, es tu pasaporte a experiencias inolvidables con descuentos garantizados
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, idx) => (
                  <Card key={idx} className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden">
                    <CardContent className="p-8">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.gradient} mb-4`}>
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4" variant="secondary">Resultados Reales</Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Miembros que ya están ahorrando
                </h2>
                <p className="text-lg text-muted-foreground">
                  En 2024, nuestros miembros ahorraron un total de <span className="text-foreground font-bold">$2,813,359 USD</span>
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <Card key={idx} className="bg-background/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {testimonial.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {testimonial.country}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="inline-flex px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                            Ahorró {testimonial.savings}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{testimonial.text}"
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-16 md:py-24 px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <CardContent className="p-12 relative z-10 text-center text-white">
                  <Calendar className="h-12 w-12 mx-auto mb-6 opacity-90" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Comienza a ahorrar hoy mismo
                  </h2>
                  <p className="text-lg mb-8 opacity-90">
                    Únete a Viaja Ligero por solo <span className="font-bold text-2xl">$29 USD</span> y accede a tarifas exclusivas por 30 días
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg h-14 px-8"
                    onClick={handleCTA}
                  >
                    Registrarme Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="mt-6 text-sm opacity-75">
                    Después solo $19 USD mensuales • Cancela cuando quieras
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/30 py-12 px-4 bg-background/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Seller of Travel - Florida: ST43374</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Iowa: 1851</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>California: 2156459-70</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>Hong Kong</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>Florida, USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>París, Francia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>Dubái, UAE</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2026 Viaja Ligero. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}