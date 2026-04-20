import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Target,
  CheckCircle2,
  ArrowRight,
  Zap,
  BarChart3,
  Clock,
  Shield
} from "lucide-react";

export default function MWRLandingPage() {
  const [email, setEmail] = useState("");

  return (
    <>
      <SEO 
        title="Sistema Automático MWR - Hub IA Marketing Solutions"
        description="Genera prospectos, automatiza seguimientos y duplica tu red MWR con IA"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
        <div className="absolute inset-0 bg-[url('/mountain-lake-boats.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/50 to-blue-950" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-sm px-4 py-1">
            🚀 Sistema Piloto Disponible
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Haz crecer tu negocio MWR con un{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              sistema automático
            </span>
            {" "}de prospectos y ventas
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Genera más interés, automatiza seguimientos y duplica tu equipo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg font-semibold shadow-2xl"
            >
              Acceder al Sistema Piloto
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="h-14 px-8 border-2 border-white text-white hover:bg-white/10 text-lg"
            >
              Ver Demo en Video
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">30+</div>
              <div className="text-sm text-blue-200">Prospectos/mes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">5X</div>
              <div className="text-sm text-blue-200">Más seguimiento</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm text-blue-200">Sistema activo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-100 text-red-700 border-red-200">
              La Realidad
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              La mayoría no crece porque{" "}
              <span className="text-red-600">no tiene sistema</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-red-100 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Dependen de motivación</h3>
                <p className="text-muted-foreground">
                  No de procesos duplicables que funcionen sin ti
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Sin seguimiento consistente</h3>
                <p className="text-muted-foreground">
                  Los prospectos se pierden porque nadie les da seguimiento
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">No pueden duplicarse</h3>
                <p className="text-muted-foreground">
                  Su equipo no sabe cómo replicar lo que funciona
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solución Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
              La Solución
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Un sistema que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                trabaja por ti
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automatiza la prospección, el seguimiento y la duplicación
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Embudo automatizado</h3>
                    <p className="text-muted-foreground text-lg">
                      Genera prospectos interesados en viajes que llegan directo a tu CRM
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">CRM inteligente</h3>
                    <p className="text-muted-foreground text-lg">
                      Seguimiento automático por WhatsApp con recordatorios
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">IA que genera mensajes</h3>
                    <p className="text-muted-foreground text-lg">
                      Scripts perfectos para invitar, dar seguimiento y cerrar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-2xl">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-blue-600 text-white">
                  Vista del Dashboard
                </Badge>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">María López</div>
                      <div className="text-sm text-muted-foreground">Nuevo prospecto</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-sm">
                    <p className="text-slate-700 italic">
                      "Hola María! 👋 Estoy ayudando a personas a viajar más pagando menos. ¿Te gustaría conocer cómo funciona?"
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-muted-foreground">Leads activos</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-muted-foreground">En seguimiento</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-purple-950 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Qué logras con este sistema?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <TrendingUp className="w-12 h-12 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Genera prospectos diarios</h3>
                <p className="text-blue-100">
                  Personas interesadas en viajes entran automáticamente a tu embudo
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <Clock className="w-12 h-12 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Automatiza seguimiento</h3>
                <p className="text-blue-100">
                  WhatsApp automático con mensajes personalizados por IA
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Duplica tu sistema</h3>
                <p className="text-blue-100">
                  Todo tu equipo MWR puede usar el mismo proceso
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prueba el sistema 14 días
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Acceso completo al sistema piloto. Si no generas actividad en tu negocio MWR, no pagas mensualidad.
          </p>

          <Card className="bg-white shadow-2xl max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Input 
                  placeholder="Tu email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg"
                />
                <Button 
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold"
                >
                  Empezar Ahora - Solo $29 USD
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Garantía de 14 días</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Sin contratos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cancela cuando quieras</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Soporte incluido</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}