import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { leadsService } from "@/services/leadsService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FunnelFormProps {
  ambassadorId?: string;
  ambassadorName?: string;
}

export function FunnelForm({ ambassadorId, ambassadorName }: FunnelFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert lead with ambassador tracking
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        user_id: ambassadorId || null, // Track which ambassador captured this lead
        source: ambassadorId ? `ambassador/${ambassadorName}` : "funnel",
        status: "nuevo"
      });

      if (error) throw error;

      toast({
        title: "¡Gracias por tu interés!",
        description: "Nos pondremos en contacto contigo muy pronto."
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", country: "" });
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu información. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5" style={{ backgroundImage: "none", backgroundColor: "transparent" }}>
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Empieza tu experiencia con Viaja Ligero
            </h2>
            <p className="text-lg text-muted-foreground">
              Completa el formulario y te contactaremos para mostrarte cómo acceder a beneficios exclusivos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.name}
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
              <Label htmlFor="phone">Teléfono (WhatsApp) *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 33 1234 5678"
                value={formData.phone}
                onChange={handleChange}
                required
                className="h-12" />
              
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                name="country"
                type="text"
                placeholder="México"
                value={formData.country}
                onChange={handleChange}
                required
                className="h-12" />
              
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all"
              disabled={loading}>
              
              {loading ? "Enviando..." : <MessageSquare className="mr-2 h-5 w-5" />}
              Empezar Ahora
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-center text-muted-foreground mt-4">Al enviar este formulario, aceptas que un embajador de Viaja Ligero Club se comunique contigo por WhatsApp para brindarte más información.

            </p>
          </form>
        </div>
      </div>
    </section>);

}