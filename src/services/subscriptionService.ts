import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Subscription = Tables<"subscriptions">;
export type AdminSettings = Tables<"admin_settings">;

export const subscriptionService = {
  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gte("end_date", new Date().toISOString())
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Check subscription error:", error);
      return false;
    }

    return !!data;
  },

  // Get user subscription
  async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Create subscription after payment
  async createSubscription(subscriptionData: {
    user_id: string;
    price_usd: number;
    transaction_hash: string;
    wallet_address: string;
  }) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([{
        ...subscriptionData,
        status: "active",
        plan_type: "monthly",
        payment_method: "usdt_bsc",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get/Create admin settings
  async getAdminSettings(userId: string) {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Update admin settings (WhatsApp number)
  async updateAdminSettings(userId: string, settings: Partial<AdminSettings>) {
    const { data, error } = await supabase
      .from("admin_settings")
      .upsert([{
        user_id: userId,
        ...settings
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};