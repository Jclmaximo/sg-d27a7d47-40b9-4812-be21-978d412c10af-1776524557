import { FunnelTestimonials } from "@/components/FunnelTestimonials";

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Historias de Ahorro Real
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce cuánto han ahorrado nuestros miembros en sus viajes más recientes
          </p>
        </div>
        
        <FunnelTestimonials />
      </div>
    </section>
  );
}