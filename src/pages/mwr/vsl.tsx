import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
  MessageSquare,
  BarChart3,
  Clock,
  XCircle
} from "lucide-react";

export default function MWRVSLPage() {
  const router = useRouter();
  const [showCTA, setShowCTA] = useState(false);

  // Simulate video progress to show CTA
  const handleVideoProgress = () => {
    setTimeout(() => {
      setShowCTA(true);
    }, 3000);
  };

  return (
    <>
      <SEO 
        title="Cómo Funciona - Sistema MWR"
        description="Descubre cómo los líderes de MWR están duplicando su red con procesos automatizados"
      />

      <div className="min-h-screen bg-slate-50">
        {/* Video Section */}
        <section className="bg-gradient-to-br from-blue-950 to-purple-950 py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-yellow-500 text-white">
                Video Exclusivo
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                El Sistema que los Líderes MWR
                <br />
                <span className="text-yellow-400">No Quieren que Conozcas</span>
              </h1>
              <p className="text-xl text-blue-100">
                Mira cómo transformar tu negocio en los próximos 14 días
              </p>
            </div>

            {/* Video Player */}
            <Card className="bg-black shadow-2xl">
              <CardContent className="p-0">
                <div 
                  className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center cursor-pointer"
                  onClick={handleVideoProgress}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-yellow-600 transition-colors">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-white text-lg">Click para reproducir</p>
                    <p className="text-slate-400 text-sm mt-2">Duración: 12 minutos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Problem Section */}
        {currentSection === "problema" && (
          <section className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-8">
                <div className="bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2">
                  <span className="text-red-400 font-semibold">⚠️ El Problema Real</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                ¿Por qué la mayoría de distribuidores <br className="hidden md:block" />
                <span className="text-red-400">no construyen equipos grandes?</span>
              </h2>

              <div className="space-y-8 text-left">
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/20 p-3 rounded-xl flex-shrink-0">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Trabajan EN el negocio, no EN el sistema</h3>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        Cada prospecto requiere tu tiempo, cada seguimiento consume tu energía, cada cierre depende de tu presencia. 
                        <span className="text-yellow-400 font-semibold"> No hay procesos automatizados.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/20 p-3 rounded-xl flex-shrink-0">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Dependen de motivación, no de metodología</h3>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        Van a eventos, escuchan audios, se cargan de energía... pero al día siguiente no tienen un proceso claro de qué hacer, cómo hacerlo, y cuándo hacerlo.
                        <span className="text-yellow-400 font-semibold"> El sistema no existe.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/20 p-3 rounded-xl flex-shrink-0">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white">No pueden duplicar porque no hay nada que duplicar</h3>
                      <p className="text-slate-300 text-lg leading-relaxed">
                        Tu equipo te pregunta "¿qué hago?", "¿cómo invito?", "¿qué digo?". 
                        No hay guiones, no hay embudos, no hay seguimiento automático.
                        <span className="text-yellow-400 font-semibold"> Sin sistema, no hay duplicación.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl border border-red-500/30">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  El resultado inevitable:
                </p>
                <p className="text-xl text-slate-300">
                  Trabajas más duro, cierras menos ventas, tu equipo no crece, y terminas quemado preguntándote 
                  <span className="text-red-400 font-semibold"> "¿por qué no funciona para mí?"</span>
                </p>
              </div>
            </div>
          </section>
        )}

        {currentSection === "revelacion" && (
          <section className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-8">
                <div className="bg-green-500/10 border border-green-500/30 rounded-full px-6 py-2">
                  <span className="text-green-400 font-semibold">💡 La Revelación</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Los líderes que crecen equipos grandes <br className="hidden md:block" />
                <span className="text-green-400">tienen una cosa en común</span>
              </h2>

              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-2xl p-12 border border-green-500/30 mb-12">
                <p className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  No venden con su carisma.
                  <br />
                  <span className="text-green-400">Venden con su sistema.</span>
                </p>
                <p className="text-xl text-slate-300">
                  Tienen procesos automatizados que generan prospectos, dan seguimiento, y duplican su metodología en cada miembro del equipo.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-5xl mb-4">🔄</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Procesos Automatizados</h3>
                  <p className="text-slate-300">
                    El embudo trabaja 24/7 generando interés sin que tú estés presente
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Metodología Clara</h3>
                  <p className="text-slate-300">
                    Cada paso documentado, cada mensaje escrito, cada acción medible
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Duplicación Instantánea</h3>
                  <p className="text-slate-300">
                    Tu equipo copia el sistema exacto que estás usando con un click
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-10 border border-blue-500/30">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  La diferencia entre trabajar duro y construir riqueza:
                </p>
                <p className="text-xl text-slate-300 mb-6">
                  Los líderes de 6 y 7 cifras no tienen más tiempo que tú.
                  <br />
                  <span className="text-blue-400 font-semibold">Tienen mejores sistemas.</span>
                </p>
                <div className="flex items-center justify-center gap-4 text-lg">
                  <span className="text-slate-400">Esfuerzo manual</span>
                  <ArrowRight className="text-yellow-400" />
                  <span className="text-green-400 font-semibold">Sistema automatizado</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Revelation Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-600 text-white">
                La Revelación
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Los Líderes que Crecen Usan{" "}
                <span className="text-green-600">Procesos Duplicables</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-8">
                  <Zap className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Embudo Automatizado</h3>
                  <p className="text-muted-foreground">
                    Genera prospectos interesados 24/7 sin que tengas que buscarlos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-8">
                  <MessageSquare className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">IA que Prospecta</h3>
                  <p className="text-muted-foreground">
                    Mensajes personalizados que convierten sin que escribas nada
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-8">
                  <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">CRM Completo</h3>
                  <p className="text-muted-foreground">
                    Seguimiento automático de cada prospecto hasta que cierre
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-green-200">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Duplicable</h3>
                  <p className="text-muted-foreground">
                    Todo tu equipo usa el mismo sistema desde día uno
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Así Funciona el Sistema
              </h2>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Embudo de Viajes</h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        Tu página personal captura prospectos interesados en ahorrar en viajes
                      </p>
                      <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                        <p className="text-sm text-slate-600 italic">
                          "Viaja más, paga menos: Descubre cómo acceder a tarifas exclusivas"
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Leads Entran al CRM</h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        Cada persona que se registra entra automáticamente a tu pipeline
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-3 text-center border">
                          <div className="text-2xl font-bold text-purple-600">12</div>
                          <div className="text-xs text-muted-foreground">Nuevos</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border">
                          <div className="text-2xl font-bold text-blue-600">8</div>
                          <div className="text-xs text-muted-foreground">Seguimiento</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border">
                          <div className="text-2xl font-bold text-green-600">4</div>
                          <div className="text-xs text-muted-foreground">Listos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">IA Genera Mensajes</h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        La IA crea mensajes personalizados para cada etapa del prospecto
                      </p>
                      <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-semibold">María López</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">
                          "Hola María! 👋 Vi que te interesa viajar más pagando menos. Te comparto cómo funciona la membresía..."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Scenario Section */}
        <section className="py-16 bg-gradient-to-br from-blue-950 to-purple-950 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Imagina Esto
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12">
              "30 personas en tu equipo usando esto diariamente"
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">900+</div>
                  <p className="text-blue-100">Prospectos por mes</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <p className="text-blue-100">Sistema trabajando</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <p className="text-blue-100">Duplicable</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {showCTA && (
          <section className="py-20 bg-gradient-to-r from-yellow-500 to-orange-500 sticky bottom-0 shadow-2xl">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Accede al Sistema Piloto Ahora
              </h2>
              <p className="text-xl text-white/90 mb-8">
                14 días de prueba • $29 USD • Garantía de resultados
              </p>

              <Button
                size="lg"
                onClick={() => router.push("/mwr/checkout")}
                className="h-16 px-12 bg-white text-orange-600 hover:bg-gray-100 text-xl font-bold shadow-2xl"
              >
                Empezar Ahora - $29 USD
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>

              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center text-white text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Sistema listo en 24 horas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Sin contratos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Cancela cuando quieras</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}