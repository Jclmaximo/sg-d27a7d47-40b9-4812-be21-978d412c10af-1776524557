import { TrendingUp, Users, Globe, Award } from "lucide-react";

const stats = [
{
  icon: TrendingUp,
  value: "$2,813,359",
  label: "Ahorrados por miembros en 2024"
},
{
  icon: Users,
  value: "50,000+",
  label: "Miembros activos en el club"
},
{
  icon: Globe,
  value: "190+",
  label: "Países con cobertura"
},
{
  icon: Award,
  value: "15+",
  label: "Años de experiencia"
}];


export function SocialProof() {
  return (
    <section className="py-20 px-6 bg-primary text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Resultados Comprobados
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6" style={{ backgroundColor: "#99f6e4", backgroundImage: "none" }}></div>
          <p className="text-lg text-white/90">
            Miles de viajeros ya están ahorrando y generando ingresos con Travel Advantage
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) =>
          <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#99f6e4", backgroundImage: "none" }}>
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-white/80">{stat.label}</p>
            </div>
          )}
        </div>
        
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            Casos Reales de Ahorro
          </h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <p className="text-lg text-white/90 mb-6">
              Nuestros miembros han viajado a destinos increíbles ahorrando miles de dólares. 
              Desde escapadas familiares hasta viajes de negocios, Travel Advantage hace que cada experiencia sea más accesible.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">🇨🇴 Colombia: -$493 USD</span>
              <span className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">🇹🇷 Turquía: -$1,092 USD</span>
              <span className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">🇲🇽 México: -$758 USD</span>
              <span className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-full">🇪🇸 España: -$1,245 USD</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}