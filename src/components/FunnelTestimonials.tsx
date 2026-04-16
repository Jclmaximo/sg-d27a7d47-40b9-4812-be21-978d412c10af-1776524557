import { MapPin, DollarSign } from "lucide-react";

const testimonials = [
  {
    name: "Lorenzo",
    country: "Colombia",
    flag: "🇨🇴",
    savings: "$493 USD",
    trip: "Resort en Cartagena"
  },
  {
    name: "Elena",
    country: "Turquía",
    flag: "🇹🇷",
    savings: "$1,092 USD",
    trip: "Tour completo por Estambul"
  },
  {
    name: "Carlos",
    country: "México",
    flag: "🇲🇽",
    savings: "$758 USD",
    trip: "Crucero por el Caribe"
  },
  {
    name: "Sofia",
    country: "España",
    flag: "🇪🇸",
    savings: "$1,245 USD",
    trip: "Viaje familiar a París"
  },
  {
    name: "Miguel",
    country: "Argentina",
    flag: "🇦🇷",
    savings: "$621 USD",
    trip: "Resort en Punta Cana"
  },
  {
    name: "Ana",
    country: "Brasil",
    flag: "🇧🇷",
    savings: "$892 USD",
    trip: "Tour por Nueva York"
  }
];

export function FunnelTestimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-muted hover:border-primary transition-all hover:shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold text-lg">{testimonial.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{testimonial.flag} {testimonial.country}</span>
              </div>
            </div>
            <div className="bg-secondary/10 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-primary">{testimonial.savings}</p>
            <p className="text-sm text-muted-foreground">{testimonial.trip}</p>
          </div>
        </div>
      ))}
    </div>
  );
}