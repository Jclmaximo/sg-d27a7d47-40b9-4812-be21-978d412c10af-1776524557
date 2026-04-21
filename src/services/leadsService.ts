import { supabase } from "@/integrations/supabase/client";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  source: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  template: string;
  created_at: string;
}

export const leadsService = {
  /**
   * Create a new lead from funnel submission
   */
  async createLead(leadData: {
    name: string;
    email: string;
    phone: string;
    country: string;
    source: string;
    interest?: string;
    contact_method?: string;
    user_id: string;
  }) {
    const { data, error } = await supabase
      .from("leads")
      .insert([{
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        country: leadData.country,
        source: leadData.source,
        user_id: leadData.user_id,
        status: "nuevo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      throw error;
    }

    // Email notifications disabled by user request
    // Leads will appear directly in the dashboard

    // Send WhatsApp notification to funnel owner
    if (data) {
      this.sendWhatsAppNotification({
        leadName: leadData.name,
        leadEmail: leadData.email,
        leadPhone: leadData.phone,
        leadCountry: leadData.country,
        interest: leadData.interest || "No especificado",
        ownerId: leadData.user_id
      });
    }

    return { data, error };
  },

  /**
   * Send WhatsApp notification to funnel owner
   */
  async sendWhatsAppNotification(params: {
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    leadCountry: string;
    interest: string;
    ownerId: string;
  }) {
    try {
      // Get owner's profile to get their WhatsApp number
      const { data: owner } = await supabase
        .from("profiles")
        .select("whatsapp_number, username")
        .eq("id", params.ownerId)
        .single();

      if (!owner?.whatsapp_number) {
        console.log("Owner WhatsApp not found");
        return;
      }

      // Clean WhatsApp number (remove spaces, dashes, etc.)
      const cleanWhatsApp = owner.whatsapp_number.replace(/[^0-9]/g, "");

      // Create notification message
      const message = `🎯 *Nuevo Lead Capturado!*

📋 *Información del Lead:*
• Nombre: ${params.leadName}
• Email: ${params.leadEmail}
• WhatsApp: ${params.leadPhone}
• País: ${params.leadCountry}
• Interés: ${params.interest}

🔗 Ver en dashboard:
${window.location.origin}/admin/main-dashboard

¡Contacta rápido para cerrar la venta!`;

      // Open WhatsApp with message
      const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;
      
      console.log("📱 Opening WhatsApp notification:", whatsappUrl);
      
      // Open in new tab
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
    }
  },

  /**
   * Notify funnel owner about new lead (DISABLED)
   */
  async notifyFunnelOwner(params: {
    leadId: string;
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    ownerId: string;
    interest: string;
    contactMethod: string;
  }) {
    try {
      // Get owner's profile info
      const { data: owner } = await supabase
        .from("profiles")
        .select("email, full_name, username, whatsapp_number")
        .eq("id", params.ownerId)
        .single();

      if (!owner) {
        console.error("Owner not found");
        return;
      }

      console.log("📧 Sending notification to funnel owner:", owner.email);

      // Call Edge Function to send email notification
      const { data, error } = await supabase.functions.invoke("send-lead-notification", {
        body: {
          ownerEmail: owner.email,
          ownerName: owner.full_name || owner.username,
          leadName: params.leadName,
          leadEmail: params.leadEmail,
          leadPhone: params.leadPhone,
          leadInterest: params.interest,
          contactMethod: params.contactMethod,
          dashboardUrl: `${window.location.origin}/admin/main-dashboard`
        }
      });

      if (error) {
        console.error("Error sending notification:", error);
      } else {
        console.log("✅ Notification sent successfully");
      }
    } catch (error) {
      console.error("Error in notifyFunnelOwner:", error);
    }
  },

  // Get all leads for a specific user
  async getLeads(userId: string) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    console.log("Get leads for user:", userId, { data, error });
    if (error) throw error;
    return data || [];
  },

  // Update lead status
  async updateLeadStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  },

  // Add note to lead
  async addNote(noteData: {
    lead_id: string;
    note: string;
    created_by: string;
  }) {
    const { data, error } = await supabase
      .from("lead_notes")
      .insert([{
        lead_id: noteData.lead_id,
        note: noteData.note,
        created_by: noteData.created_by,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get notes for a lead
  async getLeadNotes(leadId: string) {
    // First get the notes
    const { data: notes, error } = await supabase
      .from("lead_notes")
      .select("id, lead_id, note, created_at, created_by")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error loading notes:", error);
      throw error;
    }

    if (!notes || notes.length === 0) {
      return [];
    }

    // Get unique user IDs
    const userIds = [...new Set(notes.map(n => n.created_by))];

    // Get profiles for those users
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username, email")
      .in("id", userIds);

    // Map profiles to notes
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    
    return notes.map(note => ({
      ...note,
      profiles: profileMap.get(note.created_by) || null
    }));
  },

  // Get message templates
  async getMessageTemplates() {
    const { data, error } = await supabase
      .from("message_templates")
      .select("*")
      .order("created_at", { ascending: true });
    
    console.log("Get templates:", { data, error });
    if (error) throw error;
    return data || [];
  },

  // Delete lead
  async deleteLead(id: string) {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);
      
    return { error };
  },

  async addLeadNote(leadId: string, note: string) {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error("No session");
    
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: leadId,
        created_by: session.data.session.user.id,
        note: note
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error adding note:", error);
      throw error;
    }
    return data;
  }
};