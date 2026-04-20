import { MapPin, Phone, Mail } from "lucide-react";

export function FunnelFooter() {
  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Viaja Ligero</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Club exclusivo de viajes con descuentos de hasta 70% en destinos premium
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>soporte@viajaligero.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (305) 555-0123</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Legal</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Política de Reembolso
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Viaja Ligero. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}