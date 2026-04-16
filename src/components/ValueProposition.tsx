import { Plane, Sparkles, DollarSign, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const benefits = [
  {
    icon: Plane,
    title: "Plataforma Privada de Viajes",
    description: "Acceso exclusivo a tarifas preferenciales en hoteles, vuelos, cruceros, resorts y alquiler de autos que no están disponibles al público general.",
    image: "/maldives-kayak.jpg",
    alt: "Kayak transparente en aguas cristalinas turquesas de Maldivas con bungalows sobre el agua"
  },
  {
    icon: Sparkles,
    title: "Life Experiences®",
    description: "Viajes de lujo curados en destinos exclusivos como Dubái, Nueva York, París y más, diseñados específicamente para miembros del club.",
    image: "/alaska-cruise.jpg",
    alt: "Crucero de lujo navegando entre glaciares y montañas nevadas en Alaska"
  },
  {
    icon: DollarSign,
    title: "Créditos de Viaje",
    description: "Genera y acumula créditos para reducir significativamente el costo de tus futuras reservas y experiencias de viaje.",
    image: "/happy-travelers.jpg",
    alt: "Pareja feliz explorando ciudad europea con mapa, disfrutando de sus viajes"
  },
  {
    icon: MapPin,
    title: "Cobertura Global",
    description: "Más de 1 millón de hoteles, resorts y opciones de viaje en más de 190 países alrededor del mundo.",
    image: "/egypt-temple.jpg",
    alt: "Viajera explorando el templo de Abu Simbel en Egipto al atardecer"
  }
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Beneficios Exclusivos para Miembros
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accede a una plataforma completa diseñada para transformar la forma en que viajas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-2 hover:border-accent transition-all duration-300 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={benefit.image}
                    alt={benefit.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay - muy sutil solo en la parte inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 bg-card">
                  <h3 className="text-xl font-heading font-semibold text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}