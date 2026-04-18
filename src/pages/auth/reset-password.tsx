import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Loader2, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authListener: any = null;

    const setupAuth = async () => {
      try {
        // Listen for auth state changes
        const { data: authListenerData } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state change:", { event, session });
          
          if (!mounted) return;

          if (event === 'PASSWORD_RECOVERY') {
            console.log("✅ Password recovery session detected");
            setValidatingToken(false);
            setError("");
          } else if (event === 'SIGNED_IN' && session) {
            console.log("✅ User signed in, checking if recovery session");
            setValidatingToken(false);
            setError("");
          }
        });

        authListener = authListenerData;

        // Also check current session after a short delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!mounted) return;

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Initial session check:", { session, sessionError });
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setError("Error al validar el link de recuperación. Por favor intenta de nuevo.");
            setValidatingToken(false);
          }
          return;
        }
        
        if (session?.user) {
          console.log("✅ Session found:", session.user.id);
          if (mounted) {
            setValidatingToken(false);
            setError("");
          }
        } else {
          console.warn("⚠️ No session found after 500ms");
          // Give it a bit more time before showing error
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (!mounted) return;
          
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          
          if (retrySession?.user) {
            console.log("✅ Session found on retry");
            setValidatingToken(false);
            setError("");
          } else {
            console.error("❌ No session found after retries");
            setError("Link de recuperación inválido o expirado. Solicita uno nuevo.");
            setValidatingToken(false);
          }
        }
      } catch (err) {
        console.error("Error in setupAuth:", err);
        if (mounted) {
          setError("Error al validar el link. Por favor intenta de nuevo.");
          setValidatingToken(false);
        }
      }
    };

    setupAuth();

    // Cleanup
    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validations
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting to update password...");
      
      // Verify we have a session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No hay sesión activa. Por favor solicita un nuevo link de recuperación.");
      }

      console.log("Session verified, updating password...");
      
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      console.log("Update result:", { data, updateError });

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      setSuccess("¡Contraseña actualizada exitosamente!");
      
      // Sign out to clear the recovery session
      await supabase.auth.signOut();
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      
      if (err.message?.includes("session") || err.message?.includes("sesión")) {
        setError(err.message || "Sesión expirada. Por favor solicita un nuevo link de recuperación.");
      } else {
        setError(err.message || "Error al actualizar la contraseña. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <>
        <SEO 
          title="Validando - Viaja Ligero"
          description="Validando link de recuperación"
        />
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/login-background.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20" />
          </div>
          <div className="relative text-center bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Validando link de recuperación...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Restablecer Contraseña - Viaja Ligero"
        description="Crea una nueva contraseña para tu cuenta"
      />
      
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/login-background.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20" />
        </div>

        <Card className="relative w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold tracking-wider">
                V<span className="text-2xl">_</span>
              </div>
              <div className="space-y-0">
                <div className="text-lg font-semibold tracking-widest">VIAJA LIGERO</div>
                <div className="text-xs text-muted-foreground tracking-wider">VIVE MÁS CON MENOS</div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-center gap-2">
                <KeyRound className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold">Restablecer Contraseña</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Crea una nueva contraseña segura para tu cuenta
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-lg text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading || !!error}
                    className="pl-10 pr-10 bg-background border-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading || !!error}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading || !!error}
                    className="pl-10 pr-10 bg-background border-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading || !!error}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Tu contraseña debe tener:</p>
                <ul className="list-disc list-inside space-y-0.5 pl-2">
                  <li className={password.length >= 6 ? "text-green-600" : ""}>
                    Al menos 6 caracteres
                  </li>
                  <li className={password === confirmPassword && password !== "" ? "text-green-600" : ""}>
                    Ambas contraseñas deben coincidir
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg" 
                disabled={loading || !!error}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando contraseña...
                  </>
                ) : (
                  <>
                    Actualizar Contraseña
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/admin")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Vive más con menos.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}