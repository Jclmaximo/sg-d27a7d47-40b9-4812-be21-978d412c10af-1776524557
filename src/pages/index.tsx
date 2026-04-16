import { FunnelHero } from "@/components/FunnelHero";
import { ValueProposition } from "@/components/ValueProposition";
import { SegmentationQuiz } from "@/components/SegmentationQuiz";
import { SocialProof } from "@/components/SocialProof";
import { FunnelTestimonials } from "@/components/FunnelTestimonials";
import { FunnelForm } from "@/components/FunnelForm";
import { FunnelFooter } from "@/components/FunnelFooter";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Travel Advantage - Acceso Exclusivo a Viajes Premium"
        description="Accede a precios exclusivos en hoteles, vuelos y experiencias de viaje que no están disponibles al público. Ahorra en cada viaje y genera ingresos."
        image="/og-image.png" />
      
      
      <main className="min-h-screen">
        {/* Etapa 1: Captación y Gancho */}
        <FunnelHero />
        
        {/* Etapa 2: Propuesta de Valor */}
        <ValueProposition />
        
        {/* Etapa 3: Segmentación y Pre-calificación */}
        <SegmentationQuiz />
        
        {/* Etapa 4: Prueba Social y Credibilidad */}
        <SocialProof />
        
        {/* Testimonios específicos */}
        <section className="py-20 px-6 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Historias de Éxito de Nuestros Miembros
              </h2>
              <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
              <p className="text-lg text-muted-foreground">
                Viajeros reales compartiendo sus experiencias y ahorros con Travel Advantage
              </p>
            </div>
            <FunnelTestimonials />
          </div>
        </section>
        
        {/* Etapa 5: Llamada a la Acción y Captura de Datos */}
        <section id="contact-form" className="py-20 px-6 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comienza a Ahorrar en Tus Viajes Hoy
              </h2>
              <div className="h-1 w-24 bg-accent mx-auto mb-6" style={{ backgroundColor: "#3b82f6", backgroundImage: "none" }}></div>
              <p className="text-lg text-muted-foreground">
                Déjanos tus datos y un asesor te contactará para mostrarte cómo funciona el club
              </p>
            </div>
            <FunnelForm />
          </div>
        </section>
        
        {/* Footer con Licencias y Ubicaciones */}
        <FunnelFooter />
      </main>
    </>);

}