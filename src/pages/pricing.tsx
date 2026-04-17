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
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { subscriptionService } from "@/services/subscriptionService";
import { referralService } from "@/services/referralService";

export default function Pricing() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"initial" | "renewal">("initial");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ percentage: number; code: string } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [referrerUsername, setReferrerUsername] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthAndReferrer();
  }, [router.query]);

  const checkAuthAndReferrer = async () => {
    // Check for referral code in URL
    const { ref } = router.query;
    if (ref && typeof ref === "string") {
      setReferrerUsername(ref);
      localStorage.setItem("referrer", ref);
    } else {
      // Check localStorage for saved referrer
      const savedRef = localStorage.getItem("referrer");
      if (savedRef) {
        setReferrerUsername(savedRef);
      }
    }

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Not authenticated - redirect to registro with ref
      const refParam = ref && typeof ref === "string" ? `?ref=${ref}` : "";
      router.push(`/registro${refParam}`);
      return;
    }
    
    // User is authenticated, allow rendering
    setCheckingAuth(false);
  };

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

    try {
      // Try to validate with database first
      const result = await discountService.validateDiscountCode(discountCode);

      if (result.valid && result.discount) {
        setAppliedDiscount({
          percentage: result.discount.discount_percentage,
          code: result.discount.code
        });
        setDiscountError("");
      } else {
        // If database validation fails, check hardcoded codes as fallback
        const hardcodedDiscounts: Record<string, number> = {
          "VL50": 50,
          "VL40": 40,
          "VL30": 30
        };

        const discountPercentage = hardcodedDiscounts[discountCode.toUpperCase()];
        
        if (discountPercentage) {
          setAppliedDiscount({
            percentage: discountPercentage,
            code: discountCode.toUpperCase()
          });
          setDiscountError("");
        } else {
          setAppliedDiscount(null);
          setDiscountError(result.error || "Código inválido");
        }
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      setDiscountError("Error al validar código. Intenta de nuevo.");
    } finally {
      setIsValidatingCode(false);
    }
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

        // Payment status will be updated via webhook only
        // No polling needed - Disruptive doesn't support status queries by address
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Error al crear el pago. Por favor intenta de nuevo.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyAddress = () => {
    if (paymentData?.address) {
      navigator.clipboard.writeText(paymentData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkStatus = async () => {
    if (!paymentData) return;

    try {
      // Step 1: Check if payment is still in-processing
      const inProcessingAddresses = await disruptiveService.getPaymentsInProcessing("BSC");
      const isStillProcessing = inProcessingAddresses.includes(paymentData.address);

      console.log("🔍 Payment status:", {
        address: paymentData.address,
        stillInProcessing: isStillProcessing
      });

      // If payment is NO LONGER in processing list, it means it was processed
      if (!isStillProcessing) {
        console.log("✅ Payment no longer in processing - checking final status...");

        // Step 2: Get final status
        const status = await disruptiveService.getPaymentStatus(paymentData.address, "BSC");
        console.log("📦 Final payment status:", status);

        // Check if payment is funded (completed)
        if (status.fundStatus === "FUNDED" && status.amountCaptured > 0) {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Activate subscription directly (don't wait for webhook)
            const { data: subscription, error: subError } = await supabase
              .from("subscriptions")
              .select("id")
              .eq("user_id", user.id)
              .eq("status", "active")
              .maybeSingle();

            // If no active subscription, create one
            if (!subscription) {
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + 30);

              // Save referred_by if referrer exists
              if (referrerUsername) {
                const { data: referrerProfile } = await supabase
                  .from("profiles")
                  .select("id")
                  .eq("username", referrerUsername)
                  .single();

                if (referrerProfile) {
                  await supabase
                    .from("profiles")
                    .update({ referred_by: referrerProfile.id })
                    .eq("id", user.id);
                }
              }

              const { data: newSub, error: subError } = await supabase
                .from("subscriptions")
                .insert({
                  user_id: user.id,
                  status: "active",
                  price_usd: finalPrice,
                  start_date: startDate.toISOString(),
                  end_date: endDate.toISOString(),
                  transaction_hash: paymentData.paymentId,
                  discount_code_used: appliedDiscount?.code || null,
                  discount_percentage: appliedDiscount?.percentage || 0,
                  original_price: currentPrice,
                  final_price: finalPrice,
                  is_initial_payment: selectedPlan === "initial",
                  plan_type: "monthly"
                })
                .select()
                .single();

              if (subError) throw subError;

              // Create commissions for referrer(s)
              if (newSub) {
                await referralService.createCommissionsForSubscription(
                  user.id,
                  newSub.id,
                  finalPrice
                );
              }

              // Activate ambassador status
              await supabase
                .from("profiles")
                .update({ ambassador_active: true })
                .eq("id", user.id);

              console.log("✅ Subscription created, commissions generated, ambassador activated");
              
              // Clear referrer from localStorage
              localStorage.removeItem("referrer");
            }

            // Update payment status
            await supabase
              .from("payments")
              .update({ status: "completed" })
              .eq("payment_id", paymentData.paymentId);
          }

          toast({
            title: "¡Pago Confirmado!",
            description: "Tu suscripción está activa. Configurando tu cuenta..."
          });
          
          // Check if user has username configured
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .single();

          setTimeout(() => {
            setPaymentData(null);
            setShowCheckout(false);
            
            // Always redirect to welcome page after first payment
            toast({
              title: "¡Suscripción activa!",
              description: "Redirigiendo a tu dashboard...",
            });

            router.push("/admin/main-dashboard");
            return;
          }, 2000);
        } else if (status.fundStatus === "EXPIRED") {
          toast({
            title: "Pago Expirado",
            description: "El tiempo para completar el pago ha expirado. Por favor intenta de nuevo.",
            variant: "destructive"
          });
          setPaymentData(null);
          setShowCheckout(false);
        }
      } else {
        console.log("⏳ Payment still processing, checking again in 5 seconds...");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Poll payment status every 5 seconds
  React.useEffect(() => {
    if (!paymentData) return;

    // Check immediately
    checkStatus();

    // Then check every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentData]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Show loading screen while checking authentication
  if (checkingAuth) {
    return (
      <>
        <SEO 
          title="Membresía Viaja Ligero - Sistema de Embudo de Ventas" 
          description="Accede al sistema completo de embudo de ventas para embajadores de Viaja Ligero. Desde $39.50 USD con descuentos disponibles."
        />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Verificando acceso...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Membresía Viaja Ligero - Sistema de Embudo de Ventas" 
        description="Accede al sistema completo de embudo de ventas para embajadores de Viaja Ligero. Desde $39.50 USD con descuentos disponibles."
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/viaja-ligero-logo.png" 
                  alt="Viaja Ligero" 
                  className="h-8 md:h-10 w-auto"
                />
                <h1 className="text-xl md:text-2xl font-bold">Viaja Ligero</h1>
              </div>
              <Button variant="outline" onClick={() => router.push("/admin")}>
                Iniciar Sesión
              </Button>
            </div>
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