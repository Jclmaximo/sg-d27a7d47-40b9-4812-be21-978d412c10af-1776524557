import { Plane, Sparkles, DollarSign, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Plane,
    title: "Plataforma Privada de Viajes",
    description: "Acceso exclusivo a tarifas preferenciales en hoteles, vuelos, cruceros, resorts y alquiler de autos que no encontrarás en sitios públicos."
  },
  {
    icon: Sparkles,
    title: "Life Experiences®",
    description: "Viajes de lujo curados en destinos premium como Dubái, Nueva York, París y más, diseñados exclusivamente para miembros del club."
  },
  {
    icon: DollarSign,
    title: "Créditos de Viaje",
    description: "Gana créditos acumulables que puedes usar para reducir significativamente el costo de tus futuras reservas y experiencias."
  },
  {
    icon: MapPin,
    title: "Cobertura Global",
    description: "Accede a beneficios en más de 190 países con soporte en múltiples idiomas y atención personalizada 24/7."
  }
];

export function ValueProposition() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Beneficios Exclusivos para Miembros
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Descubre todo lo que Travel Advantage tiene para ti
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}