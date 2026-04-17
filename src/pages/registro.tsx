import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { Loader2, UserPlus, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [referrerUsername, setReferrerUsername] = useState<string | null>(null);

  useEffect(() => {
    checkExistingSession();
    
    // Get referrer from URL or localStorage
    const { ref } = router.query;
    if (ref && typeof ref === "string") {
      setReferrerUsername(ref);
      localStorage.setItem("referrer", ref);
    } else {
      const savedRef = localStorage.getItem("referrer");
      if (savedRef) {
        setReferrerUsername(savedRef);
      }
    }
  }, [router.query]);

  const checkExistingSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // User already logged in, redirect to pricing
      const savedRef = localStorage.getItem("referrer");
      const refParam = savedRef ? `?ref=${savedRef}` : "";
      router.push(`/pricing${refParam}`);
    }
  };

  // Check username availability in real-time
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // Validate format
      const usernameRegex = /^[a-z0-9-]+$/;
      if (!usernameRegex.test(username)) {
        setUsernameAvailable(false);
        return;
      }

      setCheckingUsername(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Error checking username:", error);
        setUsernameAvailable(null);
      } else {
        setUsernameAvailable(!data);
      }

      setCheckingUsername(false);
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!fullName.trim()) {
      setError("Por favor ingresa tu nombre completo");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (!whatsapp.trim()) {
      setError("Por favor ingresa tu número de WhatsApp");
      return;
    }

    if (username.length < 3) {
      setError("El username debe tener al menos 3 caracteres");
      return;
    }

    if (usernameAvailable === false) {
      setError("Este username no está disponible");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // 1. Create auth user with auto-confirm
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/pricing${referrerUsername ? `?ref=${referrerUsername}` : ""}`,
          data: {
            full_name: fullName,
            username: username.toLowerCase(),
            whatsapp_number: whatsapp,
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("No se pudo crear el usuario");

      console.log("✅ Auth user created:", data.user.id);

      // 2. Update profile with all data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username.toLowerCase(),
          whatsapp_number: whatsapp,
          ambassador_active: true,
        })
        .eq("id", data.user.id);

      if (profileError) throw profileError;

      console.log("✅ Profile updated with username and data");

      // 3. Save referrer if exists
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
            .eq("id", data.user.id);
          
          console.log("✅ Referrer saved:", referrerUsername);
        }
      }

      console.log("✅ Registration complete");
      
      setSuccess("¡Cuenta creada exitosamente! Redirigiendo al pago...");
      setError("");

      // Redirect to pricing with ref
      setTimeout(() => {
        const refParam = referrerUsername ? `?ref=${referrerUsername}` : "";
        router.push(`/pricing${refParam}`);
      }, 1500);
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      setError(err.message || "Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getUsernameStatus = () => {
    if (username.length < 3) return null;
    
    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="w-4 h-4" />
          Solo minúsculas, números y guiones
        </div>
      );
    }

    if (checkingUsername) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verificando...
        </div>
      );
    }

    if (usernameAvailable === true) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          ¡Disponible!
        </div>
      );
    }

    if (usernameAvailable === false) {
      return (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="w-4 h-4" />
          No disponible
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <SEO 
        title="Registro - Viaja Ligero"
        description="Crea tu cuenta y accede a viajes exclusivos con descuentos increíbles"
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="w-full max-w-lg shadow-xl border-2">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Únete a Viaja Ligero</CardTitle>
            <CardDescription className="text-base">
              Crea tu cuenta y comienza a disfrutar de viajes exclusivos
            </CardDescription>
            {referrerUsername && (
              <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <p className="text-sm text-muted-foreground">
                  Invitado por: <span className="font-semibold text-secondary">@{referrerUsername}</span>
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Incluye el código de país (ej: +52 para México)
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="juan-perez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  required
                  disabled={loading}
                />
                {getUsernameStatus()}
                <p className="text-xs text-muted-foreground">
                  Tu URL será: viajaligero.com/ambassador/<span className="font-medium">{username || "tu-username"}</span>
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || usernameAvailable === false}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear Cuenta
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() => router.push("/admin")}
                >
                  Inicia sesión aquí
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}