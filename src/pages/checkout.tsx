import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { CheckCircle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalPrice, setFinalPrice] = useState(29);
  const [copied, setCopied] = useState(false);

  const CRYPTO_WALLET = "TQVu3v9PLL2KckXRJDW1fKJ7PHoNmi8rSr";

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/registro");
      return;
    }
    setUser(user);
    setLoading(false);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(CRYPTO_WALLET);
    setCopied(true);
    toast({
      title: "✅ Dirección copiada",
      description: "La dirección de la wallet ha sido copiada al portapapeles"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "vl2024") {
      setFinalPrice(19);
      setDiscountApplied(true);
      toast({
        title: "✅ Descuento aplicado",
        description: "¡Has ahorrado $10 USD!"
      });
    } else {
      toast({
        title: "❌ Código inválido",
        description: "El código ingresado no es válido",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Checkout - Activar Sistema"
        description="Completa tu pago y activa tu sistema de ventas"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 sm:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Último paso
            </h1>
            <p className="text-gray-600">
              Activa tu sistema y comienza a generar ventas hoy
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
            
            {/* Order Summary */}
            <div className="space-y-4">
              <p className="text-sm text-gray-500 uppercase tracking-wide">Resumen del pedido</p>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Sistema MWR</h2>
                    <p className="text-sm text-gray-600 mt-1">Acceso completo por 30 días</p>
                  </div>
                  <p className="text-3xl font-bold text-primary">${finalPrice}</p>
                </div>

                {discountApplied && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Descuento aplicado: -$10 USD</span>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {[
                  "Dashboard completo de gestión",
                  "Sistema de seguimiento automático",
                  "Plantillas de mensajes probadas",
                  "Soporte prioritario 24/7"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Code */}
            {!discountApplied && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Código de descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Ingresa tu código"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total a pagar</span>
                <span className="text-2xl font-bold text-primary">${finalPrice}.00 USDT</span>
              </div>
            </div>

            {/* After 30 Days */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Después de 30 días:</span> Solo $9 USD/mes. Cancela cuando quieras sin compromisos.
              </p>
            </div>

            {/* Crypto Payment */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">₮</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pago con USDT (TRC20)</p>
                  <p className="text-sm text-gray-600">Transferencia rápida y segura</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Dirección de la wallet
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={CRYPTO_WALLET}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900"
                    />
                    <button
                      onClick={handleCopyWallet}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <span className="font-semibold">Importante:</span> Envía exactamente ${finalPrice}.00 USDT a esta dirección. Tu cuenta se activará automáticamente al confirmar el pago.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                toast({
                  title: "✅ Sistema activado",
                  description: "Tu cuenta ha sido activada exitosamente"
                });
                setTimeout(() => router.push("/admin/main-dashboard"), 1500);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Activar mi sistema ahora
              <span>→</span>
            </button>

            {/* Trust Elements */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                🔒 Pago seguro • ⚡ Activación inmediata • 📱 Sin permanencia
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}