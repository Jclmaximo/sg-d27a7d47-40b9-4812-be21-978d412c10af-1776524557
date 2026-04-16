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
    <footer className="bg-primary text-white py-16 px-6">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-semibold">Licencias y Certificaciones</h3>
            </div>
            <ul className="space-y-3">
              {licenses.map((license, index) =>
              <li key={index} className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">{license}</span>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-semibold">Oficinas Corporativas</h3>
            </div>
            <ul className="space-y-4">
              {offices.map((office, index) =>
              <li key={index}>
                  <p className="font-semibold text-accent" style={{ color: "#99f6e4" }}>{office.city}</p>
                  <p className="text-sm text-white/80">{office.address}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/70 text-sm">© 2026 Viaja LIgero Club. Todos los derechos reservados. | Política de Privacidad | Términos y Condiciones

          </p>
        </div>
      </div>
    </footer>);

}