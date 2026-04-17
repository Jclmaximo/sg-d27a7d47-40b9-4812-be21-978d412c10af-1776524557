import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const {
      ownerEmail,
      ownerName,
      leadName,
      leadEmail,
      leadPhone,
      leadInterest,
      contactMethod,
      dashboardUrl
    } = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Viaja Ligero <notificaciones@viajaligero.com>",
        to: [ownerEmail],
        subject: `🎉 Nuevo Lead: ${leadName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .lead-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
                .info-row { margin: 10px 0; }
                .label { font-weight: bold; color: #1f2937; }
                .value { color: #4b5563; }
                .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🎉 ¡Nuevo Lead Capturado!</h1>
                  <p style="margin: 10px 0 0 0;">Tu embudo de ventas acaba de capturar un prospecto</p>
                </div>
                <div class="content">
                  <p>Hola <strong>${ownerName}</strong>,</p>
                  <p>Alguien completó el formulario de tu embudo personalizado. Aquí están los detalles:</p>
                  
                  <div class="lead-info">
                    <div class="info-row">
                      <span class="label">👤 Nombre:</span>
                      <span class="value">${leadName}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">📧 Email:</span>
                      <span class="value">${leadEmail}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">📱 WhatsApp:</span>
                      <span class="value">${leadPhone}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">💡 Interés:</span>
                      <span class="value">${leadInterest}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">📞 Prefiere contacto por:</span>
                      <span class="value">${contactMethod === "whatsapp" ? "WhatsApp" : "Email"}</span>
                    </div>
                  </div>

                  <p><strong>⚡ Acción recomendada:</strong> Contacta a este prospecto en las próximas 24 horas para maximizar tus posibilidades de conversión.</p>

                  ${contactMethod === "whatsapp" ? `
                    <a href="https://wa.me/${leadPhone.replace(/[^0-9]/g, "")}" class="button">
                      💬 Contactar por WhatsApp
                    </a>
                  ` : ""}

                  <a href="${dashboardUrl}" class="button" style="background: #059669; margin-left: 10px;">
                    📊 Ver en Dashboard
                  </a>

                  <div class="footer">
                    <p>Este es un email automático de tu sistema de gestión de leads</p>
                    <p>© ${new Date().getFullYear()} Viaja Ligero - Travel Advantage</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", emailData);
      throw new Error(`Resend API error: ${emailData.message || "Unknown error"}`);
    }

    console.log("✅ Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});