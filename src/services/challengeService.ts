import { supabase } from "@/integrations/supabase/client";

export interface ChallengeProtocol {
  id: string;
  label: string;
  points: number;
  completed?: boolean;
}

export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string | null;
  duration_hours: number;
  protocols: ChallengeProtocol[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserChallengeProgress {
  id: string;
  user_id: string;
  template_id: string | null;
  started_at: string;
  protocols_completed: string[];
  copy_count: number;
  leads_captured: number;
  status: "active" | "completed" | "expired";
  created_at: string;
  updated_at: string;
}

class ChallengeService {
  /**
   * Get the active challenge template (admin-managed)
   */
  async getActiveTemplate(): Promise<ChallengeTemplate | null> {
    try {
      const { data, error } = await supabase
        .from("challenge_templates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching active template:", error);
        return null;
      }

      return data as unknown as ChallengeTemplate;
    } catch (error) {
      console.error("Error in getActiveTemplate:", error);
      return null;
    }
  }

  /**
   * Get all challenge templates (admin only)
   */
  async getAllTemplates(): Promise<ChallengeTemplate[]> {
    try {
      const { data, error } = await supabase
        .from("challenge_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching templates:", error);
        return [];
      }

      return (data || []) as unknown as ChallengeTemplate[];
    } catch (error) {
      console.error("Error in getAllTemplates:", error);
      return [];
    }
  }

  /**
   * Create a new challenge template (admin only)
   */
  async createTemplate(
    name: string,
    description: string,
    protocols: ChallengeProtocol[],
    durationHours: number = 24
  ): Promise<{ success: boolean; data?: ChallengeTemplate; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("challenge_templates")
        .insert({
          name,
          description,
          protocols: protocols as any,
          duration_hours: durationHours,
          is_active: false
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as unknown as ChallengeTemplate };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Update an existing challenge template (admin only)
   */
  async updateTemplate(
    templateId: string,
    updates: {
      name?: string;
      description?: string;
      protocols?: ChallengeProtocol[];
      duration_hours?: number;
      is_active?: boolean;
    }
  ): Promise<{ success: boolean; data?: ChallengeTemplate; error?: string }> {
    try {
      const updateData: any = { ...updates };
      
      const { data, error } = await supabase
        .from("challenge_templates")
        .update(updateData)
        .eq("id", templateId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as unknown as ChallengeTemplate };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Start a new challenge for a user
   */
  async startUserChallenge(
    userId: string,
    templateId?: string
  ): Promise<{ success: boolean; data?: UserChallengeProgress; error?: string }> {
    try {
      // If no template ID provided, get the active template
      let finalTemplateId = templateId;
      if (!finalTemplateId) {
        const activeTemplate = await this.getActiveTemplate();
        if (!activeTemplate) {
          return { success: false, error: "No active template found" };
        }
        finalTemplateId = activeTemplate.id;
      }

      const { data, error } = await supabase
        .from("user_challenge_progress")
        .insert({
          user_id: userId,
          template_id: finalTemplateId,
          started_at: new Date().toISOString(),
          protocols_completed: [],
          copy_count: 0,
          leads_captured: 0,
          status: "active"
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as UserChallengeProgress };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get user's current active challenge
   */
  async getUserActiveChallenge(userId: string): Promise<UserChallengeProgress | null> {
    try {
      const { data, error } = await supabase
        .from("user_challenge_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching user challenge:", error);
        return null;
      }

      return data as UserChallengeProgress;
    } catch (error) {
      console.error("Error in getUserActiveChallenge:", error);
      return null;
    }
  }

  /**
   * Update user's challenge progress
   */
  async updateUserProgress(
    progressId: string,
    updates: {
      protocols_completed?: string[];
      copy_count?: number;
      leads_captured?: number;
      status?: "active" | "completed" | "expired";
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("user_challenge_progress")
        .update(updates)
        .eq("id", progressId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get all users' challenge progress (admin only)
   */
  async getAllUsersProgress(): Promise<UserChallengeProgress[]> {
    try {
      const { data, error } = await supabase
        .from("user_challenge_progress")
        .select("*, profiles(full_name, username, email)")
        .order("started_at", { ascending: false });

      if (error) {
        console.error("Error fetching all progress:", error);
        return [];
      }

      return (data || []) as UserChallengeProgress[];
    } catch (error) {
      console.error("Error in getAllUsersProgress:", error);
      return [];
    }
  }

  /**
   * Subscribe to template changes (realtime)
   */
  subscribeToTemplateChanges(callback: (template: ChallengeTemplate) => void) {
    const channel = supabase
      .channel("challenge_templates_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "challenge_templates",
          filter: "is_active=eq.true"
        },
        (payload) => {
          console.log("Template updated:", payload);
          callback(payload.new as ChallengeTemplate);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe to user progress changes (realtime for admin)
   */
  subscribeToAllProgressChanges(callback: (progress: UserChallengeProgress) => void) {
    const channel = supabase
      .channel("all_user_progress_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_challenge_progress"
        },
        (payload) => {
          console.log("User progress updated:", payload);
          callback(payload.new as UserChallengeProgress);
        }
      )
      .subscribe();

    return channel;
  }
}

export const challengeService = new ChallengeService();