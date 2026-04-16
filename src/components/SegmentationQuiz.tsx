"use client";

import { useState } from "react";
import { Briefcase, PiggyBank, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const options = [
  {
    id: "savings",
    icon: PiggyBank,
    title: "Solo ahorrar en viajes",
    description: "Quiero acceder a precios exclusivos y reducir mis gastos de viaje",
    color: "text-blue-600"
  },
  {
    id: "income",
    icon: Briefcase,
    title: "Generar ingresos",
    description: "Me interesa ganar comisiones recomendando el club a otros viajeros",
    color: "text-green-600"
  },
  {
    id: "both",
    icon: TrendingUp,
    title: "Ambas opciones",
    description: "Quiero ahorrar en mis viajes y también generar ingresos adicionales",
    color: "text-accent"
  }
];

export function SegmentationQuiz() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Qué te interesa más en este momento?
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Selecciona la opción que mejor se ajuste a tus objetivos
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {options.map((option) => (
            <Card
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={cn(
                "p-6 cursor-pointer transition-all hover:shadow-xl",
                selected === option.id 
                  ? "border-2 border-accent shadow-lg scale-105" 
                  : "border-border hover:border-accent/50"
              )}
            >
              <div className={cn("w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4", option.color)}>
                <option.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{option.title}</h3>
              <p className="text-muted-foreground text-center leading-relaxed">{option.description}</p>
              
              {selected === option.id && (
                <div className="mt-4 text-center">
                  <span className="inline-block px-3 py-1 bg-accent text-primary text-sm font-semibold rounded-full">
                    Seleccionado ✓
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}