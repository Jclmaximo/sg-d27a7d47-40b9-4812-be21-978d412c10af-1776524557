import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Send, Check, Sparkles, CheckCircle2 } from "lucide-react";

interface MessageTemplate {
  id: number;
  title: string;
  message: string;
  emoji: string;
  color: string;
}

const messageTemplates: MessageTemplate[] = [
  {
    id: 1,
    title: "Bienvenida Inicial",
    message: "¡Hola {nombre}! 👋 Gracias por tu interés en Viaja Ligero. Vi que te registraste y quiero ayudarte a descubrir cómo ahorrar hasta 60% en tus viajes. ¿Tienes 5 minutos para una breve llamada?",
    emoji: "👋",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Recordatorio Amigable",
    message: "Hola {nombre}, soy {ambassador} 😊 Te contacté hace unos días sobre la membresía de Viaja Ligero. ¿Tuviste oportunidad de revisar la información? Estoy aquí para resolver cualquier duda que tengas.",
    emoji: "🔔",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Beneficios Exclusivos",
    message: "¡{nombre}! ✨ Quiero compartirte algo: Nuestros miembros ahorraron más de $2.8M USD el año pasado. Imagina tu próximo viaje con 40-60% de descuento en hoteles, vuelos y experiencias. ¿Te interesa saber cómo?",
    emoji: "💎",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: 4,
    title: "Casos de Éxito",
    message: "Hola {nombre} 🌟 Te cuento: Laura viajó a Turquía y ahorró $1,092 USD, Carlos a Dubai y ahorró $847 USD. Todo con nuestra membresía. ¿Cuál es tu próximo destino soñado?",
    emoji: "🌍",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 5,
    title: "Urgencia Limitada",
    message: "¡{nombre}! ⏰ Este mes tenemos una promoción especial en la membresía anual. Solo quedan {días} días y los cupos son limitados. ¿Hablamos hoy para que no pierdas esta oportunidad?",
    emoji: "🔥",
    color: "from-red-500 to-rose-500"
  },
  {
    id: 6,
    title: "Resolver Dudas",
    message: "Hola {nombre} 🤔 Noto que aún no has dado el paso. ¿Hay algo que te preocupe o alguna duda que pueda resolver? Estoy aquí para ayudarte a tomar la mejor decisión para tus viajes.",
    emoji: "💬",
    color: "from-indigo-500 to-violet-500"
  }
];

const testLead = {
  name: "Juan Pérez",
  phone: "+52 123 456 7890"
};

export default function TestMessagesPage() {
  const { toast } = useToast();
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  const handleSendMessage = async (template: MessageTemplate) => {
    // Personalize message
    const personalizedMessage = template.message
      .replace("{nombre}", testLead.name.split(" ")[0])
      .replace("{ambassador}", "tu asesor")
      .replace("{días}", "7");

    // Copy to clipboard
    await navigator.clipboard.writeText(personalizedMessage);
    
    setCopiedMessageId(template.id);
    setTimeout(() => setCopiedMessageId(null), 2000);

    toast({
      title: "Mensaje copiado",
      description: "Abre WhatsApp para enviarlo",
    });

    // Open WhatsApp with personalized message
    const whatsappUrl = `https://wa.me/${testLead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(personalizedMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleFinishMessages = () => {
    setShowMessagesModal(false);
    setShowThanksModal(true);
  };

  return (
    <>
      <SEO title="Test - Mensajes Sugeridos" description="Página de prueba para mensajes" />

      {/* Messages Modal */}
      <Dialog open={showMessagesModal} onOpenChange={setShowMessagesModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Mensajes Sugeridos con IA
            </DialogTitle>
            <DialogDescription>
              Selecciona un mensaje para enviarlo por WhatsApp con 1 click
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xl">{testLead.name[0].toUpperCase()}</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{testLead.name}</h3>
                <p className="text-sm text-muted-foreground">{testLead.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {messageTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleSendMessage(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white`}>
                          <span className="text-lg">{template.emoji}</span>
                        </div>
                        <h4 className="font-semibold text-foreground">{template.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {template.message
                          .replace("{nombre}", testLead.name.split(" ")[0])
                          .replace("{ambassador}", "tu asesor")
                          .replace("{días}", "7")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${template.color} hover:opacity-90 text-white shrink-0`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendMessage(template);
                      }}
                    >
                      {copiedMessageId === template.id ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMessagesModal(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button
              onClick={handleFinishMessages}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            >
              Terminar Seguimiento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thanks Modal */}
      <Dialog open={showThanksModal} onOpenChange={setShowThanksModal}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ¡Excelente Trabajo!
            </h2>
            <p className="text-muted-foreground mb-6">
              Has completado el seguimiento de tus leads. Sigue así y alcanzarás tus metas.
            </p>
            <Button
              onClick={() => setShowThanksModal(false)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-12 text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🧪 Test - Mensajes Sugeridos
              </h1>
              <p className="text-muted-foreground mb-8">
                Esta es una página de prueba para verificar que el modal de mensajes funciona correctamente
              </p>
              
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => setShowMessagesModal(true)}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Abrir Modal de Mensajes
                </Button>

                <div className="text-left max-w-2xl mx-auto bg-muted/30 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Lo que deberías ver:
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ 6 tarjetas de mensajes con diferentes colores</li>
                    <li>✅ Cada mensaje con emoji y título</li>
                    <li>✅ Botón "Enviar" en cada tarjeta</li>
                    <li>✅ Al hacer click: copia mensaje y abre WhatsApp</li>
                    <li>✅ Mensaje personalizado con "Juan" (lead de prueba)</li>
                    <li>✅ Botones "Cerrar" y "Terminar Seguimiento" abajo</li>
                  </ul>
                </div>

                <div className="text-left max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/30 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    ⚠️ Lead de Prueba:
                  </h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Nombre:</strong> {testLead.name}</p>
                    <p><strong>Teléfono:</strong> {testLead.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}