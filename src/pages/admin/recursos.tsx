import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Copy, 
  Link as LinkIcon, 
  Image as ImageIcon,
  FileText,
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Share2,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Globe,
  LogOut
} from "lucide-react";
import Link from "next/link";

interface MarketingResource {
  id: string;
  title: string;
  description: string;
  category: "instagram" | "facebook" | "whatsapp" | "email";
  type: "image" | "copy";
  size?: string;
  url?: string;
  content?: string;
}

// Placeholder images using Unsplash
const marketingImages: MarketingResource[] = [
  {
    id: "img-1",
    title: "Post Instagram - Descubre el Club",
    description: "Imagen cuadrada para feed de Instagram",
    category: "instagram",
    type: "image",
    size: "1080x1080",
    url: "/marketing/ig-post-descubre.png"
  },
  {
    id: "img-2",
    title: "Post Instagram - Ahorro Real",
    description: "Muestra beneficios de ahorro",
    category: "instagram",
    type: "image",
    size: "1080x1080",
    url: "/marketing/ig-post-ahorro.png"
  },
  {
    id: "img-3",
    title: "Story - Testimonial",
    description: "Historia vertical con caso de éxito",
    category: "instagram",
    type: "image",
    size: "1080x1920",
    url: "/marketing/ig-story-testimonial.png"
  },
  {
    id: "img-4",
    title: "Story - Comisiones",
    description: "Explica el sistema de comisiones 10%",
    category: "instagram",
    type: "image",
    size: "1080x1920",
    url: "/marketing/ig-story-comisiones.png"
  },
  {
    id: "img-5",
    title: "Banner Facebook - Viaja Más",
    description: "Banner optimizado para Facebook",
    category: "facebook",
    type: "image",
    size: "1200x628",
    url: "/marketing/fb-banner-viaja-mas.png"
  },
  {
    id: "img-6",
    title: "Post Facebook - Beneficios",
    description: "Lista de beneficios exclusivos",
    category: "facebook",
    type: "image",
    size: "1080x1080",
    url: "/marketing/fb-post-beneficios.png"
  },
  {
    id: "img-7",
    title: "WhatsApp Status - Oferta",
    description: "Imagen vertical para estados de WhatsApp",
    category: "whatsapp",
    type: "image",
    size: "1080x1920",
    url: "/marketing/wa-status-oferta.png"
  },
  {
    id: "img-8",
    title: "WhatsApp - Compartir",
    description: "Imagen para enviar por mensajes",
    category: "whatsapp",
    type: "image",
    size: "1080x1080",
    url: "/marketing/wa-compartir.png"
  }
];

const marketingCopys: MarketingResource[] = [
  {
    id: "copy-1",
    title: "Post Descubrimiento - Redes Sociales",
    description: "Genera curiosidad sobre el club",
    category: "instagram",
    type: "copy",
    content: `🌍 ¿Sabías que puedes acceder a tarifas de viaje exclusivas que NO están disponibles al público?

Descubre cómo viajar más pagando menos con acceso a:
✈️ Hoteles de lujo con descuentos
🏖️ Experiencias únicas
💰 Ahorro real en cada viaje

Miembros ahorraron $2.8 millones en 2024.

👉 Descubre cómo: [TU LINK]

#ViajaLigero #DescuentosDeViaje #ViajarMás`
  },
  {
    id: "copy-2",
    title: "Post Testimonial - Redes Sociales",
    description: "Caso de éxito real",
    category: "instagram",
    type: "copy",
    content: `💰 Lorenzo ahorró $493 USD en su viaje a Colombia.
Elena ahorró $1,092 USD en Turquía.

¿Cuánto podrías ahorrar tú en tu próximo viaje?

Con Viaja Ligero, accedes a tarifas preferenciales en:
🏨 Hoteles y resorts
✈️ Vuelos
🚢 Cruceros
🚗 Alquiler de autos

👉 Únete ahora: [TU LINK]`
  },
  {
    id: "copy-3",
    title: "Post Viajar Más - Redes Sociales",
    description: "Explica cómo viajar más o incluso gratis",
    category: "instagram",
    type: "copy",
    content: `✈️ ¿Y si pudieras viajar más seguido... incluso viajar gratis?

Con Viaja Ligero puedes:
✅ Ahorrar en cada viaje
✅ Generar créditos para viajar gratis
✅ Convertir tu pasión por viajar en un estilo de vida

Comparte tus experiencias de viaje y gana créditos que te permiten:
🌍 Reducir el costo de tus próximos viajes a cero
✈️ Viajar más seguido sin límites
🏖️ Vivir la vida que siempre soñaste

Es tan simple como compartir lo que ya amas hacer.

👉 Descubre cómo: [TU LINK]

#ViajaLigero #ViajarGratis #VidaDeViajero`
  },
  {
    id: "copy-4",
    title: "Post Beneficios - Redes Sociales",
    description: "Lista completa de beneficios",
    category: "facebook",
    type: "copy",
    content: `🎯 ¿Cansado de pagar precios inflados en viajes?

Viaja Ligero te ofrece:

🏖️ Acceso a tarifas preferenciales
💎 Programa Life Experiences® (viajes de lujo curados)
🎁 Créditos de Viaje para futuras reservas
💰 Posibilidad de generar ingresos por referidos

Más de $2.8 millones ahorrados por nuestros miembros en 2024.

👉 Descubre cómo funciona: [TU LINK]`
  },
  {
    id: "copy-5",
    title: "Mensaje WhatsApp - Intro",
    description: "Primer mensaje para contactos",
    category: "whatsapp",
    type: "copy",
    content: `Hola! 👋

Te comparto algo que me está ayudando a viajar más pagando menos:

Es un club privado con acceso a tarifas preferenciales en hoteles, vuelos, cruceros y experiencias.

Miembros ahorraron más de $2.8 millones en 2024.

¿Te interesa saber cómo funciona?

👉 [TU LINK]`
  },
  {
    id: "copy-6",
    title: "Mensaje WhatsApp - Seguimiento",
    description: "Mensaje de seguimiento",
    category: "whatsapp",
    type: "copy",
    content: `Hola de nuevo! 

¿Tuviste chance de revisar el link que te envié sobre Viaja Ligero?

Es súper interesante porque además de ahorrar en viajes, puedes ganar comisiones del 10% si decides invitar a otros viajeros.

Yo ya empecé y es genial. ¿Tienes alguna pregunta?`
  },
  {
    id: "copy-9",
    title: "Email - Viajar Gratis",
    description: "Email enfocado en créditos y viajar gratis",
    category: "email",
    type: "copy",
    content: `ASUNTO: ¿Y si tu próximo viaje fuera gratis?

Hola [NOMBRE],

Te hago una pregunta:

¿Cuántas veces has cancelado un viaje por el costo?

Ahora imagina esto:
• Viajar a donde quieras, cuando quieras
• Sin preocuparte por el precio
• Incluso viajar completamente gratis

Suena irreal, ¿verdad?

Pero es exactamente lo que están haciendo cientos de miembros de Viaja Ligero.

El sistema es simple:
→ Ahorras en cada viaje que haces
→ Compartes tu experiencia con otros viajeros
→ Ganas créditos que reducen el costo de tus próximos viajes a $0

Algunos incluso han convertido esto en su estilo de vida.

¿Quieres saber cómo funciona?

👉 [TU LINK]

Nos vemos en el próximo destino,
[TU NOMBRE]

PD: No es un programa de puntos tradicional. Es mucho mejor.`
  },
  {
    id: "copy-10",
    title: "WhatsApp - Viajar Gratis",
    description: "Mensaje conversacional sobre viajar más",
    category: "whatsapp",
    type: "copy",
    content: `Hola! 👋

Te comparto algo que cambió mi forma de viajar:

Encontré una manera de viajar más seguido... incluso gratis. 🌍✈️

No es un truco ni nada raro. Es un club privado donde:
→ Accedes a tarifas exclusivas en hoteles y vuelos
→ Ahorras en cada viaje
→ Ganas créditos compartiendo tu experiencia

Los créditos pueden cubrir el costo completo de tus próximos viajes. Literal: viajar gratis.

Yo ya lo probé y es real. Te paso el link:

👉 [TU LINK]

Avísame si tienes dudas. Es más simple de lo que suena 😊`
  },
  {
    id: "copy-11",
    title: "Facebook Ad - Viajar Gratis",
    description: "Copy de ad optimizado para conversión",
    category: "facebook",
    type: "copy",
    content: `✈️ ¿Cansado de pagar de más en tus viajes?

Imagina esto:
→ Viajar a destinos de ensueño
→ Pagar menos de la mitad del precio normal
→ Incluso viajar completamente GRATIS

No es ficción. Es Viaja Ligero.

Miembros ahorraron $2.8 millones en 2024.
Algunos ya viajan gratis compartiendo su experiencia.

¿Cómo?
• Acceso a tarifas exclusivas (no disponibles al público)
• Sistema de créditos por referidos
• Viajes curados en destinos premium

Tu próximo viaje podría costarte $0.

👉 Descubre cómo funciona (gratis)
[TU LINK]

#ViajaLigero #ViajarGratis #AhorroEnViajes`
  },
  {
    id: "copy-7",
    title: "Email - Subject: Descubrimiento",
    description: "Asunto y cuerpo de email",
    category: "email",
    type: "copy",
    content: `ASUNTO: ¿Por qué pagas más en tus viajes?

Hola [NOMBRE],

Si viajas regularmente, probablemente has notado que los precios están cada vez más altos.

Pero hay una forma de acceder a tarifas que no están disponibles al público general.

Viaja Ligero es un club privado donde puedes:
• Ahorrar en hoteles, vuelos y experiencias
• Acceder a viajes de lujo curados (Dubai, Nueva York, etc.)
• Generar ingresos por referir a otros viajeros (10% de comisión)

Miembros ahorraron $2.8 millones en 2024.

👉 Descubre cómo funciona aquí: [TU LINK]

Un abrazo,
[TU NOMBRE]`
  },
  {
    id: "copy-8",
    title: "Email - Subject: Testimonial",
    description: "Email con caso de éxito",
    category: "email",
    type: "copy",
    content: `ASUNTO: Ahorré $493 en mi último viaje - así lo hice

Hola [NOMBRE],

Te cuento algo que me pasó hace poco:

Estaba planeando un viaje a Colombia y como siempre, busqué en las páginas tradicionales. El precio total era de $1,200 USD.

Decidí probar Viaja Ligero (un club privado de tarifas preferenciales) y el mismo paquete me costó $707 USD.

Ahorré $493 USD. 🤯

¿Lo mejor? Puedes hacer lo mismo en tu próximo viaje.

👉 Empieza aquí: [TU LINK]

Saludos,
[TU NOMBRE]`
  },
  {
    id: "copy-9",
    title: "Post Instagram - Viaja Más",
    description: "Promociona el viaje más barato",
    category: "instagram",
    type: "copy",
    content: `✈️ ¿Y si pudieras viajar más seguido... incluso viajar gratis?

Con Viaja Ligero puedes:
✅ Ahorrar en cada viaje
✅ Generar créditos para viajar gratis
✅ Convertir tu pasión por viajar en un estilo de vida

Comparte tus experiencias de viaje y gana créditos que te permiten:
🌍 Reducir el costo de tus próximos viajes a cero
✈️ Viajar más seguido sin límites
🏖️ Vivir la vida que siempre soñaste

Es tan simple como compartir lo que ya amas hacer.

👉 Descubre cómo: [TU LINK]

#ViajaLigero #ViajarGratis #VidaDeViajero`
  },
  {
    id: "copy-10",
    title: "Post Facebook - Viaja Más",
    description: "Promociona el viaje más barato",
    category: "facebook",
    type: "copy",
    content: `✈️ ¿Y si pudieras viajar más seguido... incluso viajar gratis?

Con Viaja Ligero puedes:
✅ Ahorrar en cada viaje
✅ Generar créditos para viajar gratis
✅ Convertir tu pasión por viajar en un estilo de vida

Comparte tus experiencias de viaje y gana créditos que te permiten:
🌍 Reducir el costo de tus próximos viajes a cero
✈️ Viajar más seguido sin límites
🏖️ Vivir la vida que siempre soñaste

Es tan simple como compartir lo que ya amas hacer.

👉 Descubre cómo: [TU LINK]

#ViajaLigero #ViajarGratis #VidaDeViajero`
  },
  {
    id: "copy-11",
    title: "Mensaje WhatsApp - Viaja Más",
    description: "Promociona el viaje más barato",
    category: "whatsapp",
    type: "copy",
    content: `✈️ ¿Y si pudieras viajar más seguido... incluso viajar gratis?

Con Viaja Ligero puedes:
✅ Ahorrar en cada viaje
✅ Generar créditos para viajar gratis
✅ Convertir tu pasión por viajar en un estilo de vida

Comparte tus experiencias de viaje y gana créditos que te permiten:
🌍 Reducir el costo de tus próximos viajes a cero
✈️ Viajar más seguido sin límites
🏖️ Vivir la vida que siempre soñaste

Es tan simple como compartir lo que ya amas hacer.

👉 Descubre cómo: [TU LINK]

#ViajaLigero #ViajarGratis #VidaDeViajero`
  }
];

export default function RecursosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [stats, setStats] = useState({
    downloadedThisMonth: 0,
    copiedThisMonth: 0,
    conversionsThisMonth: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/admin");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile?.username) {
      setUsername(profile.username);
    }

    // TODO: Fetch real stats from database
    setStats({
      downloadedThisMonth: 12,
      copiedThisMonth: 28,
      conversionsThisMonth: 3
    });

    setLoading(false);
  };

  const handleCopyText = async (text: string, label: string) => {
    const textWithLink = text.replace("[TU LINK]", `https://mwr.hubia.vip/ambassador/${username}`);
    
    try {
      await navigator.clipboard.writeText(textWithLink);
      toast({
        title: "✅ Copiado",
        description: `${label} copiado al portapapeles`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el texto",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "✅ Link Copiado",
        description: "Link copiado al portapapeles"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el link",
        variant: "destructive"
      });
    }
  };

  const getReferralLink = (source?: string) => {
    if (!username) return "";
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    let link = `${baseUrl}/mwr?ref=${username}`;
    
    if (source) {
      link += `&source=${source}`;
    }
    return link;
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    toast({
      title: "✅ Descarga Iniciada",
      description: "La imagen se está descargando"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando recursos...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Recursos para Difusión - Viaja Ligero" description="Materiales de marketing para promocionar Viaja Ligero" />
      
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link href="/admin/main-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Button
                onClick={async () => {
                  const { authService } = await import("@/services/authService");
                  await authService.signOut();
                  router.push("/admin");
                }}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
            <h1 className="text-4xl font-bold">Recursos para Difusión</h1>
            <p className="text-muted-foreground mt-2">
              Utiliza estas imágenes y copys para promocionar tu embudo y generar más leads
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-blue-500/30 bg-card/50 shadow-lg shadow-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recursos Descargados</CardTitle>
                <Download className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.downloadedThisMonth}</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/30 bg-card/50 shadow-lg shadow-cyan-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Copys Copiados</CardTitle>
                <Copy className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.copiedThisMonth}</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>

            <Card className="border-green-500/30 bg-card/50 shadow-lg shadow-green-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversiones Generadas</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversionsThisMonth}</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="images" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 mr-2" />
                Imágenes
              </TabsTrigger>
              <TabsTrigger value="copys">
                <FileText className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Copys</span>
                <span className="hidden sm:inline">Copy Sugeridos</span>
              </TabsTrigger>
              <TabsTrigger value="links">
                <LinkIcon className="w-4 h-4 mr-2" />
                <span className="sm:hidden">Enlaces</span>
                <span className="hidden sm:inline">Enlaces de Difusión</span>
              </TabsTrigger>
            </TabsList>

            {/* Images Tab */}
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes Sugeridas</CardTitle>
                  <CardDescription>
                    Diseñadas para atraer y convertir. Click en "Descargar" para guardar cada imagen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {marketingImages.map((resource) => (
                      <div key={resource.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square relative bg-muted">
                          <img 
                            src={resource.url} 
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary">{resource.size}</Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => downloadImage(resource.url!, `${resource.id}.jpg`)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Copys Tab */}
            <TabsContent value="copys">
              <Tabs defaultValue="social" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="social">
                    <Instagram className="w-4 h-4 mr-2" />
                    Redes Sociales
                  </TabsTrigger>
                  <TabsTrigger value="whatsapp">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </TabsTrigger>
                  <TabsTrigger value="email">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="social">
                  <div className="grid gap-4">
                    {marketingCopys
                      .filter(c => c.category === "instagram" || c.category === "facebook")
                      .map((copy) => (
                        <Card key={copy.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{copy.title}</CardTitle>
                                <CardDescription>{copy.description}</CardDescription>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => handleCopyText(copy.content!, copy.title)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-muted p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm font-sans">
                                {copy.content}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="whatsapp">
                  <div className="grid gap-4">
                    {marketingCopys
                      .filter(c => c.category === "whatsapp")
                      .map((copy) => (
                        <Card key={copy.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{copy.title}</CardTitle>
                                <CardDescription>{copy.description}</CardDescription>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => handleCopyText(copy.content!, copy.title)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-muted p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm font-sans">
                                {copy.content}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="email">
                  <div className="grid gap-4">
                    {marketingCopys
                      .filter(c => c.category === "email")
                      .map((copy) => (
                        <Card key={copy.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{copy.title}</CardTitle>
                                <CardDescription>{copy.description}</CardDescription>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => handleCopyText(copy.content!, copy.title)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-muted p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm font-sans">
                                {copy.content}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Links Tab */}
            <TabsContent value="links">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tu Link de Referido Principal</CardTitle>
                    <CardDescription>
                      Comparte este link para promocionar membresías de viaje con descuentos exclusivos. Ayuda a tus contactos a viajar más pagando menos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={getReferralLink()}
                        readOnly
                        className="flex-1 px-4 py-2 border rounded-lg bg-muted font-mono text-sm overflow-x-auto"
                      />
                      <Button onClick={() => handleCopyLink(getReferralLink())} className="shrink-0">
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg border">
                      <p className="text-sm font-medium mb-2">Vista previa del link:</p>
                      <div className="bg-background p-4 rounded border">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center shrink-0">
                            <Globe className="w-8 h-8 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold break-words">Viaja Ligero - Membresías Exclusivas</h4>
                            <p className="text-sm text-muted-foreground break-words">
                              Accede a descuentos exclusivos en viajes y experiencias de lujo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Links Personalizados por Red Social</CardTitle>
                    <CardDescription className="break-words">
                      Usa estos links para trackear mejor de dónde vienen tus conversiones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Instagram className="w-5 h-5 text-pink-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Instagram</p>
                          <code className="text-xs text-muted-foreground break-all block">
                            {getReferralLink("instagram")}
                          </code>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCopyLink(getReferralLink("instagram"))}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Facebook</p>
                          <code className="text-xs text-muted-foreground break-all block">
                            {getReferralLink("facebook")}
                          </code>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCopyLink(getReferralLink("facebook"))}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">WhatsApp</p>
                          <code className="text-xs text-muted-foreground break-all block">
                            {getReferralLink("whatsapp")}
                          </code>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCopyLink(getReferralLink("whatsapp"))}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Email</p>
                          <code className="text-xs text-muted-foreground break-all block">
                            {getReferralLink("email")}
                          </code>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCopyLink(getReferralLink("email"))}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/50 bg-primary/5 shadow-lg shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Consejos para Promocionar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="break-words">Comparte tus resultados reales (cuánto has ahorrado en viajes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="break-words">Usa las imágenes y copys en tus historias de Instagram diariamente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="break-words">Envía mensajes personalizados por WhatsApp a viajeros frecuentes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="break-words">Publica en grupos de Facebook relacionados con viajes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="break-words">Responde preguntas genuinas sobre cómo funciona el club</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}