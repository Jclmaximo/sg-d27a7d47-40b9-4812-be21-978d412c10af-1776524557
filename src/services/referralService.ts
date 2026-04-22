import { supabase } from "@/integrations/supabase/client";

export interface Commission {
  id: string;
  user_id: string;
  referred_user_id: string;
  subscription_id: string;
  amount_usd: number;
  commission_level: number;
  percentage: number;
  status: "pending" | "paid" | "cancelled";
  paid_at: string | null;
  created_at: string;
  referred_user?: {
    email: string;
    full_name: string | null;
    username: string | null;
  };
}

export interface NetworkStats {
  directReferrals: number;
  indirectReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  total_referrals: number;
  total_earned: number;
  available_balance: number;
}

export interface ReferralTreeNode {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  created_at: string;
  level: number;
  children: ReferralTreeNode[];
  totalEarned: number;
}

const COMMISSION_RATES = {
  LEVEL_1: 10, // 10% for direct referrals on all payments
};

export const referralService = {
  /**
   * Process a new user registration with a referral code (username)
   * This links the new user to their referrer in the profiles table
   */
  async processReferral(newUserId: string, referralUsername: string): Promise<boolean> {
    try {
      // 1. Find the referrer by username
      const { data: referrer, error: findError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", referralUsername.toLowerCase())
        .single();

      if (findError || !referrer) {
        console.error("Referrer not found:", referralUsername);
        return false;
      }

      // 2. Link the new user to the referrer
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ referred_by: referrer.id })
        .eq("id", newUserId);

      if (updateError) {
        console.error("Error linking referral:", updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in processReferral:", error);
      return false;
    }
  },

  /**
   * Calculate and create commissions when a new subscription is created
   * Now only creates Level 1 commission (10% for direct referrals)
   */
  async createCommissionsForSubscription(
    subscriberId: string,
    subscriptionId: string,
    pricePaid: number
  ): Promise<void> {
    try {
      // Get the subscriber's profile to find who referred them
      const { data: subscriberProfile, error: profileError } = await supabase
        .from("profiles")
        .select("referred_by")
        .eq("id", subscriberId)
        .single();

      if (profileError || !subscriberProfile?.referred_by) {
        console.log("No referrer found for this subscription");
        return;
      }

      const referrerId = subscriberProfile.referred_by;

      // Level 1 Commission ONLY (10% - Direct referral)
      const level1Amount = (pricePaid * COMMISSION_RATES.LEVEL_1) / 100;
      await supabase.from("commissions").insert({
        user_id: referrerId,
        referred_user_id: subscriberId,
        subscription_id: subscriptionId,
        amount_usd: level1Amount,
        commission_level: 1,
        percentage: COMMISSION_RATES.LEVEL_1,
        status: "pending"
      });

      console.log(`✅ Commission created: $${level1Amount.toFixed(2)} (${COMMISSION_RATES.LEVEL_1}%)`);
    } catch (error) {
      console.error("Error creating commissions:", error);
    }
  },

  /**
   * Get user's commissions with referral details
   */
  async getUserCommissions(userId: string): Promise<Commission[]> {
    const { data, error } = await supabase
      .from("commissions")
      .select(`
        *,
        referred_user:profiles!commissions_referred_user_id_fkey(
          email,
          full_name,
          username
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching commissions:", error);
      return [];
    }

    return (data as unknown as Commission[]) || [];
  },

  /**
   * Get network statistics for a user
   */
  async getNetworkStats(userId: string): Promise<NetworkStats> {
    // Get direct referrals (Level 1)
    const { data: directReferrals, error: directError } = await supabase
      .from("profiles")
      .select("id")
      .eq("referred_by", userId);

    // Get indirect referrals (Level 2)
    const directIds = directReferrals?.map(r => r.id) || [];
    const { data: indirectReferrals, error: indirectError } = await supabase
      .from("profiles")
      .select("id")
      .in("referred_by", directIds);

    // Get commission stats
    const { data: commissions, error: commError } = await supabase
      .from("commissions")
      .select("amount_usd, status")
      .eq("user_id", userId);

    const totalCommissions = commissions?.reduce((sum, c) => sum + Number(c.amount_usd), 0) || 0;
    const pendingCommissions = commissions?.filter(c => c.status === "pending")
      .reduce((sum, c) => sum + Number(c.amount_usd), 0) || 0;
    const paidCommissions = commissions?.filter(c => c.status === "paid")
      .reduce((sum, c) => sum + Number(c.amount_usd), 0) || 0;

    const total_referrals = (directReferrals?.length || 0) + (indirectReferrals?.length || 0);

    return {
      directReferrals: directReferrals?.length || 0,
      indirectReferrals: indirectReferrals?.length || 0,
      totalCommissions,
      pendingCommissions,
      paidCommissions,
      total_referrals,
      total_earned: totalCommissions,
      available_balance: totalCommissions - paidCommissions
    };
  },

  /**
   * Get referral tree for a user (genealogy)
   */
  async getReferralTree(userId: string, maxDepth: number = 2): Promise<ReferralTreeNode | null> {
    const buildTree = async (id: string, level: number): Promise<ReferralTreeNode | null> => {
      if (level > maxDepth) return null;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name, username, created_at")
        .eq("id", id)
        .single();

      if (profileError || !profile) return null;

      // Get direct referrals
      const { data: referrals, error: refError } = await supabase
        .from("profiles")
        .select("id")
        .eq("referred_by", id);

      // Get commissions earned from this user
      const { data: userCommissions, error: commError } = await supabase
        .from("commissions")
        .select("amount_usd")
        .eq("user_id", id);

      const totalEarned = userCommissions?.reduce((sum, c) => sum + Number(c.amount_usd), 0) || 0;

      // Build children recursively
      const children: ReferralTreeNode[] = [];
      if (referrals && level < maxDepth) {
        for (const ref of referrals) {
          const childNode = await buildTree(ref.id, level + 1);
          if (childNode) children.push(childNode);
        }
      }

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        username: profile.username,
        created_at: profile.created_at,
        level,
        children,
        totalEarned
      };
    };

    return buildTree(userId, 0);
  },

  /**
   * Mark commission as paid (Admin only)
   */
  async markCommissionAsPaid(commissionId: string): Promise<void> {
    const { error } = await supabase
      .from("commissions")
      .update({
        status: "paid",
        paid_at: new Date().toISOString()
      })
      .eq("id", commissionId);

    if (error) {
      throw new Error("Error marking commission as paid");
    }
  },

  /**
   * Get all commissions (Admin only)
   */
  async getAllCommissions(): Promise<Commission[]> {
    const { data, error } = await supabase
      .from("commissions")
      .select(`
        *,
        referred_user:profiles!commissions_referred_user_id_fkey(
          email,
          full_name,
          username
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all commissions:", error);
      return [];
    }

    return (data as unknown as Commission[]) || [];
  }
};