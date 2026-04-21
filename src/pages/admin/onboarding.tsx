import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Link as LinkIcon } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const checkAuth = useCallback(async () => {
    const session = await authService.getCurrentSession();
    if (!session) {
      router.push("/auth/reset-password");
      return;
    }
    
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (profile?.username) {
        router.push("/admin/welcome");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  }, [router]);

  const checkUsernameAvailability = useCallback(async () => {
    if (!username || username.length < 3) {
      setIsAvailable(false);
      setError("");
      return;
    }

    setChecking(true);
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsAvailable(false);
        setError("Este nombre de usuario ya está en uso");
      } else {
        setIsAvailable(true);
        setError("");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setError("Error al verificar disponibilidad");
    } finally {
      setChecking(false);
    }
  }, [username]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [checkUsernameAvailability]);

  const validateUsername = (value: string): string | null => {
    if (value.length < 3) {
      return "El username debe tener al menos 3 caracteres";
    }
    if (value.length > 30) {
      return "El username no puede tener más de 30 caracteres";
    }
    if (!/^[a-zA-Z0-9-]+$/.test(value)) {
      return "Solo se permiten letras, números y guiones";
    }
    if (value.startsWith("-") || value.endsWith("-")) {
      return "No puede comenzar ni terminar con guión";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isAvailable) {
      setError("Este username no está disponible");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const normalizedUsername = username.toLowerCase().trim();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username: normalizedUsername })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "¡Perfil configurado!",
        description: "Bienvenido a tu panel de control"
      });

      router.push("/admin/welcome");
    } catch (err: any) {
      console.error("Error setting username:", err);
      toast({
        title: "Error",
        description: err.message || "No se pudo configurar el username",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    // Remove spaces and convert to lowercase
    const cleaned = value.toLowerCase().replace(/\s+/g, "-");
    setUsername(cleaned);
  };

  const previewUrl = username.length >= 3 
    ? `mwr.hubia.vip/ambassador/${username.toLowerCase()}`
    : "mwr.hubia.vip/ambassador/tu-username";

  return (
    <>
      <SEO title="Configura tu Username - Viaja Ligero" />
      
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-border/50 relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-heading bg-clip-text text-transparent">
              ¡Bienvenido a Viaja Ligero! 🎉
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Configura tu username para obtener tu funnel personalizado
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="bg-primary/10 border-primary/20">
              <LinkIcon className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary/90">
                Tu funnel estará disponible en una URL única que podrás compartir con tus contactos.
                Todos los leads capturados se guardarán automáticamente en tu cuenta.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Elige tu Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="tu-nombre"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="pr-10 bg-background/50 border-border/50"
                    maxLength={30}
                  />
                  {checking && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!checking && username.length >= 3 && isAvailable !== null && (
                    isAvailable ? (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-secondary" />
                    ) : (
                      <XCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                    )
                  )}
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                {!error && isAvailable && (
                  <p className="text-sm text-secondary">✓ Username disponible</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Solo letras, números y guiones. Mínimo 3 caracteres.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tu URL será:</Label>
                <div className="p-4 bg-background/30 rounded-lg border border-border/50">
                  <p className="font-mono text-primary break-all">
                    {previewUrl}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                disabled={loading || !isAvailable || username.length < 3}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  "Continuar al Dashboard"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>Podrás cambiar tu username más adelante desde tu dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}