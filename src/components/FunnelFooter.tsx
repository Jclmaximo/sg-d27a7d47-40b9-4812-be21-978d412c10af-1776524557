import { MapPin, Award, Shield } from "lucide-react";

const licenses = [
"Florida Seller of Travel #ST43597",
"Iowa Seller of Travel #1242",
"California Seller of Travel #2124590-70"];


const offices = [
{ city: "Hong Kong", address: "Levels 30-32, 68 Yee Wo Street, Causeway Bay" },
{ city: "Florida", address: "5830 Coral Ridge Drive, Coral Springs, FL 33076" },
{ city: "París", address: "35 Boulevard des Capucines, 75002" },
{ city: "Dubái", address: "Business Bay, Clover Bay Tower" }];


export function FunnelFooter() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <img 
              src="/viaja-ligero-logo.png" 
              alt="Viaja Ligero" 
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-background/80">
              Club exclusivo de viajes con acceso a tarifas preferenciales y experiencias únicas.
            </p>
          </div>

          {/* Licenses */}
          <div>
            <h3 className="font-semibold mb-4">Licencias y Certificaciones</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Seller of Travel - Florida (ST-43417)</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Seller of Travel - Iowa (1563)</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Seller of Travel - California (2193504-70)</span>
              </div>
            </div>
          </div>

          {/* Offices */}
          <div>
            <h3 className="font-semibold mb-4">Oficinas Corporativas</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Hong Kong</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Florida, USA</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>París, Francia</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Dubái, EAU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Viaja Ligero. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}