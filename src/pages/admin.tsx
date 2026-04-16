import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Loader2, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { subscriptionService } from "@/services/subscriptionService";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleLogin() {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage("¡Sesión iniciada exitosamente!");
        
        // Try to check subscription, but don't block if it fails
        try {
          const hasActiveSubscription = await subscriptionService.hasActiveSubscription(data.user.id);
          
          if (hasActiveSubscription) {
            setTimeout(() => router.push("/admin/dashboard"), 1000);
          } else {
            setTimeout(() => router.push("/pricing"), 1000);
          }
        } catch (subError) {
          console.error("Error checking subscription:", subError);
          // If subscription check fails, default to pricing
          setTimeout(() => router.push("/pricing"), 1000);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");
        setTimeout(() => router.push("/pricing"), 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Error al crear cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
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
      <SEO title="Admin | Viaja Ligero" />
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

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mt-4 p-3 bg-green-500/10 text-green-600 text-sm rounded-md text-center">
                {successMessage}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@viajaligero.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña</label>
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
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