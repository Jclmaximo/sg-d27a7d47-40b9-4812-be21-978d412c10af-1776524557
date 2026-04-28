import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { leadsService } from "@/services/leadsService";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [referrerAvatar, setReferrerAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // NUEVOS ESTADOS - Registro por pasos
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [countryCode, setCountryCode] = useState("+52"); // México por default
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Lista de países con códigos
  const countries = [
    { code: "+52", name: "México", flag: "🇲🇽" },
    { code: "+1", name: "USA/Canadá", flag: "🇺🇸" },
    { code: "+57", name: "Colombia", flag: "🇨🇴" },
    { code: "+51", name: "Perú", flag: "🇵🇪" },
    { code: "+56", name: "Chile", flag: "🇨🇱" },
    { code: "+54", name: "Argentina", flag: "🇦🇷" },
    { code: "+34", name: "España", flag: "🇪🇸" },
    { code: "+507", name: "Panamá", flag: "🇵🇦" },
    { code: "+506", name: "Costa Rica", flag: "🇨🇷" },
    { code: "+593", name: "Ecuador", flag: "🇪🇨" },
    { code: "+58", name: "Venezuela", flag: "🇻🇪" },
    { code: "+55", name: "Brasil", flag: "🇧🇷" },
  ];

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
        const savedAvatar = localStorage.getItem("referrer_avatar");
        
        if (savedName && savedId) {
          setReferrerName(savedName);
          setReferrerId(savedId);
          if (savedAvatar) setReferrerAvatar(savedAvatar);
          return;
        }

        // Si no está en localStorage, buscar en la base de datos
        const refString = Array.isArray(ref) ? ref[0] : ref;
        
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, username, avatar_url")
          .eq("username", refString)
          .single();

        if (data) {
          // Usar full_name si existe, sino formatear el username
          const displayName = data.full_name 
            ? formatReferrerName(data.full_name)
            : formatReferrerName(data.username);
          
          setReferrerName(displayName);
          setReferrerId(data.id);
          
          // Guardar avatar si existe
          if (data.avatar_url) {
            setReferrerAvatar(data.avatar_url);
            localStorage.setItem("referrer_avatar", data.avatar_url);
          }
          
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
        const savedAvatar = localStorage.getItem("referrer_avatar");
        if (savedName) {
          setReferrerName(savedName);
          if (savedAvatar) setReferrerAvatar(savedAvatar);
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

  // PASO 7: Auto-redirect a /reto después de 2 segundos
  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => {
        router.push("/reto");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [step, router]);

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
      // Combinar código de país + número de WhatsApp
      const fullWhatsApp = `${countryCode}${whatsapp}`;

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            username: username,
            phone: fullWhatsApp,
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
            whatsapp_number: fullWhatsApp,
            referred_by: referrerId || null,
          })
          .eq("id", authData.user.id);

        // Crear lead asociado al referente
        if (referrerId) {
          await leadsService.createLead({
            name: fullName,
            email: email,
            phone: fullWhatsApp,
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
    router.push("/reto");
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
        {/* PASO 1: Pre-loader con mensaje personalizado */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-opacity duration-700 ease-out
            ${step === 1 ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <div className="flex flex-col items-center gap-8 max-w-md w-full">
            {/* Ícono de Rayo */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#3367D6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg
                  className="w-10 h-10 text-white animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>
              </div>
              {/* Anillo animado */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#4285F4] animate-ping opacity-20" />
            </div>

            {/* Mensaje de bienvenida */}
            <div className="text-center space-y-2">
              <p className="text-sm font-light text-gray-400 tracking-wide uppercase">
                Invitación exclusiva
              </p>
              <h1 className="text-2xl sm:text-3xl text-[#1D1D1F] font-light leading-relaxed">
                Sincronizando invitación de
                <br />
                <span className="font-normal text-[#4285F4]">
                  {referrerName || "tu mentor"}
                </span>
              </h1>
            </div>

            {/* Barra de progreso elegante */}
            <div className="w-full space-y-2">
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4285F4] to-[#3367D6] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center font-light">
                Preparando experiencia personalizada...
              </p>
            </div>
          </div>
        </div>

        {/* PASO 2: Pantalla de invitación personalizada */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center px-6
            transition-all duration-700 ease-out
            ${step === 2 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          `}
        >
          <div className="flex flex-col items-center gap-8 max-w-lg w-full">
            {/* Avatar del mentor */}
            <div className="relative">
              <Avatar className="w-28 h-28 shadow-xl shadow-gray-200/50 ring-4 ring-white">
                <AvatarImage src={referrerAvatar} alt={referrerName} />
                <AvatarFallback className="bg-gradient-to-br from-gray-50 to-gray-100 text-5xl font-light text-gray-600">
                  {referrerName?.[0]?.toUpperCase() || "M"}
                </AvatarFallback>
              </Avatar>
              {/* Badge de verificación */}
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-[#4285F4] to-[#3367D6] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Badge de invitación exclusiva */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
              <span className="text-xs font-medium text-[#4285F4] tracking-wide uppercase">
                Invitación Exclusiva
              </span>
            </div>

            {/* Mensaje principal con jerarquía mejorada */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-light text-[#1D1D1F] leading-tight">
                Has sido seleccionado por{" "}
                <span className="font-normal bg-gradient-to-r from-[#4285F4] to-[#3367D6] bg-clip-text text-transparent">
                  {referrerName || "un mentor"}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-light text-gray-600">
                para el Reto de Productividad de 24 Horas
              </p>
            </div>

            {/* Micro-copy explicativo */}
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg shadow-gray-200/30 border border-gray-100">
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  24 horas que pueden transformar tu productividad.
                  <br />
                  <span className="text-gray-500">
                    Un desafío diseñado para ejecutores comprometidos con resultados reales.
                  </span>
                </p>
              </div>
            </div>

            {/* Pregunta de aceptación */}
            <p className="text-base text-gray-500 font-light">
              ¿Aceptas el desafío?
            </p>

            {/* CTA impactante con gradiente y glow */}
            <button
              onClick={() => setStep(3)}
              className="group relative w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-r from-[#4285F4] to-[#3367D6] px-8 py-4 text-white font-medium text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                Aceptar Desafío
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            {/* Texto de seguridad */}
            <p className="text-xs text-gray-400 text-center max-w-md leading-relaxed">
              Al aceptar, confirmas tu compromiso con el reto de 24 horas y recibirás las instrucciones por correo.
            </p>
          </div>
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

            <div className="space-y-3">
              {/* Selector de país */}
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-full border-b border-gray-200 border-t-0 border-x-0 rounded-none bg-transparent px-2 py-3 text-[17px] font-light focus:ring-0 focus:border-[#1D1D1F] transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="text-[15px] font-light">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{country.flag}</span>
                        <span>{country.code}</span>
                        <span className="text-gray-400">{country.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Campo de WhatsApp */}
              <div>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                  placeholder="234 567 8900"
                  className="w-full px-2 py-4 bg-transparent border-b border-gray-200 text-[17px] text-[#1D1D1F] font-light text-center focus:outline-none focus:border-[#1D1D1F] transition-all duration-300 placeholder:text-gray-300"
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                Solo números, sin código de país
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

          <div className="text-5xl md:text-7xl font-extralight text-gray-400 tracking-widest mb-12 font-mono">
            24:00:00
          </div>

          <p className="text-sm text-gray-400 font-light mb-8">
            El tiempo comienza ahora
          </p>

          <button
            onClick={() => router.push("/reto")}
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