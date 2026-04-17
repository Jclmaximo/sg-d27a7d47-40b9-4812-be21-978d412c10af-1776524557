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
  const [submitted, setSubmitted] = useState(false);
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

  if (submitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-4 border-green-500">
            <div className="mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¡Registro Exitoso! 🎉
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Gracias por tu interés en Viaja Ligero
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                  <strong>Nos pondremos en contacto contigo muy pronto</strong> por {contactMethod === "whatsapp" ? "WhatsApp" : "email"} para compartir más información sobre el club y responder todas tus preguntas.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Respuesta en menos de 24 horas</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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