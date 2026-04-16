import { Plane, Sparkles, DollarSign, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const benefits = [
  {
    icon: Plane,
    title: "Plataforma Privada de Viajes",
    description: "Acceso exclusivo a tarifas preferenciales en hoteles, vuelos, cruceros, resorts y alquiler de autos que no están disponibles al público general.",
    image: "/luxury-resort.jpg",
    alt: "Resort de lujo con piscina iluminada al atardecer"
  },
  {
    icon: Sparkles,
    title: "Life Experiences®",
    description: "Viajes de lujo curados en destinos exclusivos como Dubái, Nueva York, París y más, diseñados específicamente para miembros del club.",
    image: "/burj-khalifa.jpg",
    alt: "Vista panorámica del Burj Khalifa iluminado en Dubái"
  },
  {
    icon: DollarSign,
    title: "Créditos de Viaje",
    description: "Genera y acumula créditos para reducir significativamente el costo de tus futuras reservas y experiencias de viaje.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop&q=80",
    alt: "Viajero caminando con su maleta en un aeropuerto moderno"
  },
  {
    icon: MapPin,
    title: "Cobertura Global",
    description: "Más de 1 millón de hoteles, resorts y opciones de viaje en más de 190 países alrededor del mundo.",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80",
    alt: "Globo terráqueo vintage con pines iluminado"
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
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-accent-foreground" />
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