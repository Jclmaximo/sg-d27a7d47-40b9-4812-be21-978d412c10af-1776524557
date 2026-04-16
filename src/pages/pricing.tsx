import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Shield, Globe, TrendingUp, Loader2, QrCode, Copy, ExternalLink } from "lucide-react";
import { discountService } from "@/services/discountService";
import { disruptiveService } from "@/services/disruptiveService";
import { supabase } from "@/integrations/supabase/client";

export default function Pricing() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"initial" | "renewal">("initial");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ percentage: number; code: string } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  
  // Payment state
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    paymentId: string;
    address: string;
    amount: number;
    qrCode?: string;
    expiresAt?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const initialPrice = 79;
  const renewalPrice = 10;

  const currentPrice = selectedPlan === "initial" ? initialPrice : renewalPrice;
  const finalPrice = appliedDiscount 
    ? discountService.calculateDiscountedPrice(currentPrice, appliedDiscount.percentage)
    : currentPrice;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsValidatingCode(true);
    setDiscountError("");

    const result = await discountService.validateDiscountCode(discountCode);

    if (result.valid && result.discount) {
      setAppliedDiscount({
        percentage: result.discount.discount_percentage,
        code: result.discount.code
      });
      setDiscountError("");
    } else {
      setAppliedDiscount(null);
      setDiscountError(result.error || "Código inválido");
    }

    setIsValidatingCode(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const handleCreatePayment = async () => {
    setIsProcessingPayment(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to admin login page with return URL
        alert("Debes iniciar sesión o crear una cuenta primero para continuar con el pago.");
        router.push(`/admin?redirect=/pricing`);
        setIsProcessingPayment(false);
        return;
      }

      // Generate order ID
      const orderId = `VL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Get webhook URL
      const webhookUrl = `${window.location.origin}/api/webhooks/disruptive`;

      // Create payment with Disruptive
      const payment = await disruptiveService.createPayment({
        amount: finalPrice,
        currency: "USDT",
        network: "BSC",
        orderId: orderId,
        description: `Viaja Ligero - ${selectedPlan === "initial" ? "Membresía Inicial" : "Renovación Mensual"}`,
        customerEmail: user.email,
        webhookUrl: webhookUrl
      });

      if (payment.success) {
        // Save payment record
        await disruptiveService.savePaymentRecord({
          userId: user.id,
          paymentId: payment.paymentId,
          amount: finalPrice,
          currency: "USDT",
          network: "BSC",
          status: "pending",
          discountCode: appliedDiscount?.code
        });

        // Show checkout
        setPaymentData({
          paymentId: payment.paymentId,
          address: payment.address || "",
          amount: payment.amount,
          qrCode: payment.qrCode,
          expiresAt: payment.expiresAt
        });
        setShowCheckout(true);

        // Start polling payment status
        pollPaymentStatus(payment.paymentId);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Error al crear el pago. Por favor intenta de nuevo.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 60; // 5 minutes (5 seconds * 60)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const status = await disruptiveService.getPaymentStatus(paymentId);

        if (status.status === "completed") {
          // Payment confirmed! Redirect to dashboard
          alert("¡Pago confirmado! Redirigiendo a tu panel...");
          router.push("/admin/dashboard");
          return;
        }

        if (status.status === "failed" || status.status === "expired") {
          alert("El pago falló o expiró. Por favor intenta de nuevo.");
          setShowCheckout(false);
          setPaymentData(null);
          return;
        }

        // Continue polling if still pending
        if (attempts < maxAttempts && status.status === "pending") {
          attempts++;
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    };

    checkStatus();
  };

  const copyAddress = () => {
    if (paymentData?.address) {
      navigator.clipboard.writeText(paymentData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <SEO 
        title="Membresía Viaja Ligero - Sistema de Embudo de Ventas" 
        description="Accede al sistema completo de embudo de ventas para embajadores de Viaja Ligero. Desde $39.50 USD con descuentos disponibles."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Viaja Ligero</h1>
            <Button variant="outline" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Sistema Premium para Embajadores
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Impulsa tu negocio con <span className="text-primary">Viaja Ligero</span>
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Accede al sistema completo de embudo de ventas, gestión de leads y herramientas de conversión diseñadas para embajadores de Viaja Ligero
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Initial Payment Card */}
              <Card 
                className={`p-6 cursor-pointer transition-all border-2 ${
                  selectedPlan === "initial" 
                    ? "border-primary shadow-lg scale-105" 
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan("initial")}
              >
                <Badge className="mb-4 bg-secondary">MEJOR VALOR</Badge>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Pago Inicial</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$79</span>
                    <span className="text-muted-foreground">USD una vez</span>
                  </div>
                  <p className="text-sm text-muted-foreground">30 días de acceso completo</p>
                </div>
              </Card>

              {/* Renewal Card */}
              <Card 
                className={`p-6 cursor-pointer transition-all border-2 ${
                  selectedPlan === "renewal" 
                    ? "border-primary shadow-lg scale-105" 
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan("renewal")}
              >
                <Badge variant="outline" className="mb-4">PARA RENOVACIÓN</Badge>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Mensualidad</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$10</span>
                    <span className="text-muted-foreground">USD/mes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Renovación cada 30 días</p>
                </div>
              </Card>
            </div>

            {/* Main Checkout Card */}
            <Card className="p-8 md:p-12 border-2 border-primary/20 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Payment */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      {selectedPlan === "initial" ? "Membresía Inicial" : "Renovación Mensual"}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">${currentPrice}</span>
                      <span className="text-2xl text-muted-foreground">USDT</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Pago con USDT en Binance Smart Chain (BSC)</p>
                  </div>

                  {!showCheckout ? (
                    <div className="space-y-4">
                      {/* Discount Code Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">¿Tienes un código de descuento?</label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Ingresa tu código (ej: VL50)"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            disabled={!!appliedDiscount}
                            className="flex-1"
                          />
                          {appliedDiscount ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleRemoveDiscount}
                            >
                              Quitar
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={handleApplyDiscount}
                              disabled={isValidatingCode || !discountCode.trim()}
                            >
                              {isValidatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
                            </Button>
                          )}
                        </div>
                        {discountError && (
                          <p className="text-sm text-destructive">{discountError}</p>
                        )}
                        {appliedDiscount && (
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>¡Descuento del {appliedDiscount.percentage}% aplicado! ({appliedDiscount.code})</span>
                          </div>
                        )}
                      </div>

                      {/* Price Summary */}
                      {appliedDiscount && (
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Precio original:</span>
                            <span className="line-through">${currentPrice} USDT</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                            <span>Descuento ({appliedDiscount.percentage}%):</span>
                            <span>-${(currentPrice - finalPrice).toFixed(2)} USDT</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total a pagar:</span>
                            <span className="text-primary">${finalPrice} USDT</span>
                          </div>
                        </div>
                      )}

                      <Button 
                        size="lg" 
                        className="w-full text-lg py-6"
                        onClick={handleCreatePayment}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creando pago...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Proceder al pago
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-6 bg-muted rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Envía exactamente:</h3>
                          <Badge className="text-lg px-3 py-1">${finalPrice} USDT</Badge>
                        </div>

                        {paymentData?.qrCode && (
                          <div className="flex justify-center">
                            <img src={paymentData.qrCode} alt="QR Code" className="w-48 h-48" />
                          </div>
                        )}

                        <div>
                          <label className="text-sm text-muted-foreground block mb-2">
                            Dirección de pago (BSC):
                          </label>
                          <div className="flex gap-2">
                            <code className="flex-1 text-xs break-all bg-background p-3 rounded border">
                              {paymentData?.address}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={copyAddress}
                            >
                              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        {appliedDiscount && (
                          <div className="pt-3 border-t">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              ✓ Descuento {appliedDiscount.percentage}% aplicado ({appliedDiscount.code})
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ahorro: ${(currentPrice - finalPrice).toFixed(2)} USDT
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Esperando confirmación del pago...</span>
                        </div>
                      </div>

                      <p className="text-xs text-center text-muted-foreground">
                        El pago se confirmará automáticamente. No cierres esta ventana.
                      </p>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Pago seguro</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Sin fronteras</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>Crece tu negocio</span>
                    </div>
                  </div>
                </div>

                {/* Right: Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Todo lo que incluye:</h3>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Embudo de ventas completo</p>
                      <p className="text-sm text-muted-foreground">Landing page optimizada para conversión</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Panel de gestión de leads</p>
                      <p className="text-sm text-muted-foreground">Organiza y da seguimiento a todos tus prospectos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Mensajes automáticos WhatsApp</p>
                      <p className="text-sm text-muted-foreground">5 templates profesionales listos para usar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Sistema de notas por lead</p>
                      <p className="text-sm text-muted-foreground">Registra conversaciones y seguimiento detallado</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">WhatsApp personalizado</p>
                      <p className="text-sm text-muted-foreground">Configura tu propio número de contacto</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Dashboard con métricas</p>
                      <p className="text-sm text-muted-foreground">Visualiza el estado de todos tus leads</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Soporte incluido</p>
                      <p className="text-sm text-muted-foreground">Asistencia técnica vía WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Available Discount Codes */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">Códigos de descuento disponibles:</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-sm">VL50 - 50% OFF</Badge>
                <Badge variant="outline" className="text-sm">VL40 - 40% OFF</Badge>
                <Badge variant="outline" className="text-sm">VL30 - 30% OFF</Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}