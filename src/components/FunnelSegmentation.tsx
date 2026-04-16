"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SegmentationProps {
  onSelect: (option: "save" | "earn" | "both") => void;
}

export function FunnelSegmentation({ onSelect }: SegmentationProps) {
  const [selected, setSelected] = useState<"save" | "earn" | "both" | null>(null);

  const options = [
    {
      id: "save" as const,
      icon: Sparkles,
      title: "Solo ahorrar en viajes",
      description: "Accede a tarifas exclusivas para miembros"
    },
    {
      id: "earn" as const,
      icon: TrendingUp,
      title: "Generar ingresos",
      description: "Conviértete en Lifestyle Ambassador"
    },
    {
      id: "both" as const,
      icon: Zap,
      title: "Ambas opciones",
      description: "Ahorra y genera ingresos al mismo tiempo"
    }
  ];

  const handleSelect = (option: typeof options[0]) => {
    setSelected(option.id);
    onSelect(option.id);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            className={cn(
              "p-6 rounded-xl border-2 transition-all text-left",
              "hover:border-primary hover:shadow-lg",
              isSelected
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-muted bg-white"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              isSelected ? "bg-primary" : "bg-muted"
            )}>
              <Icon className={cn(
                "w-6 h-6",
                isSelected ? "text-white" : "text-primary"
              )} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}