import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Loader2, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { subscriptionService } from "@/services/subscriptionService";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if user has active subscription
        try {
          const hasActiveSubscription = await subscriptionService.hasActiveSubscription(session.user.id);
          
          if (hasActiveSubscription) {
            // Only redirect to dashboard if they have an active subscription
            router.push("/admin/dashboard");
          }
          // If no subscription, stay on this page - let them see login/signup
        } catch (error) {
          console.error("Error checking subscription:", error);
          // If subscription check fails, stay on this page
        }
      }
      // If no session, stay on login/signup page
    } catch (error) {
      console.error("Error checking auth:", error);
      // If auth check fails, stay on this page
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError("Credenciales inválidas. Por favor verifica tu correo y contraseña.");
      setIsSubmitting(false);
    } else {
      // Check for redirect parameter
      const redirect = router.query.redirect as string;
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/admin/dashboard");
      }
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    // Validate password length
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/dashboard`
      }
    });

    if (error) {
      setError(error.message || "Error al crear la cuenta. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    } else if (data.user) {
      setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");
      
      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        const redirect = router.query.redirect as string;
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/admin/dashboard");
        }
      }, 1500);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin - Viaja Ligero"
        description="Acceso al panel de administración de Viaja Ligero"
      />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Viaja Ligero</h1>
            <p className="text-muted-foreground">Panel de Administración</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="w-4 h-4 mr-2" />
                Inicia Sesión
              </TabsTrigger>
              <TabsTrigger value="signup">
                <UserPlus className="w-4 h-4 mr-2" />
                Regístrate
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 6 caracteres
                  </p>
                </div>

                {error && (
                  <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 text-sm bg-green-500/10 text-green-600 rounded-md">
                    {successMessage}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}