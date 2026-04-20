import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2, MessageSquare } from "lucide-react";

interface FunnelFormProps {
  username?: string;
  ambassadorId?: string;
  ambassadorName?: string;
}

export function FunnelForm({ username, ambassadorId, ambassadorName }: FunnelFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    pais: "",
    interes: "ahorrar",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", { ...formData, username, ambassadorId });
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5" style={{ backgroundImage: "none", backgroundColor: "transparent" }}>
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {ambassadorName ? `Empieza tu experiencia con ${ambassadorName}` : "Empieza tu experiencia con Viaja Ligero"}
            </h2>
            <p className="text-lg text-muted-foreground">
              Completa el formulario y te contactaremos para mostrarte cómo acceder a beneficios exclusivos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="h-12" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono (WhatsApp) *</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+52 33 1234 5678"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="h-12" />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="pais">País *</Label>
              <Input
                id="pais"
                name="pais"
                type="text"
                placeholder="México"
                value={formData.pais}
                onChange={handleChange}
                required
                className="h-12" />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all"
              disabled={loading} style={{ backgroundColor: "#3b82f6", backgroundImage: "none" }}>
              
              {loading ? "Enviando..." : <MessageSquare className="mr-2 h-5 w-5" />}
              Empezar Ahora
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              Al enviar este formulario, aceptas que un embajador de Viaja Ligero Club se comunique contigo por WhatsApp para brindarte más información.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}