import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  ArrowRight,
  TrendingUp,
  Users,
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
        title="Cómo Funciona - Sistema MLM"
        description="Sistematiza tu negocio MLM con procesos duplicables y escalables"
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero / Intro */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 pt-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-8">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-2">
                <span className="text-blue-600 font-semibold">🎯 Sistema de Marketing MLM</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-slate-900">
              El Crecimiento en Tu Negocio MLM no Depende de tu Energía...
              <br />
              <span className="text-blue-600">Depende de Sistematizar tus Procesos</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              El problema no es la falta de motivación. Es la falta de procesos duplicables que trabajen por ti mientras duermes.
            </p>

            {/* Video Player */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <video 
                  className="w-full h-auto aspect-video object-cover bg-black"
                  controls
                  autoPlay
                  playsInline
                  onPlay={() => setShowCTA(true)}
                >
                  <source src="/v2_1776702836375-392447068.mp4" type="video/mp4" />
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                ⏱️ Descubre cómo sistematizar tu negocio MLM
              </p>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-block mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-full px-6 py-2">
                <span className="text-red-600 font-semibold">⚠️ El Problema Real</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-slate-900">
              ¿Por qué la mayoría de distribuidores <br className="hidden md:block" />
              <span className="text-red-500">no logran escalar su red?</span>
            </h2>

            <div className="grid gap-8 text-left">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">Trabajan EN el negocio, no EN el sistema</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Cada prospecto requiere tu tiempo, cada seguimiento consume tu energía, cada cierre depende de tu presencia. 
                      <span className="text-slate-900 font-semibold"> Todo es manual, nada es automático.</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">Dependen de motivación, no de metodología</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Se cargan de energía en los eventos... pero al día siguiente no tienen un proceso claro de qué hacer, cómo hacerlo ni cuándo hacerlo.
                      <span className="text-slate-900 font-semibold"> La falta de procesos mata la constancia.</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">No pueden duplicar porque no hay qué duplicar</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Tu equipo pregunta "¿qué hago?", "¿cómo invito?". Si no tienes guiones estandarizados ni embudos comprobados...
                      <span className="text-slate-900 font-semibold"> Sin procesos claros, no hay duplicación real.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revelation Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-block mb-8">
              <div className="bg-green-500/10 border border-green-500/30 rounded-full px-6 py-2">
                <span className="text-green-700 font-semibold">💡 La Revelación</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-slate-900">
              Los líderes de 6 y 7 cifras <br className="hidden md:block" />
              <span className="text-green-600">tienen una cosa en común</span>
            </h2>

            <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-12 border border-green-800 mb-12 shadow-xl">
              <p className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                No venden con su carisma.
                <br />
                <span className="text-green-400">Venden con procesos sistematizados.</span>
              </p>
              <p className="text-xl text-green-50">
                Han convertido la prospección y el seguimiento en una máquina predecible. Su equipo simplemente conecta a las personas al sistema.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="text-5xl mb-4">🔄</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Sistemas Automatizados</h3>
                <p className="text-slate-600">
                  El embudo trabaja 24/7 generando interés y educando al prospecto sin que tú estés presente.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Metodología Medible</h3>
                <p className="text-slate-600">
                  Cada paso documentado. Las interacciones y seguimientos ya no son improvisados.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Duplicación Instantánea</h3>
                <p className="text-slate-600">
                  Tu equipo ya no tiene que "aprender a vender". Solo ejecutan el mismo proceso paso a paso.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                El Nuevo Sistema Operativo para Tu Negocio MLM
              </h2>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      1
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900">Embudo de Viajes Sistematizado</h3>
                      <p className="text-lg text-slate-700 mb-4">
                        Tu página personal captura prospectos interesados en ahorrar en viajes, filtrando a los curiosos y dejando solo a los verdaderamente interesados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      2
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900">CRM de Gestión de Leads</h3>
                      <p className="text-lg text-slate-700 mb-4">
                        Cada contacto entra a tu pipeline organizado. Sabes exactamente en qué etapa del proceso está cada persona, sin perder seguimientos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      3
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-900">Comunicación por IA</h3>
                      <p className="text-lg text-slate-700 mb-4">
                        Procesos de comunicación estandarizados. La IA crea el mensaje de seguimiento perfecto basado en el comportamiento del prospecto.
                      </p>
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
              El Poder de la Sistematización
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 mb-12">
              "Imagina 30 personas en tu equipo conectadas a este mismo sistema operativo"
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">900+</div>
                  <p className="text-blue-100 font-medium">Prospectos al mes</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <p className="text-blue-100 font-medium">Procesos activos</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <p className="text-blue-100 font-medium">Duplicable</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {showCTA && (
          <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 sticky bottom-0 shadow-2xl z-50">
            <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Sistematiza Tu Negocio MLM Hoy
                </h2>
                <p className="text-blue-100">
                  Accede al sistema piloto por 14 días • Solo $29 USD
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => router.push("/mwr/checkout")}
                className="h-14 px-8 bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-lg font-bold shadow-xl"
              >
                Acceder al Sistema Piloto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}