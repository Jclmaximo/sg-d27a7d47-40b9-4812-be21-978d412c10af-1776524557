import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { leadsService } from "@/services/leadsService";

export function FunnelForm() {
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

    try {
      // Save lead to database
      await leadsService.createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country
      });

      // Send to WhatsApp
      const message = `¡Hola! Quiero más información sobre Travel Advantage.%0A%0A` +
      `Nombre: ${formData.name}%0A` +
      `Email: ${formData.email}%0A` +
      `Teléfono: ${formData.phone}%0A` +
      `País: ${formData.country}%0A` +
      `Método de contacto: WhatsApp`;

      window.open(`https://wa.me/523314300767?text=${message}`, '_blank');

      // Reset form
      setFormData({ name: "", email: "", phone: "", country: "" });
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5" style={{ backgroundImage: "none", backgroundColor: "transparent" }}>
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comienza Tu Aventura Hoy
            </h2>
            <p className="text-lg text-muted-foreground">
              Completa el formulario y descubre cómo Travel Advantage puede transformar tu forma de viajar
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
              className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all">
              
              <MessageSquare className="mr-2 h-5 w-5" />
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