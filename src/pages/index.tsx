import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await authService.getCurrentSession();
      if (session) {
        router.push("/reto");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await authService.signIn(email, password);

      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (user) {
        router.push("/reto");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sistema de Productividad - Acceso"
        description="Accede al sistema de productividad para monitorear tu ejecución diaria"
      />

      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <Card className="w-full max-w-md p-8 shadow-lg">
          {/* Ícono de Rayo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-xl bg-[#3A7BFF] flex items-center justify-center shadow-md">
              <Zap className="w-10 h-10 text-white fill-white" />
            </div>
          </div>

          {/* Mensaje de Bienvenida */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">Bienvenido de nuevo</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sistema de Productividad
            </h1>
            <p className="text-sm text-gray-600">
              Monitorea tu ejecución diaria y mantén el control de tu desempeño
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 border-gray-300 focus:border-[#3A7BFF] focus:ring-[#3A7BFF]"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 border-gray-300 focus:border-[#3A7BFF] focus:ring-[#3A7BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón Principal */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3A7BFF] hover:bg-[#2563eb] text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? "Accediendo..." : "Entrar al sistema"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>

            {/* Micro Copy */}
            <p className="text-xs text-center text-gray-500 mt-4">
              Toma menos de 30 segundos comenzar tu día
            </p>
          </form>

          {/* Links Secundarios */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-center">
            <Link
              href="/auth/reset-password"
              className="block text-sm text-[#3A7BFF] hover:text-[#2563eb] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}