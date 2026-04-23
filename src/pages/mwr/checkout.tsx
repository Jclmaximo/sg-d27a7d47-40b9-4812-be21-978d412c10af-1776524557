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

  useEffect(() => {
    if (!ref) {
      router.push("/mwr");
    }
  }, [ref, router]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
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
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Demo 11/11
            </div>
            <div className="inline-block px-6 py-3 bg-primary/10 border-2 border-primary rounded-2xl mb-6">
              <span className="text-primary font-semibold text-lg">Listo para ti</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Este sistema es <span className="text-primary">para ti</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Te ayuda a conseguir prospectos, dar seguimiento automático y avanzar más rápido sin complicarte
            </p>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                $29 <span className="text-xl font-normal text-gray-500">USD inicio</span>
              </div>
              <p className="text-lg font-medium text-gray-700 mt-4">Elige tu plan</p>
            </div>

            {/* Plan Cards */}
            <div className="space-y-4 mb-6">
              {/* Annual Plan - Preselected */}
              <button
                onClick={() => setSelectedPlan("annual")}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all relative ${
                  selectedPlan === "annual"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-6">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    MÁS ELEGIDO 🔥
                  </span>
                </div>

                <div className="flex items-start justify-between gap-6 mt-2">
                  {/* Left Column */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Radio Button */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selectedPlan === "annual" ? "border-primary" : "border-gray-300"
                    }`}>
                      {selectedPlan === "annual" && (
                        <div className="w-3.5 h-3.5 bg-primary rounded-full" />
                      )}
                    </div>

                    {/* Price & Details */}
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">$97 <span className="text-base font-normal text-gray-600">USD / año</span></div>
                      <div className="text-sm text-green-600 font-medium mb-2">
                        Ahorra $1 vs plan mensual (2 meses gratis)
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>≈ $0.27 USD al día</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="text-right">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mb-2">
                      <Tag className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Mejor valor</div>
                    <div className="text-xs text-gray-600">
                      Pagas menos y te<br />olvidas todo el año
                    </div>
                  </div>
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
                <div className="flex items-start justify-between gap-6">
                  {/* Left Column */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Radio Button */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selectedPlan === "monthly" ? "border-primary" : "border-gray-300"
                    }`}>
                      {selectedPlan === "monthly" && (
                        <div className="w-3.5 h-3.5 bg-primary rounded-full" />
                      )}
                    </div>

                    {/* Price & Details */}
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-3">$9 <span className="text-base font-normal text-gray-600">USD / mes</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>≈ Menos de $1 USD al día</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="text-right">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Flexibilidad</div>
                    <div className="text-xs text-gray-600">
                      Cancela cuando<br />quieras
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-7 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 mb-4"
            >
              {isSubmitting ? "Procesando..." : "Activar mi sistema ahora →"}
            </Button>

            {/* Benefits */}
            <div className="flex items-center justify-center gap-8 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Acceso inmediato</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Empieza hoy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Sin complicaciones</span>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="flex items-start gap-3 justify-center text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">Sin riesgos.</span> Cancela cuando quieras.<br />
                No hay contratos ni letras pequeñas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}