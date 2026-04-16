import { Plane, Sparkles, DollarSign, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const benefits = [
  {
    icon: Plane,
    title: "Plataforma Privada de Viajes",
    description: "Acceso a tarifas preferenciales en hoteles, vuelos, cruceros, resorts y alquiler de autos que no están disponibles al público general.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=85",
    alt: "Avión sobrevolando nubes al atardecer"
  },
  {
    icon: Sparkles,
    title: "Life Experiences®",
    description: "Viajes de lujo curados en destinos exclusivos como Dubái, Nueva York, París y más, con experiencias personalizadas para cada miembro.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=85",
    alt: "Skyline de Dubái con Burj Khalifa iluminado"
  },
  {
    icon: DollarSign,
    title: "Créditos de Viaje",
    description: "Gana créditos para reducir el costo de tus futuras reservas. Cada experiencia te acerca más a tu próximo viaje soñado.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85",
    alt: "Persona con maleta en aeropuerto moderno"
  },
  {
    icon: MapPin,
    title: "Cobertura Global",
    description: "Más de 1 millón de hoteles, 400 aerolíneas y opciones en más de 190 países. El mundo es tu destino con Travel Advantage.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=85",
    alt: "Globo terráqueo con pins de ubicaciones"
  }
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beneficios Exclusivos para Miembros
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre las ventajas que hacen de Travel Advantage el club de viajes más completo del mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={benefit.image}
                    alt={benefit.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
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