import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Debounce username validation
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    // Check if user already has username configured
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile?.username) {
      router.push("/admin/dashboard");
    }
  };

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

  const checkUsernameAvailability = async (value: string) => {
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      setIsAvailable(false);
      return;
    }

    setError("");
    setChecking(true);

    try {
      const normalizedUsername = value.toLowerCase().trim();
      
      const { data, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", normalizedUsername)
        .maybeSingle();

      if (checkError) throw checkError;

      setIsAvailable(!data);
    } catch (err) {
      console.error("Error checking username:", err);
      setError("Error al verificar disponibilidad");
    } finally {
      setChecking(false);
    }
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
        title: "¡Username configurado!",
        description: "Tu funnel ya está listo para compartir"
      });

      router.push("/admin/dashboard");
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
    ? `traveladvantage.com/ambassador/${username.toLowerCase()}`
    : "traveladvantage.com/ambassador/tu-username";

  return (
    <>
      <SEO title="Configura tu Username - Viaja Ligero" />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">¡Bienvenido a Viaja Ligero! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Configura tu username para obtener tu funnel personalizado
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <LinkIcon className="h-4 w-4" />
              <AlertDescription>
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
                    className="pr-10"
                    maxLength={30}
                  />
                  {checking && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!checking && username.length >= 3 && isAvailable !== null && (
                    isAvailable ? (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                    )
                  )}
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                {!error && isAvailable && (
                  <p className="text-sm text-green-600">✓ Username disponible</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Solo letras, números y guiones. Mínimo 3 caracteres.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tu URL será:</Label>
                <div className="p-4 bg-muted rounded-lg border">
                  <p className="font-mono text-primary break-all">
                    {previewUrl}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
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