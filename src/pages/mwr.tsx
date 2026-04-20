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
  Shield,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MWRLandingPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <>
      <SEO 
        title="Sistema Automático MWR - Hub IA Marketing Solutions"
        description="Genera prospectos, automatiza seguimientos y duplica tu red MWR con IA"
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMiAyLTQgNC00czQgMiA0IDQtMiA0LTQgNGMtMiAwLTQtMi00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-8 animate-bounce">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-full px-6 py-2 backdrop-blur-sm">
              <span className="text-yellow-300 font-semibold text-lg">🚀 Lanzamiento Piloto - Acceso Anticipado</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Haz Crecer <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Tu Negocio MLM</span>
            <br />
            con un Sistema Automático
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Genera más prospectos interesados, automatiza seguimientos inteligentes y duplica tu equipo con un sistema completo de marketing
          </p>

          <div className="flex flex-wrap gap-6 justify-center items-center mb-12 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>147 embajadores activos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>2,847 prospectos generados</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>89% tasa de respuesta IA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2">
                <span className="text-red-400 font-semibold">⚠️ El Problema Real</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              La mayoría no crece porque <span className="text-red-400">no tiene sistema</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tu éxito en MLM no debería depender de tu energía diaria o motivación. Necesitas procesos automatizados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="bg-red-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sin Embudo = Sin Prospectos</h3>
              <p className="text-slate-400 leading-relaxed">
                Depender de contacto manual y redes sociales limita tu alcance. Sin un embudo automático, pierdes oportunidades 24/7.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="bg-red-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Motivación vs Metodología</h3>
              <p className="text-slate-400 leading-relaxed">
                Ir a eventos y escuchar audios motiva... pero sin un proceso claro de seguimiento, los prospectos se enfrían y se pierden.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <div className="bg-red-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Imposible de Duplicar</h3>
              <p className="text-slate-400 leading-relaxed">
                Si tu sistema está en tu cabeza, tu equipo no puede copiarlo. La duplicación requiere procesos documentados y automatizados.
              </p>
            </div>
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
                  onClick={() => router.push("/mwr/registro")}
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