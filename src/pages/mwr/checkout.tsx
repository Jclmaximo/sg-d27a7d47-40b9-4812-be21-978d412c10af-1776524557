import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, DollarSign, Tag, Calendar, Lock } from "lucide-react";
import { mwrLeadsService } from "@/services/mwrLeadsService";
import { SEO } from "@/components/SEO";

export default function MWRCheckout() {
  const router = useRouter();
  const { ref } = router.query;
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const leadData = sessionStorage.getItem("mwr_lead_data");
      if (!leadData) {
        router.push("/mwr");
        return;
      }

      const parsedData = JSON.parse(leadData);
      
      await mwrLeadsService.createLead({
        ...parsedData,
        status: "checkout",
        selected_plan: selectedPlan,
      });

      sessionStorage.removeItem("mwr_lead_data");
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push("/gracias");
      }, 2000);
    } catch (error) {
      console.error("Error creating lead:", error);
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-600">Redirigiendo al pago...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Checkout - MWR Sistema de Referidos"
        description="Activa tu sistema de referidos automatizado"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Este sistema es <span className="text-primary">para ti</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Te ayuda a conseguir prospectos, dar seguimiento automático y avanzar más rápido sin complicarte
            </p>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1 md:mb-2">$29 <span className="text-lg md:text-xl font-normal text-gray-500">USD inicio</span></div>
              <p className="text-base md:text-lg font-medium text-gray-700 mt-2 md:mt-4">Elige tu plan</p>
            </div>

            {/* Plan Cards */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              {/* Annual Plan - Preselected */}
              <button
                onClick={() => setSelectedPlan("annual")}
                className={`w-full text-left p-4 md:p-6 rounded-xl border-2 transition-all ${
                  selectedPlan === "annual"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                      <span className="text-[10px] md:text-xs font-semibold px-2 md:px-2.5 py-0.5 md:py-1 bg-blue-600 text-white rounded-full whitespace-nowrap">
                        MÁS ELEGIDO 🔥
                      </span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">$97 USD / año</div>
                    <div className="text-xs md:text-sm text-green-600 font-medium mt-0.5 md:mt-1">Ahorra $1 vs plan mensual (2 meses gratis)</div>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                      <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                      <span>≈ $0.27 USD al día</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Monthly Plan */}
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`w-full text-left p-4 md:p-6 rounded-xl border-2 transition-all ${
                  selectedPlan === "monthly"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div className="flex-1">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">$9 USD / mes</div>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                      <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                      <span>≈ Menos de $1 USD al día</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 md:py-6 text-base md:text-lg rounded-xl shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Procesando..." : "Activar mi sistema ahora →"}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              <span>Acceso inmediato • Empieza hoy • Sin complicaciones</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-center mt-4 md:mt-6 text-xs md:text-sm text-gray-500">
              <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <div>
                <strong>Sin riesgos.</strong> Cancela cuando quieras.<br />
                No hay contratos ni letras pequeñas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}