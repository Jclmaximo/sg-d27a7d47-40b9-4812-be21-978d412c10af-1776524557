import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Loader2, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight, Plane } from "lucide-react";

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
        const { data: authListenerData } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state change:", { event, session });
          
          if (!mounted) return;

          if (event === "PASSWORD_RECOVERY") {
            console.log("✅ Password recovery session detected");
            setValidatingToken(false);
            setError("");
          } else if (event === "SIGNED_IN" && session) {
            console.log("✅ User signed in, checking if recovery session");
            setValidatingToken(false);
            setError("");
          }
        });

        authListener = authListenerData;

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
      
      await supabase.auth.signOut();
      
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
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
          
          <Card className="relative bg-card/80 backdrop-blur-sm border-primary/30 shadow-2xl shadow-primary/20 p-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Validando link de recuperación...</p>
            </div>
          </Card>
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
      
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

        <Card className="relative w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/30 shadow-2xl shadow-primary/20">
          <CardHeader className="text-center space-y-6 pb-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary/30 shadow-xl shadow-primary/20">
                <Plane className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    VIAJA LIGERO
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground tracking-wider">VIVE MÁS CON MENOS</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Restablecer Contraseña
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Crea una nueva contraseña segura para tu cuenta
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-600 text-sm rounded-lg text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nueva Contraseña</label>
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
                    className="pl-10 pr-10 bg-background/60 border-primary/20 focus:border-primary/50"
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
                <label className="text-sm font-medium text-foreground">Confirmar Contraseña</label>
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
                    className="pl-10 pr-10 bg-background/60 border-primary/20 focus:border-primary/50"
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

              <div className="text-xs text-muted-foreground space-y-2 bg-muted/30 rounded-lg p-3 border border-border/30">
                <p className="font-medium text-foreground">Tu contraseña debe tener:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li className={password.length >= 6 ? "text-green-600 font-medium" : ""}>
                    Al menos 6 caracteres
                  </li>
                  <li className={password === confirmPassword && password !== "" ? "text-green-600 font-medium" : ""}>
                    Ambas contraseñas deben coincidir
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all" 
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

              <div className="text-center pt-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/admin")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-muted-foreground pt-2 border-t border-border/30">
              Vive más con menos.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}