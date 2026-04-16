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
      .gte("expires_at", new Date().toISOString())
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking subscription:", error);
      return false;
    }

    return !!data;
  },

  // Create initial subscription (with $79 initial payment)
  async createInitialSubscription(userId: string, txHash: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([{
        user_id: userId,
        status: "active",
        payment_method: "usdt_bsc",
        amount: 79.00,
        transaction_hash: txHash,
        expires_at: expiresAt.toISOString(),
        initial_payment_amount: 79.00,
        monthly_payment_amount: 10.00,
        is_initial_payment: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Renew subscription (with $10 monthly payment)
  async renewSubscription(userId: string, txHash: string) {
    // Get current subscription
    const { data: currentSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const expiresAt = new Date();
    if (currentSub && new Date(currentSub.expires_at) > new Date()) {
      // Extend from current expiration
      expiresAt.setTime(new Date(currentSub.expires_at).getTime());
    }
    expiresAt.setDate(expiresAt.getDate() + 30); // Add 30 more days

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([{
        user_id: userId,
        status: "active",
        payment_method: "usdt_bsc",
        amount: 10.00,
        transaction_hash: txHash,
        expires_at: expiresAt.toISOString(),
        initial_payment_amount: 79.00,
        monthly_payment_amount: 10.00,
        is_initial_payment: false
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get subscription details
  async getSubscription(userId: string) {
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
  async updateAdminSettings(userId: string, settings: { whatsapp_number: string; business_name?: string }) {
    const { data, error } = await supabase
      .from("admin_settings")
      .upsert([{
        user_id: userId,
        whatsapp_number: settings.whatsapp_number,
        business_name: settings.business_name || null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};