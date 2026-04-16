"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, User, Globe, MessageSquare } from "lucide-react";

export function FunnelForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    contact: "whatsapp"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aquí iría la lógica de envío
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-muted shadow-lg">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Nombre completo
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre"
            className="border-muted focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@email.com"
            className="border-muted focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Teléfono
          </Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1234567890"
            className="border-muted focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            País
          </Label>
          <Input
            id="country"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="Tu país"
            className="border-muted focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-6">
        <Label className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          Método de contacto preferido
        </Label>
        <div className="flex gap-4">
          {["whatsapp", "email", "llamada"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setFormData({ ...formData, contact: method })}
              className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                formData.contact === method
                  ? "border-primary bg-primary text-white"
                  : "border-muted hover:border-primary"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold">
        Empezar ahora
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Al continuar, aceptas recibir información sobre Travel Advantage
      </p>
    </form>
  );
}