import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Users,
  Bot,
  BarChart3,
  MessageSquare,
  Globe,
  Zap,
  DollarSign,
  Laptop,
  Shield,
  Award
} from "lucide-react";

export default function AmbassadorLandingPage() {
  const router = useRouter();
  const { username } = router.query;
  const [referrerName, setReferrerName] = useState<string>("");

  useEffect(() => {
    if (username && typeof username === 'string') {
      const formattedName = username
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setReferrerName(formattedName);
    }
  }, [username]);

  const handleCTA = () => {
    router.push(`/registro?ref=${username}`);
  };

  const systemFeatures = [
    {
      icon: Bot,
      title: "IA Potenciada",
      description: "Seguimiento automático con mensajes inteligentes personalizados",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Dashboard Completo",
      description: "Gestión total de leads, comisiones y tu red de distribuidores",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Funnel Automatizado",
      description: "Sistema de ventas completo con seguimiento 24/7",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: TrendingUp,
      title: "MLM Inteligente",
      description: "Construye tu red con herramientas profesionales",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const includedTools = [
    "Landing pages optimizadas para conversión",
    "Admin de leads con seguimiento en tiempo real",
    "Mensajes automatizados potenciados con IA",
    "Dashboard de comisiones y red MLM",
    "Sistema de referidos automático",
    "Analytics y reportes detallados",
    "Soporte técnico prioritario",
    "Actualizaciones constantes del sistema"
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Distribuidores Activos" },
    { icon: DollarSign, value: "$10K+", label: "Promedio Mensual Top 10%" },
    { icon: Globe, value: "40+", label: "Países" },
    { icon: Zap, value: "24/7", label: "Automatización" }
  ];

  return (
    <>
      <SEO 
        title="Sistema MLM Automatizado - Viaja Ligero"
        description="Construye tu negocio de viajes con nuestro sistema completo: IA, funnel automatizado, admin de leads y más"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">Viaja Ligero</span>
              </div>
              <Badge variant="outline" className="border-primary/50 bg-primary/10">
                Sistema MLM Pro
              </Badge>
            </div>
          </header>

          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
            {referrerName && (
              <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white px-6 py-2 text-base">
                <Award className="w-4 h-4 mr-2" />
                {referrerName} te invita a su equipo
              </Badge>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Haz Crecer Tu Negocio MLM
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                con un Sistema Automático
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Sistema completo de ventas automatizado con IA: funnel, admin de leads, 
              seguimiento inteligente, dashboard MLM y todo lo que necesitas para construir 
              tu red de distribuidores profesionalmente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={handleCTA}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg px-8 py-6"
              >
                Empezar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/pricing')}
                className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
              >
                Ver Demo del Sistema
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sistema Probado</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-purple-500" />
                <span>Cloud Based</span>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-7xl mx-auto px-4 py-12 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* System Features */}
          <section className="max-w-7xl mx-auto px-4 py-16 mb-16">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
                Sistema Completo
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Todo lo que Necesitas en un Solo Sistema
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                No necesitas contratar múltiples herramientas. Todo está integrado y listo para usar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {systemFeatures.map((feature, idx) => (
                <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Included Tools */}
          <section className="max-w-7xl mx-auto px-4 py-16 mb-16">
            <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    ¿Qué Incluye el Sistema?
                  </h2>
                  <p className="text-muted-foreground">
                    Todas estas herramientas profesionales por una inversión única
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {includedTools.map((tool, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{tool}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Pricing CTA */}
          <section className="max-w-4xl mx-auto px-4 py-16 mb-16">
            <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 border-0 text-white">
              <CardContent className="p-8 md:p-12 text-center">
                <Laptop className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Empieza Hoy Mismo
                </h2>
                <p className="text-white/90 mb-2 text-lg">
                  Inversión inicial de solo
                </p>
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  $29 USD
                </div>
                <p className="text-white/80 mb-8">
                  Acceso completo al sistema por 30 días. Luego $19 USD/mes.
                </p>
                <Button 
                  size="lg" 
                  onClick={handleCTA}
                  className="bg-white text-purple-600 hover:bg-gray-100 border-0 text-lg px-8 py-6"
                >
                  Registrarme Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-white/70 text-sm mt-4">
                  ✓ Sin contratos largos  ✓ Cancela cuando quieras  ✓ Soporte incluido
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/30 bg-card/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">LICENCIAS OFICIALES</h3>
                  <p className="text-sm text-muted-foreground">
                    Seller of Travel: Florida ST-15578, Iowa 688, California 2068362-50
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">OFICINAS CORPORATIVAS</h3>
                  <p className="text-sm text-muted-foreground">
                    Hong Kong • Orlando, Florida • París • Dubái
                  </p>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border/30">
                <p>© 2026 Viaja Ligero. Sistema MLM Automatizado. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}