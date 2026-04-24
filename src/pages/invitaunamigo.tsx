import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string;
}

export default function InvitaUnAmigo() {
  const router = useRouter();
  const { ref } = router.query;

  // Estados del flujo
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [referrerName, setReferrerName] = useState("un mentor");
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("24:00:00");

  // Cargar nombre del referente
  useEffect(() => {
    if (ref && typeof ref === "string") {
      loadReferrer(ref);
    }
  }, [ref]);

  const loadReferrer = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .eq("username", username)
        .single();

      if (data && !error) {
        setReferrerName(data.full_name || username);
        setReferrerId(data.id);
      }
    } catch (error) {
      console.error("Error loading referrer:", error);
    }
  };

  // PASO 1: Barra de progreso auto-advance
  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(2), 300);
            return 100;
          }
          return prev + (100 / 15); // 1.5 segundos = 15 frames de 100ms
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step]);

  // PASO 4: Cronómetro countdown
  useEffect(() => {
    if (step === 4) {
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime.getTime() - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeRemaining("00:00:00");
          return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleAcceptChallenge = () => {
    setStep(3);
  };

  const handleActivateProtocol = async () => {
    if (!email || !email.includes("@")) {
      alert("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      // Guardar lead en base de datos asociado al referente
      if (referrerId) {
        await leadsService.createLead({
          name: email.split("@")[0], // Nombre temporal del email
          email: email,
          phone: "",
          country: "",
          source: "Invitación Reto 24h",
          interest: "reto-24h",
          contact_method: "email",
          user_id: referrerId,
        });
      }

      // Avanzar al paso 4
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 800);
    } catch (error) {
      console.error("Error saving lead:", error);
      setLoading(false);
      alert("Hubo un error. Por favor intenta de nuevo.");
    }
  };

  const handleEnterDashboard = () => {
    router.push("/admin/welcome");
  };

  return (
    <>
      <SEO
        title="Invitación Exclusiva - Reto de Productividad"
        description="Has sido seleccionado para el Reto de 24 Horas"
      />

      <div className="min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden">
        {/* PASO 1: Validación de Acceso */}
        {step === 1 && (
          <div className="w-full max-w-md text-center animate-fadeIn">
            <h1 className="text-2xl font-light text-[#1D1D1F] mb-12 tracking-wide">
              Sincronizando invitación de<br />
              <span className="font-normal">{referrerName}</span>
            </h1>

            {/* Barra de progreso */}
            <div className="w-full h-[1px] bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-[#6B7280] mt-8 font-light">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* PASO 2: El Desafío */}
        {step === 2 && (
          <div className="w-full max-w-lg text-center animate-fadeIn">
            <h1 className="text-3xl font-light text-[#1D1D1F] mb-6 leading-relaxed tracking-wide">
              Has sido seleccionado por<br />
              <span className="font-normal">{referrerName}</span>
            </h1>

            <p className="text-lg text-[#6B7280] font-light mb-12 leading-relaxed">
              Para el Reto de Productividad de 24 Horas
            </p>

            <p className="text-base text-[#1D1D1F] mb-12 font-light">
              ¿Aceptas el desafío?
            </p>

            <button
              onClick={handleAcceptChallenge}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#2563EB] text-white rounded-full font-light text-base hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105"
            >
              Aceptar Desafío
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* PASO 3: Registro de Intención */}
        {step === 3 && (
          <div className="w-full max-w-md text-center animate-fadeIn">
            <h2 className="text-2xl font-light text-[#1D1D1F] mb-12 tracking-wide">
              Introduce tu email para activar<br />
              tu Centro de Comando
            </h2>

            <div className="mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-6 py-4 text-center text-lg font-light bg-white border border-[#E5E7EB] rounded-2xl focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleActivateProtocol();
                  }
                }}
              />
            </div>

            <button
              onClick={handleActivateProtocol}
              disabled={loading}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#2563EB] text-white rounded-full font-light text-base hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Activando..." : "Activar Protocolo"}
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        )}

        {/* PASO 4: Confirmación y Lanzamiento */}
        {step === 4 && (
          <div className="w-full max-w-md text-center animate-fadeIn">
            <div className="mb-12">
              <div className="text-7xl font-extralight text-[#6B7280] mb-6 tracking-wider tabular-nums">
                {timeRemaining}
              </div>
            </div>

            <h2 className="text-2xl font-light text-[#1D1D1F] mb-4 tracking-wide">
              Protocolo activado
            </h2>

            <p className="text-base text-[#6B7280] font-light mb-12">
              El tiempo comienza ahora
            </p>

            <button
              onClick={handleEnterDashboard}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#2563EB] text-white rounded-full font-light text-base hover:bg-[#1D4ED8] transition-all duration-300 hover:scale-105"
            >
              Entrar al Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        /* Forzar font Inter light */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 300;
        }
      `}</style>
    </>
  );
}