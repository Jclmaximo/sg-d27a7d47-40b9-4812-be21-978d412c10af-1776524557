import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;
export type LeadNote = Tables<"lead_notes">;
export type MessageTemplate = Tables<"message_templates">;

export const leadsService = {
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

  // Create lead (from funnel)
  async createLead(leadData: Omit<Lead, "id" | "created_at" | "updated_at" | "status" | "source" | "user_id"> & { user_id?: string | null }) {
    const { data, error } = await supabase
      .from("leads")
      .insert([leadData])
      .select()
      .single();
    
    console.log("Create lead:", { data, error });
    if (error) throw error;
    return data;
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: Lead["status"]) {
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