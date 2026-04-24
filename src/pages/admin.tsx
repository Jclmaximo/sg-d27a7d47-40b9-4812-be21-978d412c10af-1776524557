import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Plane } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (session) {
        router.push("/admin/welcome");
      }
    } catch (err) {
      console.error("Error checking session:", err);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, error } = await authService.signIn(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      // Redirect to home dashboard after successful login
      router.push("/admin/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: resetError } = await authService.resetPassword(email);

      if (resetError) {
        setError(resetError.message || "Error al enviar email de recuperación");
        setLoading(false);
        return;
      }

      setResetSent(true);
      setLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Error al enviar email de recuperación");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <>
        <SEO title="Cargando..." />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Admin - Viaja Ligero"
        description="Panel de administración"
      />

      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <Card className="relative w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Plane className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-heading bg-clip-text text-transparent">
                  Viaja Ligero
                </h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            
            <div>
              <CardTitle className="text-2xl">
                {resetMode ? "Recuperar Contraseña" : "Iniciar Sesión"}
              </CardTitle>
              <CardDescription>
                {resetMode 
                  ? "Te enviaremos un link para restablecer tu contraseña" 
                  : "Accede a tu panel de control"
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resetSent && (
              <Alert className="mb-6 bg-accent/10 border-accent/20 text-accent">
                <AlertDescription>
                  ✅ Email enviado. Revisa tu bandeja de entrada.
                </AlertDescription>
              </Alert>
            )}

            {!resetMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 bg-background/50 border-border/50 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 pr-10 bg-background/50 border-border/50 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setResetMode(true);
                      setError("");
                    }}
                    className="text-sm text-primary hover:underline"
                    disabled={loading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || resetSent}
                      className="pl-10 bg-background/50 border-border/50 h-12"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  disabled={loading || resetSent}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : resetSent ? (
                    "Email Enviado ✓"
                  ) : (
                    <>
                      Enviar Link de Recuperación
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setResetMode(false);
                      setResetSent(false);
                      setError("");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    disabled={loading}
                  >
                    ← Volver al login
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => router.push("/registro")}
                  className="text-primary hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}