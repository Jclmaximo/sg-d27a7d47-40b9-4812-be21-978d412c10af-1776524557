"use client";

import { ArrowDown, Sparkles, Plane, Globe, Shield, Users, ChevronDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FunnelHeroProps {
  username?: string;
}

export function FunnelHero({ username }: FunnelHeroProps) {
  const scrollToBenefits = () => {
    const benefitsSection = document.getElementById("benefits-section");
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById("how-it-works-section");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Viaja Ligero - Club Exclusivo de Viajes
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Cómo acceder a{" "}
            <span className="text-primary">precios exclusivos</span> en viajes
            <br />
            que no están disponibles al público
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre la dualidad del club: <strong>ahorra en viajes de lujo</strong> y, 
            opcionalmente, <strong>genera ingresos</strong> por recomendación
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={scrollToHowItWorks}>
              <Plane className="mr-2 h-5 w-5" />
              Ver cómo funciona
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={scrollToBenefits}>
              <TrendingUp className="mr-2 h-5 w-5" />
              Conocer beneficios
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>190+ países</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Licencias verificadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Miles de miembros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
}