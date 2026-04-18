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
    // Verify that we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Link de recuperación inválido o expirado. Solicita uno nuevo.");
        setValidatingToken(false);
        return;
      }
      
      setValidatingToken(false);
    };

    checkSession();
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess("¡Contraseña actualizada exitosamente!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "Error al actualizar la contraseña. Intenta de nuevo.");
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="text-center">
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
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/mountain-lake-boats.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-green-500/20" />
        </div>

        {/* Reset Password Card */}
        <Card className="relative w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-6 pb-4">
            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold tracking-wider">
                V<span className="text-2xl">_</span>
              </div>
              <div className="space-y-0">
                <div className="text-lg font-semibold tracking-widest">VIAJA LIGERO</div>
                <div className="text-xs text-muted-foreground tracking-wider">VIVE MÁS CON MENOS</div>
              </div>
            </div>
            
            {/* Title */}
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
            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            
            {/* Success Alert */}
            {success && (
              <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-lg text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
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
                    disabled={loading}
                    className="pl-10 pr-10 bg-background border-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
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
                    disabled={loading}
                    className="pl-10 pr-10 bg-background border-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg" 
                disabled={loading}
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

              {/* Back to Login */}
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