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
        status: "new",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      throw error;
    }

    // Send notification to funnel owner
    if (data) {
      await this.notifyFunnelOwner({
        leadId: data.id,
        leadName: leadData.name,
        leadEmail: leadData.email,
        leadPhone: leadData.phone,
        ownerId: leadData.user_id,
        interest: leadData.interest || "No especificado",
        contactMethod: leadData.contact_method || "whatsapp"
      });
    }

    return { data, error };
  },

  /**
   * Notify funnel owner about new lead
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

  // Get all leads
  async getLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    
    console.log("Get leads:", { data, error });
    if (error) throw error;
    return data || [];
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: string) {
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId)
      .select()
      .single();
    
    console.log("Update lead status:", { data, error });
    if (error) throw error;
    return data;
  },

  // Get notes for a lead
  async getLeadNotes(leadId: string) {
    const { data, error } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    
    console.log("Get lead notes:", { data, error });
    if (error) throw error;
    return data || [];
  },

  // Add note to lead
  async addLeadNote(leadId: string, note: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("lead_notes")
      .insert([{ lead_id: leadId, note, created_by: user?.id }])
      .select()
      .single();
    
    console.log("Add lead note:", { data, error });
    if (error) throw error;
    return data;
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
  async deleteLead(leadId: string) {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", leadId);
    
    console.log("Delete lead:", { error });
    if (error) throw error;
  }
};