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
      router.push("/mwr/onboarding");
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

      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-600 text-white text-sm px-4 py-1">
              🎉 Último Paso
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Accede al Sistema Piloto
            </h1>
            <p className="text-xl text-muted-foreground">
              Únete a los distribuidores MLM que están creciendo su red automáticamente
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle>Tu Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start pb-3 border-b">
                      <div>
                        <h3 className="font-semibold text-lg">Sistema Piloto MLM</h3>
                        <p className="text-sm text-muted-foreground">Acceso completo 30 días</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$29</div>
                        <div className="text-xs text-muted-foreground line-through">$97</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Embudo de viajes personalizado</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>CRM con seguimiento automático</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>IA generadora de mensajes</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Soporte prioritario</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sistema duplicable para tu equipo</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">$29.00 USD</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Descuento piloto</span>
                      <span className="text-green-600 font-semibold">-$68.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                      <span>Total</span>
                      <span className="text-blue-600">$29.00 USD</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 mb-1">Garantía de 30 días</p>
                        <p className="text-blue-700">
                          Si no generas actividad en tu negocio MLM, no pagas mensualidad
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Activación Inmediata</h3>
                      <p className="text-sm text-slate-700">
                        Tu sistema estará listo en las próximas 24 horas. Recibirás un email con tus accesos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Payment Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6">
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
                          className="pl-4 pr-12 h-12 text-lg"
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
                        className="h-12 text-lg"
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
                          className="h-12 text-lg"
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
                          className="h-12 text-lg"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 flex items-start gap-3">
                      <Lock className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-600">
                        <p className="font-semibold mb-1">Pago 100% seguro</p>
                        <p>
                          Tu información está protegida con encriptación SSL de 256 bits
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg"
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
                        <a href="#" className="text-blue-600 hover:underline">términos de servicio</a>
                        {" "}y la{" "}
                        <a href="#" className="text-blue-600 hover:underline">política de privacidad</a>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">Métodos de pago aceptados:</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="px-4 py-2 bg-white rounded-lg border text-sm font-medium">
                    💳 Visa
                  </div>
                  <div className="px-4 py-2 bg-white rounded-lg border text-sm font-medium">
                    💳 Mastercard
                  </div>
                  <div className="px-4 py-2 bg-white rounded-lg border text-sm font-medium">
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