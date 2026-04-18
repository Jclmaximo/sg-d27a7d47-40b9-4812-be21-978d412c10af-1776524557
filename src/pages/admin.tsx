import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogIn, UserPlus, Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { subscriptionService } from "@/services/subscriptionService";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    checkExistingSession();
    
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

  async function handleLogin() {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
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
      setError("Error al iniciar sesión. Verifica tus credenciales.");
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
        console.error("❌ Signup error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");
        
        setTimeout(() => {
          const { redirect, ref } = router.query;
          
          if (redirect && typeof redirect === "string") {
            const refParam = ref && typeof ref === "string" ? `?ref=${ref}` : "";
            router.push(`${redirect}${refParam}`);
            return;
          }
          
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

  if (loading && !error && !successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Iniciar Sesión - Viaja Ligero"
        description="Accede a tu panel de administración"
      />
      
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/mountain-lake-boats.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-green-500/20" />
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
              <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
              <p className="text-sm text-muted-foreground">
                Accede a tu panel de administración
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === "login"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Inicia Sesión
                {activeTab === "login" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === "signup"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Regístrate
                {activeTab === "signup" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-lg text-center">
                {successMessage}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="admin@viajaligero.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 bg-background border-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 bg-background border-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña</label>
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

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear Cuenta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-muted-foreground pt-2">
              Vive más con menos.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}