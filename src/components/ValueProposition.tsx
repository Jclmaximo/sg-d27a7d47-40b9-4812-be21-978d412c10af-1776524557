import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, DollarSign, Users, Shield, TrendingUp, Zap } from "lucide-react";

const benefits = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Hasta 70% de Descuento",
    description: "Acceso a tarifas mayoristas en hoteles, vuelos y paquetes premium",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Red Global",
    description: "Más de 500,000 miembros viajando con nosotros en 180+ países",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Garantizado",
    description: "Protección total de tu inversión con nuestra garantía de satisfacción",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Genera Ingresos",
    description: "Gana comisiones por cada referido que se una al club",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Reservas Instantáneas",
    description: "Plataforma 24/7 para reservar tus viajes en minutos",
  },
  {
    icon: <Plane className="w-6 h-6" />,
    title: "Destinos Exclusivos",
    description: "Acceso a resorts y experiencias que no encontrarás en otro lugar",
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 px-4 bg-card/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Plane className="w-4 h-4 mr-2" />
            Beneficios Exclusivos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
            Por Qué Miles Eligen Viaja Ligero
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La forma inteligente de viajar más, gastar menos y generar ingresos pasivos
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof Image */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-64 md:h-96">
              <Image
                src="/happy-travelers.jpg"
                alt="Viajeros felices disfrutando de descuentos exclusivos"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end">
                <div className="p-8">
                  <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    "Ahorré $4,800 en mi último viaje a Maldivas"
                  </p>
                  <p className="text-muted-foreground">
                    - María González, Miembro desde 2023
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}