import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Shield, Lock, Zap, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { disruptiveService } from "@/services/disruptiveService";
import { subscriptionService } from "@/services/subscriptionService";
import { referralService } from "@/services/referralService";
import { discountService } from "@/services/discountService";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<{ percentage: number; code: string } | null>(null);
  
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    address: string;
    amount: number;
    qrCode?: string;
  } | null>(null);

  const INITIAL_PRICE = 29.00;
  const finalPrice = discountApplied 
    ? disruptiveService.calculateDiscountedPrice(INITIAL_PRICE, discountApplied.percentage)
    : INITIAL_PRICE;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/reset-password");
    }
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de descuento",
        variant: "destructive"
      });
      return;
    }

    try {
      const discount = await discountService.validateDiscountCode(discountCode.trim());
      
      if (discount.valid && discount.discount) {
        setDiscountApplied({
          percentage: discount.discount.discount_percentage,
          code: discountCode.trim()
        });
        toast({
          title: "¡Código aplicado!",
          description: `Descuento del ${discount.discount.discount_percentage}% aplicado`,
        });
      } else {
        toast({
          title: "Código inválido",
          description: discount.error || "El código no existe o ya expiró",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo validar el código",
        variant: "destructive"
      });
    }
  };

  const createPayment = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/reset-password");
        return;
      }

      const payment = await disruptiveService.createPayment({
        amount: finalPrice,
        currency: "USDT",
        network: "BSC",
        description: "Viaja Ligero - Membresía Inicial (30 días)",
        metadata: {
          userId: session.user.id,
          type: "initial_subscription",
          discountCode: discountApplied?.code
        }
      });

      setPaymentData({
        paymentId: payment.paymentId,
        address: payment.address!,
        amount: finalPrice,
        qrCode: payment.qrCode
      });
      setPaymentCreated(true);

      toast({
        title: "Pago creado",
        description: "Envía USDT a la dirección mostrada",
      });

    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el pago",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData) return;

    setCheckingPayment(true);
    try {
      const status = await disruptiveService.getPaymentStatus(paymentData.address);
      
      if (status.fundStatus === "Complete" || status.amountCaptured >= paymentData.amount) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Create subscription
        const subscription = isRenewal 
          ? await subscriptionService.renewSubscription(
              session.user.id,
              verifiedPayment.hash,
              discountApplied?.code,
              discountApplied?.percentage,
              basePrice,
              finalPrice
            )
          : await subscriptionService.createInitialSubscription(
              session.user.id,
              verifiedPayment.hash,
              discountApplied?.code,
              discountApplied?.percentage,
              basePrice,
              finalPrice
            );

        console.log("Subscription created:", subscription);

        // COMISIONES DESACTIVADAS
        // No se generarán comisiones por ahora
        // Para reactivar, descomentar el siguiente código:
        
        // if (!isRenewal) {
        //   try {
        //     await referralService.createCommissionsForSubscription(
        //       session.user.id,
        //       finalPrice,
        //       subscription.id
        //     );
        //     console.log("Commissions created successfully");
        //   } catch (commError) {
        //     console.error("Error creating commissions:", commError);
        //   }
        // }

        toast({
          title: "¡Pago confirmado!",
          description: "Redirigiendo a tu dashboard...",
        });

        setTimeout(() => {
          router.push("/admin/welcome");
        }, 2000);
      } else {
        toast({
          title: "Pago pendiente",
          description: `Recibido: $${status.amountCaptured} de $${paymentData.amount}`,
        });
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      toast({
        title: "Error",
        description: "No se pudo verificar el pago",
        variant: "destructive"
      });
    } finally {
      setCheckingPayment(false);
    }
  };

  const copyAddress = () => {
    if (paymentData?.address) {
      navigator.clipboard.writeText(paymentData.address);
      toast({
        title: "Copiado",
        description: "Dirección copiada al portapapeles",
      });
    }
  };

  return (
    <>
      <SEO 
        title="Checkout - Viaja Ligero"
        description="Completa tu pago y accede a descuentos exclusivos en viajes"
      />

      <div className="min-h-screen bg-background text-foreground py-12 px-4 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/20 text-accent border border-accent/30 text-sm px-4 py-1">
              🎉 Último Paso
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-heading bg-clip-text text-transparent">
              Completa Tu Membresía
            </h1>
            <p className="text-xl text-muted-foreground">
              Únete a miles de viajeros inteligentes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start pb-3 border-b border-border/50">
                    <div>
                      <h3 className="font-semibold text-lg">Membresía Viaja Ligero</h3>
                      <p className="text-sm text-muted-foreground">Acceso completo 30 días</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${INITIAL_PRICE}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>Acceso a plataforma de viajes exclusiva</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>Descuentos hasta 70% en hoteles y vuelos</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>Programa Life Experiences®</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>Créditos de viaje por referidos</span>
                    </div>
                  </div>
                </div>

                {!discountApplied && (
                  <div className="pt-4 space-y-2">
                    <Label htmlFor="discount">Código de Descuento</Label>
                    <div className="flex gap-2">
                      <Input
                        id="discount"
                        placeholder="CODIGO"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="bg-background/50"
                      />
                      <Button onClick={applyDiscount} variant="outline">
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${INITIAL_PRICE.toFixed(2)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Descuento ({discountApplied.percentage}%)</span>
                      <span className="text-accent font-semibold">-${(INITIAL_PRICE - finalPrice).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-border/50">
                    <span>Total</span>
                    <span className="text-primary">${finalPrice.toFixed(2)} USDT</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Después de 30 días</p>
                      <p className="text-muted-foreground">
                        Solo $19 USD/mes para mantener tu membresía activa
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Pago con Crypto</CardTitle>
              </CardHeader>
              <CardContent>
                {!paymentCreated ? (
                  <div className="space-y-6">
                    <Alert className="bg-primary/10 border-primary/20">
                      <Shield className="w-4 h-4 text-primary" />
                      <AlertDescription className="text-sm">
                        Pago seguro con USDT en Binance Smart Chain (BSC)
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={createPayment}
                      disabled={loading}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generando pago...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Pagar ${finalPrice.toFixed(2)} USDT
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Alert className="bg-accent/10 border-accent/20">
                      <AlertCircle className="w-4 h-4 text-accent" />
                      <AlertDescription className="text-sm">
                        Envía exactamente <strong>${paymentData?.amount} USDT</strong> a la dirección mostrada
                      </AlertDescription>
                    </Alert>

                    {paymentData?.qrCode && (
                      <div className="flex justify-center">
                        <img src={paymentData.qrCode} alt="QR Code" className="w-48 h-48 rounded-lg border border-border" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Dirección de Pago (BSC)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={paymentData?.address || ""}
                          readOnly
                          className="bg-background/50 font-mono text-xs"
                        />
                        <Button onClick={copyAddress} variant="outline" size="icon">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Monto</Label>
                      <Input
                        value={`${paymentData?.amount} USDT`}
                        readOnly
                        className="bg-background/50 font-semibold"
                      />
                    </div>

                    <Alert className="bg-muted/30">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        Importante: Envía USDT en la red <strong>BSC (BEP20)</strong>. Otros tokens o redes no serán reconocidos.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={checkPaymentStatus}
                      disabled={checkingPayment}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      {checkingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verificando pago...
                        </>
                      ) : (
                        "Ya pagué - Verificar"
                      )}
                    </Button>

                    <div className="text-center">
                      <a 
                        href="https://www.binance.com/es/buy-sell-crypto" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        ¿No tienes USDT? Comprar aquí
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}