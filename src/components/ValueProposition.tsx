import { MapPin, Plane, Gift, Award } from "lucide-react";

const benefits = [
  {
    icon: Plane,
    title: "Plataforma Privada de Viajes",
    description: "Acceso a más de 1 millón de hoteles, vuelos, cruceros y alquiler de autos con tarifas preferenciales exclusivas para miembros.",
    image: "/luxury-resort.jpg"
  },
  {
    icon: Award,
    title: "Life Experiences®",
    description: "Viajes de lujo curados en destinos premium como Dubái, Nueva York, Cancún y más, diseñados para crear momentos inolvidables.",
    image: "/alaska-cruise.jpg"
  },
  {
    icon: Gift,
    title: "Créditos de Viaje",
    description: "Gana créditos canjeables para reducir el costo de tus futuras reservas y viaja más gastando menos.",
    image: "/happy-travelers.jpg"
  },
  {
    icon: MapPin,
    title: "Cobertura Global",
    description: "Más de 1 millón de hoteles, resorts y opciones de viaje en más de 190 países alrededor del mundo.",
    image: "/egypt-temple.jpg"
  }
];

export function ValueProposition() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Beneficios Exclusivos para Miembros
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accede a una plataforma completa diseñada para transformar la forma en que viajas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isGlobalCoverage = benefit.title === "Cobertura Global";
            
            return (
              <div
                key={index}
                className={`group ${isGlobalCoverage ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border ${isGlobalCoverage ? 'border-slate-200' : 'border-transparent'} hover:border-accent`}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 ${isGlobalCoverage ? 'bg-gradient-to-b from-black/30 via-black/10 to-transparent' : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'}`} />
                  <div className={`absolute ${isGlobalCoverage ? 'top-4 right-4' : 'top-4 right-4'} ${isGlobalCoverage ? 'bg-white' : 'bg-white/90 backdrop-blur-sm'} p-3 rounded-full shadow-lg`}>
                    <Icon className={`w-6 h-6 ${isGlobalCoverage ? 'text-primary' : 'text-blue-600'}`} />
                  </div>
                </div>

                <div className={`p-8 ${isGlobalCoverage ? 'bg-white' : 'bg-white'}`}>
                  {isGlobalCoverage && (
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                        {benefit.title.replace("Cobertura Global", "COBERTURA GLOBAL")}
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`${isGlobalCoverage ? 'text-3xl' : 'text-2xl'} font-bold mb-3 ${isGlobalCoverage ? 'text-slate-900' : 'text-foreground'}`}>
                    {isGlobalCoverage ? "Explora sin fronteras" : benefit.title}
                  </h3>
                  
                  {isGlobalCoverage && (
                    <div className="w-12 h-1 bg-primary mb-4" />
                  )}
                  
                  <p className={`${isGlobalCoverage ? 'text-slate-700' : 'text-muted-foreground'} leading-relaxed`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}