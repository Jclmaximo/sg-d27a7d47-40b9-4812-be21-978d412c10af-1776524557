import { supabase } from "@/integrations/supabase/client";

export interface DiscountCode {
  id: string;
  code: string;
  discount_percentage: number;
  description: string;
  is_active: boolean;
  usage_limit: number | null;
  times_used: number;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export const discountService = {
  // Validate and get discount code details
  async validateDiscountCode(code: string): Promise<{
    valid: boolean;
    discount?: DiscountCode;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        return { valid: false, error: "Código de descuento inválido" };
      }

      // Check if code has expired
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        return { valid: false, error: "Este código ha expirado" };
      }

      // Check if code has reached usage limit
      if (data.usage_limit && data.times_used >= data.usage_limit) {
        return { valid: false, error: "Este código ha alcanzado su límite de uso" };
      }

      return { valid: true, discount: data };
    } catch (error) {
      console.error("Error validating discount code:", error);
      // Fail silently - don't block the UI
      return { valid: false, error: "No se pudo validar el código. Continúa sin descuento." };
    }
  },

  // Calculate discounted price
  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    const discount = (originalPrice * discountPercentage) / 100;
    return Math.round((originalPrice - discount) * 100) / 100; // Round to 2 decimals
  },

  // Increment usage count for a discount code
  async incrementUsage(code: string): Promise<void> {
    try {
      const { data: currentCode } = await supabase
        .from("discount_codes")
        .select("times_used")
        .eq("code", code.toUpperCase())
        .single();

      if (currentCode) {
        await supabase
          .from("discount_codes")
          .update({ times_used: currentCode.times_used + 1 })
          .eq("code", code.toUpperCase());
      }
    } catch (error) {
      console.error("Error incrementing usage:", error);
    }
  },

  // Get all active discount codes (admin only)
  async getAllDiscountCodes(): Promise<DiscountCode[]> {
    try {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .order("discount_percentage", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching discount codes:", error);
      return [];
    }
  }
};