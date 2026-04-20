import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type MWRLead = Tables<"mwr_leads">;
type MWRLeadInsert = TablesInsert<"mwr_leads">;

export const mwrLeadsService = {
  /**
   * Create a new MWR lead
   */
  async createLead(leadData: MWRLeadInsert): Promise<{ data: MWRLead | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("mwr_leads")
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error("Error creating MWR lead:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error creating MWR lead:", err);
      return { data: null, error: err };
    }
  },

  /**
   * Get all MWR leads (admin only)
   */
  async getAllLeads(): Promise<{ data: MWRLead[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("mwr_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching MWR leads:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error fetching MWR leads:", err);
      return { data: null, error: err };
    }
  },

  /**
   * Get leads by status
   */
  async getLeadsByStatus(estado: string): Promise<{ data: MWRLead[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("mwr_leads")
        .select("*")
        .eq("estado", estado)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads by status:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error fetching leads by status:", err);
      return { data: null, error: err };
    }
  },

  /**
   * Update lead status
   */
  async updateLeadStatus(
    leadId: string,
    estado: string,
    notas?: string
  ): Promise<{ data: MWRLead | null; error: any }> {
    try {
      const updateData: any = {
        estado,
        updated_at: new Date().toISOString()
      };

      if (notas) {
        updateData.notas = notas;
      }

      const { data, error } = await supabase
        .from("mwr_leads")
        .update(updateData)
        .eq("id", leadId)
        .select()
        .single();

      if (error) {
        console.error("Error updating lead status:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error updating lead status:", err);
      return { data: null, error: err };
    }
  },

  /**
   * Get leads by referrer
   */
  async getLeadsByReferrer(referrerUsername: string): Promise<{ data: MWRLead[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("mwr_leads")
        .select("*")
        .eq("referrer_username", referrerUsername)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads by referrer:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error fetching leads by referrer:", err);
      return { data: null, error: err };
    }
  },

  /**
   * Get lead statistics
   */
  async getLeadStats(): Promise<{
    data: {
      total: number;
      nuevo: number;
      contactado: number;
      interesado: number;
      cerrado: number;
      perdido: number;
    } | null;
    error: any;
  }> {
    try {
      const { data: allLeads, error } = await supabase
        .from("mwr_leads")
        .select("estado");

      if (error) {
        console.error("Error fetching lead stats:", error);
        return { data: null, error };
      }

      const stats = {
        total: allLeads?.length || 0,
        nuevo: allLeads?.filter(l => l.estado === "nuevo").length || 0,
        contactado: allLeads?.filter(l => l.estado === "contactado").length || 0,
        interesado: allLeads?.filter(l => l.estado === "interesado").length || 0,
        cerrado: allLeads?.filter(l => l.estado === "cerrado").length || 0,
        perdido: allLeads?.filter(l => l.estado === "perdido").length || 0
      };

      return { data: stats, error: null };
    } catch (err) {
      console.error("Unexpected error fetching lead stats:", err);
      return { data: null, error: err };
    }
  }
};