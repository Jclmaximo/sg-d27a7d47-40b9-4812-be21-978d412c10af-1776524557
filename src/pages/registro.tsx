import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Lock, Zap } from "lucide-react";

export default function Registro() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    pais: "",
    mwrLink: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.nombre} ${formData.apellido}`,
            phone: formData.telefono,
            country: formData.pais,
            mwr_link: formData.mwrLink
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: `${formData.nombre} ${formData.apellido}`,
            phone: formData.telefono,
            country: formData.pais,
            mwr_link: formData.mwrLink
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Cuenta creada",
          description: "Redirigiendo al pago..."
        });

        setTimeout(() => {
          router.push("/checkout");
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cuenta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SEO 
        title="Crear cuenta - Sistema MWR"
        description="Crea tu cuenta y comienza a usar el sistema hoy"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-2">
              Estás a un paso de activar tu sistema
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Crea tu cuenta y comienza hoy
            </h1>
            <p className="text-gray-600">
              Accede en minutos. Todo listo para empezar.
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Apellido */}
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Tu apellido"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              {/* Teléfono */}
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="+1234567890"
                />
              </div>

              {/* País */}
              <div>
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  name="pais"
                  type="text"
                  required
                  value={formData.pais}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Tu país"
                />
              </div>

              {/* MWR Link (opcional) */}
              <div>
                <Label htmlFor="mwrLink" className="text-gray-500 text-sm">
                  MWR Link (opcional)
                </Label>
                <Input
                  id="mwrLink"
                  name="mwrLink"
                  type="text"
                  value={formData.mwrLink}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="https://mwr.life/..."
                />
              </div>

              {/* Trust Microcopy */}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Tus datos están protegidos</p>
                  <p className="text-xs">Acceso inmediato después del pago</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Creando cuenta..."
                ) : (
                  <>
                    Crear cuenta y activar acceso
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              {/* Support Text */}
              <p className="text-center text-sm text-gray-600">
                Serás redirigido al pago seguro de <span className="font-semibold text-gray-900">$29 USD</span> para activar tu sistema
              </p>
            </form>
          </div>

          {/* Footer Trust Elements */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Pago seguro
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Acceso inmediato
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}