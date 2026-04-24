import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string;
  full_name: string;
}

export default function InvitaUnAmigo() {
  const router = useRouter();
  const { toast } = useToast();
  const { ref } = router.query;

  // Estados del flujo
  const [step, setStep] = useState(1);
  const [referrerName, setReferrerName] = useState("");
  const [referrerId, setReferrerId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // NUEVOS ESTADOS - Registro por pasos
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Función para formatear nombre del referente
  const formatReferrerName = (name: string): string => {
    if (!name) return "";
    
    // Reemplazar guiones bajos y guiones con espacios
    let cleaned = name.replace(/[_-]/g, " ");
    
    // Capitalizar cada palabra
    cleaned = cleaned
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    return cleaned;
  };

  // Cargar nombre del referente
  useEffect(() => {
    const fetchReferrer = async () => {
      if (ref) {
        // Primero intentar cargar desde localStorage
        const savedName = localStorage.getItem("referrer_name");
        const savedId = localStorage.getItem("referrer_id");
        
        if (savedName && savedId) {
          setReferrerName(savedName);
          setReferrerId(savedId);
          return;
        }

        // Si no está en localStorage, buscar en la base de datos
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, username")
          .eq("username", ref)
          .single();

        if (data) {
          // Usar full_name si existe, sino formatear el username
          const displayName = data.full_name 
            ? formatReferrerName(data.full_name)
            : formatReferrerName(data.username);
          
          setReferrerName(displayName);
          setReferrerId(data.id);
          
          // Guardar en localStorage para persistencia
          localStorage.setItem("referrer_name", displayName);
          localStorage.setItem("referrer_id", data.id);
        } else {
          // Si no se encuentra, intentar formatear el parámetro ref directamente
          const refString = Array.isArray(ref) ? ref[0] : ref;
          const formattedRef = formatReferrerName(refString as string);
          setReferrerName(formattedRef);
          localStorage.setItem("referrer_name", formattedRef);
        }
      } else {
        // Sin parámetro ref, verificar localStorage
        const savedName = localStorage.getItem("referrer_name");
        if (savedName) {
          setReferrerName(savedName);
          const savedId = localStorage.getItem("referrer_id");
          if (savedId) setReferrerId(savedId);
        }
      }
    };

    fetchReferrer();
  }, [ref]);

  // Limpiar datos de referente al salir (opcional - solo si quieres sesiones frescas)
  // useEffect(() => {
  //   return () => {
  //     localStorage.removeItem("referrer_name");
  //     localStorage.removeItem("referrer_id");
  //   };
  // }, []);

  // NUEVO - Verificar disponibilidad de username
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (error && error.code === "PGRST116") {
        // No encontrado = disponible
        setUsernameAvailable(true);
      } else if (data) {
        // Encontrado = ocupado
        setUsernameAvailable(false);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
    setCheckingUsername(false);
  };

  // Debounce para verificar username
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

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

  // PASO 4: Cronómetro countdown (Eliminado, usamos visual estático en paso 7)

  const handleAcceptChallenge = () => {
    setStep(3);
    setRegistrationProgress(33);
  };

  // PASO 3.1 - Identidad
  const handleIdentityNext = () => {
    if (!fullName.trim() || !username.trim()) return;
    setStep(4);
    setRegistrationProgress(66);
  };

  // PASO 3.2 - Contacto
  const handleContactNext = () => {
    if (!email.trim() || !email.includes("@") || !whatsapp.trim()) return;
    setStep(5);
    setRegistrationProgress(100);
  };

  // PASO 3.3 - Seguridad y Registro Final
  const handleFinishRegistration = async () => {
    if (!password || password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "Debe tener al menos 6 caracteres",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setStep(6); // Pantalla "Sincronizando Datos"

    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            username: username,
            phone: whatsapp,
          },
        },
      });

      if (authError) throw authError;

      // Actualizar perfil con username y datos adicionales
      if (authData.user) {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            username: username,
            whatsapp_number: whatsapp, // Corrección: la columna real en DB es whatsapp_number, no phone
            referred_by: referrerId || null,
          })
          .eq("id", authData.user.id);

        // Crear lead asociado al referente
        if (referrerId) {
          await leadsService.createLead({
            name: fullName,
            email: email,
            phone: whatsapp,
            country: "",
            source: "Invitación Reto 24h",
            user_id: referrerId,
          });
        }
      }

      // Auto-advance a paso final después de 1.5s
      setTimeout(() => {
        setLoading(false);
        setStep(7);
      }, 1500);
    } catch (error) {
      console.error("Error en registro:", error);
      setLoading(false);
      toast({
        title: "Error al crear cuenta",
        description: "Intenta con otro email o username",
        duration: 5000,
      });
      setStep(5); // Volver al paso de seguridad
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

      <style jsx global>{`
        body {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji", system-ui, -apple-system, BlinkMacSystemFont,
            sans-serif;
          font-weight: 300;
        }
      `}</style>

      {/* Barra de Progreso - Solo visible en pasos de registro (3, 4, 5) */}
      {(step === 3 || step === 4 || step === 5) && (
        <div className="fixed top-0 left-0 right-0 h-[1px] bg-gray-100 z-50">
          <div
            className="h-full bg-[#4285F4] transition-all duration-500 ease-out"
            style={{ width: `${registrationProgress}%` }}
          />
        </div>
      )}

      <div className="min-h-screen bg-white relative overflow-hidden">
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
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 2 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h1 className="text-2xl sm:text-3xl text-[#1D1D1F] font-light text-center max-w-2xl mb-6 leading-relaxed">
            Has sido seleccionado por{" "}
            <span className="font-normal">{referrerName || "un mentor"}</span>
            <br />
            para el Reto de Productividad de 24 Horas
          </h1>

          <p className="text-[17px] text-gray-500 font-light mb-12">
            ¿Aceptas el desafío?
          </p>

          <button
            onClick={handleAcceptChallenge}
            className="px-12 py-4 bg-[#4285F4] text-white rounded-full text-[15px] font-light tracking-wide hover:bg-[#3367D6] transition-all duration-300 shadow-sm flex items-center gap-2"
          >
            Aceptar Desafío
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* PASO 3: Identidad (Nombre + Username) */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 3 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h1 className="text-2xl text-[#1D1D1F] font-light text-center max-w-md mb-12">
            ¿Cómo te identificaremos en el ecosistema?
          </h1>

          <div className="w-full max-w-sm space-y-8">
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full px-2 py-4 bg-transparent border-b border-gray-200 text-[17px] text-[#1D1D1F] font-light text-center focus:outline-none focus:border-[#1D1D1F] transition-all duration-300 placeholder:text-gray-300"
              />
            </div>

            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                placeholder="Nombre de usuario"
                className="w-full px-2 py-4 bg-transparent border-b border-gray-200 text-[17px] text-[#1D1D1F] font-light text-center focus:outline-none focus:border-[#1D1D1F] transition-all duration-300 placeholder:text-gray-300"
              />
              <p className="text-xs text-gray-400 text-center mt-2">
                Sin espacios, todo en minúsculas
              </p>
              {username.length >= 3 && (
                <p className={`text-xs text-center mt-1 ${
                  checkingUsername ? "text-gray-400" :
                  usernameAvailable === true ? "text-green-600" :
                  usernameAvailable === false ? "text-red-600" : ""
                }`}>
                  {checkingUsername ? "Verificando..." :
                   usernameAvailable === true ? "✓ Disponible" :
                   usernameAvailable === false ? "✗ Este usuario ya existe" : ""}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleIdentityNext}
            disabled={!fullName.trim() || !username.trim() || usernameAvailable !== true}
            className={`
              mt-12 px-12 py-4 
              bg-[#4285F4] text-white 
              rounded-full text-[15px] font-light tracking-wide
              transition-all duration-300 shadow-sm
              flex items-center gap-2
              ${!fullName.trim() || !username.trim() || usernameAvailable !== true
                ? "opacity-30 cursor-not-allowed" 
                : "hover:bg-[#3367D6] opacity-100"
              }
            `}
          >
            Siguiente
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* PASO 4: Contacto (Email + WhatsApp) */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 4 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h1 className="text-2xl text-[#1D1D1F] font-light text-center max-w-md mb-12">
            ¿A dónde enviaremos tus alertas de leads?
          </h1>

          <div className="w-full max-w-sm space-y-8">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-2 py-4 bg-transparent border-b border-gray-200 text-[17px] text-[#1D1D1F] font-light text-center focus:outline-none focus:border-[#1D1D1F] transition-all duration-300 placeholder:text-gray-300"
              />
            </div>

            <div>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-2 py-4 bg-transparent border-b border-gray-200 text-[17px] text-[#1D1D1F] font-light text-center focus:outline-none focus:border-[#1D1D1F] transition-all duration-300 placeholder:text-gray-300"
              />
              <p className="text-xs text-gray-400 text-center mt-2">
                Incluye código de país
              </p>
            </div>
          </div>

          <button
            onClick={handleContactNext}
            disabled={!email.trim() || !email.includes("@") || !whatsapp.trim()}
            className={`
              mt-12 px-12 py-4 
              bg-[#4285F4] text-white 
              rounded-full text-[15px] font-light tracking-wide
              transition-all duration-300 shadow-sm
              flex items-center gap-2
              ${!email.trim() || !email.includes("@") || !whatsapp.trim()
                ? "opacity-30 cursor-not-allowed" 
                : "hover:bg-[#3367D6] opacity-100"
              }
            `}
          >
            Siguiente
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* PASO 5: Seguridad (Contraseña) */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 5 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h1 className="text-2xl text-[#1D1D1F] font-light text-center max-w-md mb-12">
            Crea tu acceso al Centro de Comando
          </h1>

          <div className="w-full max-w-sm">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña (mínimo 6 caracteres)"
                className="w-full px-2 py-4 bg-transparent border-b border-gray-200 text-[17px] text-[#1D1D1F] font-light text-center focus:outline-none focus:border-[#1D1D1F] transition-all duration-300 placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1D1D1F] transition-colors text-xs font-light"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Mínimo 6 caracteres
            </p>
          </div>

          <button
            onClick={handleFinishRegistration}
            disabled={!password || password.length < 6 || loading}
            className={`
              mt-12 px-12 py-4 
              bg-[#4285F4] text-white 
              rounded-full text-[15px] font-light tracking-wide
              transition-all duration-300 shadow-sm
              flex items-center gap-2
              ${!password || password.length < 6 || loading
                ? "opacity-30 cursor-not-allowed" 
                : "hover:bg-[#3367D6] opacity-100"
              }
            `}
          >
            {loading ? "Procesando..." : "Finalizar Registro"}
            {!loading && <ArrowRight className="w-4 h-4 stroke-[1.5]" />}
          </button>
        </div>

        {/* PASO 6: Sincronizando Datos */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 6 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h1 className="text-2xl text-[#1D1D1F] font-light mb-8 tracking-wide">
            Sincronizando datos...
          </h1>

          <div className="w-full max-w-xs h-[1px] bg-gray-100 overflow-hidden rounded-full">
            <div className="h-full bg-[#4285F4] animate-progress" />
          </div>
        </div>

        {/* PASO 7: Confirmación y Lanzamiento */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 7 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h1 className="text-2xl text-[#1D1D1F] font-light text-center max-w-md mb-4">
            Protocolo activado
          </h1>

          <p className="text-[17px] text-gray-500 font-light mb-12 text-center">
            Bienvenido al equipo de{" "}
            <span className="text-[#1D1D1F] font-normal">
              {referrerName || "Viaja Ligero"}
            </span>
          </p>

          <div className="text-7xl font-extralight text-gray-400 tracking-widest mb-12 font-mono">
            24:00:00
          </div>

          <p className="text-sm text-gray-400 font-light mb-8">
            El tiempo comienza ahora
          </p>

          <button
            onClick={() => router.push("/admin/welcome")}
            className="px-12 py-4 bg-[#4285F4] text-white rounded-full text-[15px] font-light tracking-wide hover:bg-[#3367D6] transition-all duration-300 shadow-sm flex items-center gap-2"
          >
            Entrar al Dashboard
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
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

        @keyframes progress {
          0% { 
            width: 0%; 
          }
          80% {
            width: 80%;
          }
          100% { 
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress 1.5s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>
    </>
  );
}