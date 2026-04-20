import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Star, Users, Calendar, Shield } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Viajero Básico",
      description: "Ideal para viajeros ocasionales que buscan ahorrar",
      price: billingPeriod === "monthly" ? 19 : 190,
      period: billingPeriod === "monthly" ? "/mes" : "/año",
      savings: billingPeriod === "annual" ? "Ahorra $38" : null,
      initialPrice: 29,
      features: [
        "Acceso a plataforma de viajes",
        "Descuentos exclusivos en hoteles",
        "Hasta 10% de ahorro en reservas",
        "Soporte por email",
        "1 usuario",
      ],
      cta: "Empezar Ahora",
      popular: false,
      color: "muted",
    },
    {
      name: "Lifestyle Ambassador",
      description: "Para quienes buscan viajar más Y generar ingresos",
      price: billingPeriod === "monthly" ? 99 : 990,
      period: billingPeriod === "monthly" ? "/mes" : "/año",
      savings: billingPeriod === "annual" ? "Ahorra $198" : null,
      features: [
        "Todo en Viajero Básico",
        "Hasta 25% de ahorro en reservas",
        "Programa Life Experiences®",
        "Comisiones por referidos",
        "Portal personalizado de afiliado",
        "Soporte prioritario",
        "Acceso a eventos exclusivos",
        "Hasta 5 usuarios en tu equipo",
      ],
      cta: "Convertirse en Ambassador",
      popular: true,
      color: "primary",
    },
    {
      name: "Empresarial",
      description: "Para agencias y equipos grandes",
      price: null,
      period: "",
      savings: null,
      features: [
        "Todo en Lifestyle Ambassador",
        "Usuarios ilimitados",
        "API personalizada",
        "Integración con sistemas existentes",
        "Gestor de cuenta dedicado",
        "Soporte 24/7",
        "Reportes personalizados",
        "Capacitación para tu equipo",
      ],
      cta: "Contactar Ventas",
      popular: false,
      color: "secondary",
    },
  ];

  return (
    <>
      <SEO
        title="Planes y Precios - Viaja Ligero"
        description="Elige el plan perfecto para ti. Ahorra en viajes o genera ingresos como Lifestyle Ambassador."
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating Orbs Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-heading bg-clip-text text-transparent">
              Viaja Ligero
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/reset-password">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 bg-accent/20 text-accent border border-accent/30">
              <Star className="w-4 h-4 mr-2" />
              Precios Especiales de Lanzamiento
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-heading bg-clip-text text-transparent">
              Elige Tu Camino
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ya sea que busques ahorrar en tus viajes o generar ingresos recomendando experiencias increíbles, tenemos el plan perfecto para ti.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${billingPeriod === "monthly" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                Mensual
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingPeriod === "annual" ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === "annual" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${billingPeriod === "annual" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                Anual
              </span>
              {billingPeriod === "annual" && (
                <Badge className="bg-secondary/20 text-secondary border border-secondary/30">
                  Ahorra 20%
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative pb-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-card/50 backdrop-blur-sm border-border/50 transition-all hover:shadow-2xl ${
                  plan.popular ? "shadow-2xl shadow-primary/10 border-primary/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Más Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-6">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="text-center mb-8">
                    {plan.price !== null ? (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-semibold text-muted-foreground">$</span>
                          <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-xl text-muted-foreground">{plan.period}</span>
                        </div>
                        {plan.savings && (
                          <Badge variant="secondary" className="mt-3 bg-secondary/20 text-secondary border border-secondary/30">
                            {plan.savings}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="text-3xl font-bold text-foreground">Personalizado</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${plan.color === "primary" ? "text-primary" : "text-secondary"} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    size="lg"
                    className={`w-full ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-background/50 hover:bg-background/80 text-foreground border border-border/50"
                    }`}
                    onClick={() => {
                      if (plan.price === null) {
                        window.location.href = "mailto:contacto@viajaligero.com";
                      } else {
                        router.push("/registro");
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Comparison */}
        <section className="relative py-20 px-4 bg-card/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
                ¿Por qué elegir Viaja Ligero?
              </h2>
              <p className="text-xl text-muted-foreground">
                Más que una membresía, es una comunidad de viajeros inteligentes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">100% Legal</h3>
                  <p className="text-sm text-muted-foreground">
                    Licencias de Seller of Travel en Florida, Iowa y California. Oficinas en 4 continentes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Comunidad Global</h3>
                  <p className="text-sm text-muted-foreground">
                    Únete a miles de viajeros que ya están ahorrando y generando ingresos con nosotros.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sin Compromisos</h3>
                  <p className="text-sm text-muted-foreground">
                    Cancela cuando quieras. Sin preguntas. Sin complicaciones. Tu satisfacción es nuestra prioridad.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
                  ¿Listo para empezar tu aventura?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Únete hoy y comienza a disfrutar de descuentos exclusivos en tus viajes
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl shadow-primary/20"
                  onClick={() => router.push("/registro")}
                >
                  Crear mi cuenta ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                © {new Date().getFullYear()} Viaja Ligero. Todos los derechos reservados.
              </p>
              <p className="text-xs">
                Licencias: Florida ST-15578 | Iowa 828 | California 2068362-40
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}