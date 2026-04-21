import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { 
  Bot,
  BarChart3,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Target,
  DollarSign,
  Globe
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Sistema MLM Automatizado - Haz Crecer Tu Negocio con IA"
        description="Plataforma completa para distribuidores: Dashboard de leads, seguimiento con IA, funnel automatizado y gestión de red MLM en un solo sistema."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-gradient-to-r from-secondary/20 to-accent/20 backdrop-blur-sm border-secondary/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Sistema MLM de Nueva Generación
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Haz Crecer Tu Negocio MLM
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-primary bg-clip-text text-transparent">
                con un Sistema Automático
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Todo lo que necesitas para gestionar tu red: Dashboard profesional, seguimiento con IA, 
              funnel automatizado y admin de leads en una sola plataforma.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Button 
                size="lg"
                onClick={() => router.push("/registro")}
                className="h-14 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-xl shadow-primary/20 border border-primary/50"
              >
                Empezar Ahora - $29 USD
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-14 px-8 border-border/50 bg-card/30 hover:bg-card/50 backdrop-blur-sm"
              >
                Ver Características
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Distribuidores Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Tasa de Conversión</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Automatización Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">$10K+</div>
                <div className="text-sm text-muted-foreground">Promedio Mensual</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section id="features" className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/30">
                Sistema Completo
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Todo lo que Necesitas en Una Plataforma
              </h2>
              <p className="text-xl text-muted-foreground">
                Automatiza, gestiona y escala tu negocio MLM con tecnología de punta
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Feature 1: IA */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">IA Potenciada</h3>
                  <p className="text-sm text-muted-foreground">
                    Mensajes automáticos personalizados con inteligencia artificial para cada prospecto
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2: Dashboard */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Dashboard Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Panel completo con métricas en tiempo real, gráficas y reportes detallados
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3: Funnel */}
              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Funnel Automático</h3>
                  <p className="text-sm text-muted-foreground">
                    Funnel de ventas pre-construido que convierte visitantes en clientes 24/7
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4: Red MLM */}
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:border-orange-500/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gestión de Red</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualiza tu red completa, comisiones y referidos en un solo lugar
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tools Included */}
        <section className="py-20 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <Badge variant="secondary" className="mb-4 px-4 py-2 bg-secondary/20 text-secondary border-secondary/30">
                    <Target className="w-4 h-4 mr-2" />
                    Herramientas Incluidas
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Sistema Completo Listo para Usar
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Todo lo que necesitas para empezar a generar resultados desde el día 1
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Admin de Leads Completo</p>
                      <p className="text-sm text-muted-foreground">Gestiona todos tus prospectos en un solo lugar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Mensajes con IA</p>
                      <p className="text-sm text-muted-foreground">Seguimiento automático personalizado por IA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Landing Pages Optimizadas</p>
                      <p className="text-sm text-muted-foreground">Páginas de alto rendimiento pre-diseñadas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Dashboard de Comisiones</p>
                      <p className="text-sm text-muted-foreground">Tracking en tiempo real de tus ganancias</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Sistema de Referidos</p>
                      <p className="text-sm text-muted-foreground">Links personalizados para cada distribuidor</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Reportes Avanzados</p>
                      <p className="text-sm text-muted-foreground">Métricas detalladas de rendimiento</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Integración de Pagos</p>
                      <p className="text-sm text-muted-foreground">Checkout con crypto (USDT) integrado</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Soporte Prioritario</p>
                      <p className="text-sm text-muted-foreground">Asistencia directa para distribuidores</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-20 px-4 relative">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-sm border-primary/30 shadow-2xl">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Empieza Hoy con Todo Incluido
                </h2>
                
                <div className="mb-6">
                  <div className="text-5xl font-bold text-primary mb-2">$29 USD</div>
                  <div className="text-lg text-muted-foreground mb-1">Primeros 30 días de acceso completo</div>
                  <div className="text-sm text-muted-foreground">Después solo $19 USD/mes</div>
                </div>

                <ul className="text-left max-w-md mx-auto mb-8 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">Acceso completo al sistema MLM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">Dashboard profesional + IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">Funnel automatizado incluido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">Sin límite de leads o referidos</span>
                  </li>
                </ul>
                
                <Button 
                  size="lg"
                  onClick={() => router.push("/registro")}
                  className="h-14 w-full md:w-auto px-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-xl shadow-primary/20"
                >
                  Registrarme Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="mt-6 text-sm text-muted-foreground">
                  🔒 Pago seguro con criptomonedas (USDT)
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Ubicaciones
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Hong Kong</li>
                  <li>Florida, USA</li>
                  <li>París, Francia</li>
                  <li>Dubái, UAE</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Términos y Condiciones</li>
                  <li>Política de Privacidad</li>
                  <li>Licencias</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Soporte</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Centro de Ayuda</li>
                  <li>Documentación</li>
                  <li>Contacto</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Síguenos</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Instagram</li>
                  <li>Facebook</li>
                  <li>LinkedIn</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/30">
              <p className="mb-2">Licencias: Florida ST-37449 | Iowa 951 | California 2106836-40</p>
              <p>&copy; {new Date().getFullYear()} Viaja Ligero MLM System. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}