import { useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, CreditCard, Shield, Lock, Zap } from "lucide-react";

export default function MWRCheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Integrar con Stripe/procesador de pagos
      console.log("Procesando pago:", paymentData);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to onboarding/dashboard
      router.push("/admin/onboarding");
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Checkout - Sistema de Marketing MLM"
        description="Completa tu compra y accede al sistema automático de prospectos"
      />

      <div className="min-h-screen bg-background text-foreground py-12 px-4 relative">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/20 text-accent border border-accent/30 text-sm px-4 py-1">
              🎉 Último Paso
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
              Accede al Sistema Piloto
            </h1>
            <p className="text-xl text-muted-foreground">
              Únete a los distribuidores MLM que están creciendo su red automáticamente
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Tu Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start pb-3 border-b border-border/50">
                      <div>
                        <h3 className="font-semibold text-lg">Sistema Piloto MLM</h3>
                        <p className="text-sm text-muted-foreground">Acceso completo 30 días</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">$29</div>
                        <div className="text-xs text-muted-foreground line-through">$97</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>Embudo de viajes personalizado</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>CRM con seguimiento automático</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>IA generadora de mensajes</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>Soporte prioritario</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span>Sistema duplicable para tu equipo</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground">$29.00 USD</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Descuento piloto</span>
                      <span className="text-accent font-semibold">-$68.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-border/50">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">$29.00 USD</span>
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-primary mb-1">Garantía de 30 días</p>
                        <p className="text-primary/80">
                          Si no generas actividad en tu negocio MLM, no pagas mensualidad
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-accent flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-foreground">Activación Inmediata</h3>
                      <p className="text-sm text-muted-foreground">
                        Tu sistema estará listo en las próximas 24 horas. Recibirás un email con tus accesos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Payment Form */}
            <div className="lg:col-span-3">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20 text-destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={paymentData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, "");
                            const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                            setPaymentData({ ...paymentData, cardNumber: formatted });
                          }}
                          className="pl-4 pr-12 h-12 text-lg bg-background/50 border-border/50"
                          required
                          disabled={loading}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CreditCard className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        type="text"
                        placeholder="Juan Pérez"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        className="h-12 text-lg bg-background/50 border-border/50"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Vencimiento</Label>
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={paymentData.expiry}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const formatted = value.length >= 2 
                              ? `${value.slice(0, 2)}/${value.slice(2, 4)}` 
                              : value;
                            setPaymentData({ ...paymentData, expiry: formatted });
                          }}
                          className="h-12 text-lg bg-background/50 border-border/50"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={paymentData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setPaymentData({ ...paymentData, cvv: value });
                          }}
                          className="h-12 text-lg bg-background/50 border-border/50"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="bg-background/30 rounded-lg p-4 flex items-start gap-3 border border-border/50">
                      <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Pago 100% seguro</p>
                        <p>
                          Tu información está protegida con encriptación SSL de 256 bits
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-primary/20"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Procesando pago...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Pagar $29 USD de forma segura
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Al completar tu compra, aceptas los{" "}
                        <a href="#" className="text-primary hover:underline">términos de servicio</a>
                        {" "}y la{" "}
                        <a href="#" className="text-primary hover:underline">política de privacidad</a>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Pricing Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">$29 <span className="text-xl font-normal text-gray-500">USD inicio</span></div>
                  <p className="text-lg font-medium text-gray-700 mt-4">Elige tu plan</p>
                </div>

                {/* Plan Cards */}
                <div className="space-y-4 mb-6">
                  {/* Annual Plan - Preselected */}
                  <button
                    onClick={() => setSelectedPlan("annual")}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                      selectedPlan === "annual"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold px-2.5 py-1 bg-orange-500 text-white rounded-full">
                            Más elegido 🔥
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">$97 USD / año</div>
                        <div className="text-sm text-gray-600 mt-1">Ahorra vs plan mensual</div>
                        <div className="text-sm text-gray-500">≈ $0.27 USD al día</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                        selectedPlan === "annual" ? "border-primary bg-primary" : "border-gray-300"
                      }`}>
                        {selectedPlan === "annual" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
                      Pagas menos y te olvidas todo el año
                    </div>
                  </button>

                  {/* Monthly Plan */}
                  <button
                    onClick={() => setSelectedPlan("monthly")}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                      selectedPlan === "monthly"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-gray-900">$9 USD / mes</div>
                        <div className="text-sm text-gray-500 mt-1">≈ Menos de $1 USD al día</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                        selectedPlan === "monthly" ? "border-primary bg-primary" : "border-gray-300"
                      }`}>
                        {selectedPlan === "monthly" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
                      Flexibilidad • Cancela cuando quieras
                    </div>
                  </button>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? "Procesando..." : "Activar mi sistema ahora →"}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Acceso inmediato • Empieza hoy • Sin complicaciones</span>
                </div>

                <div className="text-center mt-6 text-sm text-gray-500">
                  Sin riesgos. Cancela cuando quieras.<br />
                  No hay contratos ni letras pequeñas.
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">Métodos de pago aceptados:</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 text-sm font-medium text-foreground">
                    💳 Visa
                  </div>
                  <div className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 text-sm font-medium text-foreground">
                    💳 Mastercard
                  </div>
                  <div className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 text-sm font-medium text-foreground">
                    💳 American Express
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}