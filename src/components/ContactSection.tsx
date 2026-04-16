import { FunnelForm } from "@/components/FunnelForm";

export function ContactSection() {
  return (
    <section id="contact-form" className="py-20 px-6 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empieza tu viaje con Viaja Ligero
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Completa tus datos y un asesor se pondrá en contacto contigo para 
            explicarte cómo funciona el club y sus beneficios
          </p>
        </div>
        
        <FunnelForm />
      </div>
    </section>
  );
}