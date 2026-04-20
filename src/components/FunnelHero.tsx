"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, TrendingUp, Plane, Globe, Shield, ChevronDown } from "lucide-react";

interface FunnelHeroProps {
  onCTAClick: () => void;
  username?: string; // Add username to fix TS error in ambassador page
}

export function FunnelHero({ onCTAClick, username }: FunnelHeroProps) {
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
    <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
      
      <div className="container mx-auto px-4 relative z-10" style={{ backgroundColor: "#ffffff", backgroundImage: "none", borderRadius: "24px" }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          



          
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium" style={{ backgroundColor: "#3b82f6", backgroundImage: "none" }}>
            <Sparkles className="w-4 h-4" />
            Club Exclusivo de Viajes
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
    </section>);

}