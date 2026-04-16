import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Wallet, Shield, Globe, TrendingUp, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { discountService } from "@/services/discountService";
import { Input } from "@/components/ui/input";

export default function Pricing() {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"initial" | "renewal">("initial");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ percentage: number; code: string } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  
  // Your BSC wallet address to receive USDT payments
  const usdtBscAddress = "TU_WALLET_BSC_AQUI";

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

  const handleConnectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts"
        });
        setWalletAddress(accounts[0]);
        setShowCheckout(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Error al conectar wallet. Por favor intenta de nuevo.");
      }
    } else {
      alert("Por favor instala MetaMask para continuar");
      window.open("https://metamask.io/download/", "_blank");
    }
  };

  const handlePaymentConfirmed = () => {
    router.push("/admin");
  };

  return (
    <>
      <SEO 
        title="Membresía Viaja Ligero - Sistema de Embudo de Ventas" 
        description="Accede al sistema completo de embudo de ventas para embajadores de Viaja Ligero. $79 USD inicial + $10 USD/mes en USDT."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Viaja Ligero</h1>
            <Button variant="outline" asChild>
              <a href="/">Volver al inicio</a>
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

        {/* Pricing Card */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 border-2 border-primary/20 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Price & CTA */}
                <div className="space-y-6">
                  {/* Pricing Structure */}
                  <div className="space-y-4">
                    <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Pago Inicial</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-primary">$79</span>
                        <span className="text-2xl text-muted-foreground">USD</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Una sola vez - Acceso completo</p>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-muted-foreground font-medium">+</span>
                    </div>

                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Membresía Mensual</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">$10</span>
                        <span className="text-xl text-muted-foreground">USD/mes</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Renovación automática</p>
                    </div>
                  </div>

                  <div className="bg-secondary/10 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium">💰 Total primer mes: <span className="text-xl font-bold text-primary">$89 USD</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Luego solo $10 USD mensuales</p>
                  </div>

                  {!showCheckout ? (
                    <div className="space-y-4">
                      {/* Discount Code Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">¿Tienes un código de descuento?</label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Ingresa tu código"
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
                        onClick={handleConnectWallet}
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        Conectar Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Envía {finalPrice} USDT (BEP20) a:
                        </p>
                        <code className="text-xs break-all bg-background p-2 rounded block">
                          {usdtBscAddress}
                        </code>
                        {appliedDiscount && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              ✓ Descuento {appliedDiscount.percentage}% aplicado
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ahorro: ${(currentPrice - finalPrice).toFixed(2)} USDT
                            </p>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={handlePaymentConfirmed}
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Ya realicé el pago
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    Pagos con USDT en Binance Smart Chain (BEP20)
                  </p>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-4 pt-4">
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
                      <p className="font-medium">Soporte técnico incluido</p>
                      <p className="text-sm text-muted-foreground">Ayuda para configurar y optimizar tu embudo</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm font-medium text-center">
                      🎯 <strong>ROI Inmediato:</strong> Recupera tu inversión con solo 8-9 leads convertidos
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* FAQ Section */}
            <div className="mt-12 space-y-4">
              <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
              
              <Card className="p-6">
                <h4 className="font-semibold mb-2">¿Por qué un pago inicial + mensualidad?</h4>
                <p className="text-sm text-muted-foreground">
                  El pago inicial de $79 USD cubre el setup completo de tu sistema (configuración de base de datos, personalización, integración). La mensualidad de $10 USD mantiene el servidor, almacenamiento y actualizaciones continuas.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-2">¿Qué pasa si no renuevo la mensualidad?</h4>
                <p className="text-sm text-muted-foreground">
                  Tu acceso al panel se suspende temporalmente. Tus datos se mantienen seguros por 90 días. Al renovar, recuperas acceso completo inmediatamente.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-2">¿Cómo funciona el pago con USDT?</h4>
                <p className="text-sm text-muted-foreground">
                  1) Conecta tu wallet de MetaMask, 2) Envía USDT (BEP20) a nuestra dirección BSC, 3) Confirma el pago, 4) Acceso instantáneo en menos de 5 minutos.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}