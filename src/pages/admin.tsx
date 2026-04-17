import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Loader2, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import { subscriptionService } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    checkExistingSession();
    
    // Save referrer from query params if present
    const { ref } = router.query;
    if (ref && typeof ref === "string") {
      localStorage.setItem("referrer", ref);
    }
  }, [router.query]);

  const checkExistingSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const hasActiveSub = await subscriptionService.hasActiveSubscription(user.id);
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, role")
        .eq("id", user.id)
        .single();
      
      if (profile?.role === "admin" || hasActiveSub) {
        if (!profile?.username) {
          router.push("/admin/onboarding");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        router.push("/pricing");
      }
    }
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleLogin() {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("🔐 Login attempt:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente"
      });

      router.push("/admin/main-dashboard");
    } catch (err: any) {
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
      console.log("🔐 Signup attempt:", { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("🔐 Signup response:", { data: !!data, error });

      if (error) {
        console.error("❌ Signup error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("✅ Signup successful, user:", data.user.id);
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");
        
        setTimeout(() => {
          console.log("🔄 Redirecting to pricing for new user");
          
          // Check if there's a redirect URL in query params
          const { redirect, ref } = router.query;
          
          if (redirect && typeof redirect === "string") {
            // Preserve referrer in URL if present
            const refParam = ref && typeof ref === "string" ? `?ref=${ref}` : "";
            router.push(`${redirect}${refParam}`);
            return;
          }
          
          // Default: redirect to pricing with ref if available
          const savedRef = localStorage.getItem("referrer");
          const refParam = savedRef ? `?ref=${savedRef}` : "";
          router.push(`/pricing${refParam}`);
        }, 1500);
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
      <SEO 
        title="Admin Login - Viaja Ligero"
        description="Accede a tu panel de administración"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src="/viaja-ligero-logo.png" 
                alt="Viaja Ligero" 
                className="h-16 w-auto"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede a tu panel de administración
              </CardDescription>
            </div>
          </CardHeader>

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