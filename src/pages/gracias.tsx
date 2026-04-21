import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function GraciasPage() {
  const router = useRouter();
  const { ref } = router.query;

  useEffect(() => {
    // Auto redirect after 7 seconds to ambassador page or home
    const timer = setTimeout(() => {
      if (ref && typeof ref === "string") {
        router.push(`/ambassador/${ref}`);
      } else {
        router.push("/");
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [router, ref]);

  return (
    <>
      <SEO 
        title="¡Gracias por tu registro! - Viaja Ligero"
        description="Tu registro ha sido recibido exitosamente"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="pt-12 pb-12 px-6 text-center">
            
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              ¡Registro Exitoso!
            </h1>

            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-accent" />
              <p className="text-xl text-muted-foreground">
                Bienvenido a Viaja Ligero
              </p>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <p className="text-lg mb-4">
                Hemos recibido tu información correctamente.
              </p>
              <p className="text-muted-foreground">
                Uno de nuestros asesores se pondrá en contacto contigo en las próximas <strong className="text-foreground">24 horas</strong> para completar tu membresía y darte acceso a todas las tarifas exclusivas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Acceso a 180+ países</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Ahorro de hasta 60% en viajes</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Experiencias de lujo exclusivas</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <Button
                onClick={() => {
                  if (ref && typeof ref === "string") {
                    router.push(`/ambassador/${ref}`);
                  } else {
                    router.push("/");
                  }
                }}
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                Volver al inicio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Serás redirigido automáticamente en unos segundos...
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  );
}