import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { SEO } from "@/components/SEO";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await authService.signIn(email, password);

      if (signInError) {
        setError("Credenciales incorrectas. Por favor, verifica tus datos.");
        setLoading(false);
        return;
      }

      router.push("/admin/main-dashboard");
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sistema de Productividad - Viaja Ligero"
        description="Accede al sistema de productividad y monitorea tu desempeño"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-lg border-0">
          {/* Ícono de Rayo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-xl bg-[#3A7BFF] flex items-center justify-center shadow-md">
              <Zap className="w-10 h-10 text-white fill-white" />
            </div>
          </div>

          {/* Mensaje de bienvenida */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">Bienvenido de nuevo</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Sistema de Productividad
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Monitorea tu ejecución diaria y mantén el control de tu desempeño
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 pr-11 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botón principal */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#3A7BFF] hover:bg-[#2968E6] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Iniciando..."
              ) : (
                <>
                  Entrar al sistema
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {/* Micro copy */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Toma menos de 30 segundos comenzar tu día
            </p>
          </form>

          {/* Links secundarios */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <Link
                href="/auth/reset-password"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link
                href="/registro"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Crear cuenta nueva
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}