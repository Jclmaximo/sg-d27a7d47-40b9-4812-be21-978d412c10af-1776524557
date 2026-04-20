import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { 
  Plane, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Globe, 
  Star,
  ArrowRight,
  Check,
  Shield,
  Zap
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Viaja Ligero - Acceso Exclusivo a Viajes Premium"
        description="Accede a tarifas exclusivas en hoteles, vuelos, cruceros y experiencias de lujo. Ahorra en viajes y genera ingresos por recomendación."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating Orbs Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-card/50 backdrop-blur-sm border-border/50">
              <Star className="w-4 h-4 mr-2" />
              Club Exclusivo de Viajes
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-heading bg-clip-text text-transparent leading-tight">
              Acceso a Precios Exclusivos en Viajes
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Tarifas preferenciales no disponibles al público. Ahorra en cada viaje y, opcionalmente, genera ingresos por recomendación.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Button 
                size="lg"
                onClick={() => router.push("/registro")}
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 border border-primary/50"
              >
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => router.push("/pricing")}
                className="h-14 px-8 border-border/50 bg-card/30 hover:bg-card/50 backdrop-blur-sm"
              >
                Ver Planes
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary" />
                <span>Licencias Florida, Iowa, California</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary" />
                <span>Oficinas en 4 continentes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-secondary/10 text-secondary border-secondary/30">
                Beneficios Exclusivos
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                ¿Qué te interesa más?
              </h2>
              <p className="text-xl text-muted-foreground">
                Elige tu camino en el club
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Solo Ahorrar */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                    <Plane className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Solo Ahorrar</h3>
                  <p className="text-muted-foreground mb-6">
                    Acceso completo a tarifas exclusivas en hoteles, vuelos, cruceros y experiencias de lujo.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Descuentos de hasta 70% en hoteles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Vuelos con tarifas corporativas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Cruceros y resorts de lujo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Generar Ingresos */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all cursor-pointer group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-all">
                    <DollarSign className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Generar Ingresos</h3>
                  <p className="text-muted-foreground mb-6">
                    Conviértete en Lifestyle Ambassador y gana comisiones por cada recomendación exitosa.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Comisiones por referidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Sistema de recompensas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Créditos de viaje adicionales</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ambas Opciones */}
              <Card className="bg-card/50 backdrop-blur-sm border-accent/50 hover:border-accent transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all">
                    <Zap className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ambas Opciones</h3>
                  <p className="text-muted-foreground mb-6">
                    Disfruta de todos los beneficios: ahorra en tus viajes y genera ingresos adicionales.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Todo lo de Solo Ahorrar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Todo lo de Generar Ingresos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm">Bonos exclusivos de membresía</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <Badge variant="secondary" className="mb-6 px-4 py-2 bg-secondary/10 text-secondary border-secondary/30">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Resultados Reales
                </Badge>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  $2,813,359 USD Ahorrados en 2024
                </h2>
                
                <p className="text-xl text-muted-foreground mb-12">
                  Nuestros miembros ahorraron colectivamente más de 2.8 millones de dólares el año pasado
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">$493</div>
                    <div className="text-sm text-muted-foreground">Lorenzo - Colombia</div>
                    <div className="text-xs text-muted-foreground mt-1">Ahorro en hotel 5 estrellas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">$1,092</div>
                    <div className="text-sm text-muted-foreground">Elena - Turquía</div>
                    <div className="text-xs text-muted-foreground mt-1">Paquete completo Estambul</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">$2,347</div>
                    <div className="text-sm text-muted-foreground">Carlos - España</div>
                    <div className="text-xs text-muted-foreground mt-1">Crucero familiar Mediterráneo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 relative">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl shadow-primary/10">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  ¿Listo para empezar?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Únete a miles de viajeros inteligentes que ya están ahorrando en sus aventuras
                </p>
                
                <Button 
                  size="lg"
                  onClick={() => router.push("/registro")}
                  className="h-14 w-full md:w-auto px-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 border border-primary/50"
                >
                  Ver Cómo Funciona
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Licencias: Florida ST-37449, Iowa 951, California 2106836-40</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4">Ubicaciones</h3>
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
                  <li>Contacto</li>
                  <li>FAQ</li>
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
              <p>&copy; {new Date().getFullYear()} Viaja Ligero. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}