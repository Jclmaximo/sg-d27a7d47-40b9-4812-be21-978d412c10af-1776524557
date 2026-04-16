import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [walletAddress, setWalletAddress] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const monthlyPrice = 97; // USD
  const usdtBscAddress = "TU_WALLET_BSC_AQUI"; // Replace with your BSC wallet

  const features = [
    "Embudo de ventas completo personalizado",
    "Panel de administración de leads",
    "Sistema de notas por lead",
    "5 templates de mensajes automáticos",
    "Integración directa con WhatsApp",
    "Dashboard con estadísticas en tiempo real",
    "Captura ilimitada de leads",
    "Soporte técnico prioritario",
    "Actualizaciones automáticas",
    "Tu propio número de WhatsApp configurado"
  ];

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
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

  return (
    <>
      <SEO 
        title="Sistema de Embudo de Ventas - Travel Advantage"
        description="Obtén tu propio sistema de embudo de ventas para Travel Advantage con panel de administración y captura automática de leads"
      />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">
              Sistema Completo de Ventas
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tu Propio Sistema de Embudo de Ventas
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Convierte más prospectos en miembros de Travel Advantage con tu propio embudo automatizado y panel de administración profesional.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-primary/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Suscripción Mensual</h2>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold">${monthlyPrice}</span>
                  <span className="text-muted-foreground">USD/mes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pago con USDT en Binance Smart Chain (BSC)
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>

              {!showCheckout ? (
                <Button 
                  onClick={handleConnectWallet}
                  size="lg" 
                  className="w-full text-lg h-14"
                >
                  Conectar Wallet y Empezar
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-2">Wallet conectada:</p>
                    <p className="text-xs font-mono break-all">{walletAddress}</p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Envía ${monthlyPrice} USDT (BSC) a:</p>
                    <p className="text-xs font-mono break-all mb-4">{usdtBscAddress}</p>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Asegúrate de usar Binance Smart Chain (BEP20), no Ethereum
                    </p>
                  </div>

                  <Link href="/admin">
                    <Button size="lg" className="w-full">
                      Ya realicé el pago - Acceder al panel
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">
                    Después del pago, tu suscripción se activará automáticamente
                  </p>
                </div>
              )}
            </Card>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold mb-1">Pago Seguro</p>
                <p className="text-sm text-muted-foreground">Blockchain verificado</p>
              </div>
              <div>
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold mb-1">Sin Fronteras</p>
                <p className="text-sm text-muted-foreground">Acepta USDT global</p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold mb-1">Crece tu Negocio</p>
                <p className="text-sm text-muted-foreground">Leads ilimitados</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}