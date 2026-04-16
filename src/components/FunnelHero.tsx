"use client";

import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FunnelHero() {
  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-primary text-white px-6 py-20">
      <div className="container max-w-5xl text-center space-y-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">ACCESO EXCLUSIVO</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
          Cómo acceder a precios exclusivos en viajes y experiencias{" "}
          <span className="text-accent">que no están disponibles al público</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Únete a Travel Advantage: ahorra en cada viaje con tarifas preferenciales y, opcionalmente, 
          genera ingresos recomendando el club a otros viajeros.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <Button 
            size="lg" 
            onClick={scrollToForm}
            className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Ver cómo funciona el club
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={scrollToForm}
            className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
          >
            Empezar ahora
          </Button>
        </div>
        
        <div className="pt-8 animate-bounce">
          <ArrowDown className="w-6 h-6 mx-auto text-accent" />
        </div>
      </div>
    </section>
  );
}