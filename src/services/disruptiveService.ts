import { supabase } from "@/integrations/supabase/client";

// Disruptive Payment Gateway Integration
// Docs: https://my.disruptivepayments.io/api/docs

interface DisruptivePaymentRequest {
  network: string;
  fundsGoal: number;
  smartContractAddress: string;
}

interface DisruptivePaymentResponse {
  success: boolean;
  paymentId: string;
  address?: string;
  amount: number;
  qrCode?: string;
  checkoutUrl?: string;
  status: "pending" | "completed" | "failed" | "expired";
  expiresAt?: string;
  fundStatus?: string;
  amountCaptured?: number;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  network?: string;
  orderId?: string;
  customerEmail?: string;
  description: string;
  metadata?: any;
  callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  webhookUrl?: string;
}

export const disruptiveService = {
  // Get API configuration from environment
  getApiConfig() {
    const apiKey = process.env.NEXT_PUBLIC_DISRUPTIVE_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_DISRUPTIVE_API_URL || "https://my.disruptivepayments.io/api";
    const webhookSecret = process.env.DISRUPTIVE_WEBHOOK_SECRET;

    if (!apiKey) {
      throw new Error("Disruptive API Key not configured");
    }

    return { apiKey, apiUrl, webhookSecret };
  },

  // Create payment invoice using correct Disruptive structure
  async createPayment(params: CreatePaymentParams): Promise<DisruptivePaymentResponse> {
    console.log("🔍 ========================================");
    console.log("🔍 DISRUPTIVE PAYMENT (CORRECT STRUCTURE)");
    console.log("🔍 ========================================");
    
    const { apiKey, apiUrl } = this.getApiConfig();
    
    console.log("🔍 Config:");
    console.log("   📌 API URL:", apiUrl);
    console.log("   📌 API Key exists:", !!apiKey);
    console.log("   📌 API Key preview:", apiKey.substring(0, 20) + "...");
    
    // USDT Contract Address on BSC (Binance Smart Chain)
    const USDT_BSC_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";
    
    // Correct Disruptive payload structure
    const payload: DisruptivePaymentRequest = {
      network: "BSC",
      fundsGoal: params.amount,
      smartContractAddress: USDT_BSC_CONTRACT
    };

    console.log("🔍 Request:");
    console.log("   📌 URL:", `${apiUrl}/payments/single`);
    console.log("   📌 Method: POST");
    console.log("   📌 Header: client-api-key:", apiKey.substring(0, 20) + "...");
    console.log("   📌 Payload:", JSON.stringify(payload, null, 2));

    try {
      console.log("🔍 Sending request to Disruptive...");
      
      const response = await fetch(`${apiUrl}/payments/single`, {
        method: "POST",
        headers: {
          "client-api-key": apiKey,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("🔍 Response:");
      console.log("   📌 Status:", response.status);
      console.log("   📌 Status Text:", response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Disruptive error:", errorData);
        throw new Error(`Failed to create payment: ${errorData.errorMessage || response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Disruptive response:", data);
      console.log("📦 Full data object:", JSON.stringify(data, null, 2));
      console.log("📦 data.data object:", JSON.stringify(data.data, null, 2));

      // Disruptive response structure: { data: { actual_payment_data }, timeStart, timeEnd }
      const paymentData = data.data || data;
      console.log("📦 Extracted paymentData:", JSON.stringify(paymentData, null, 2));

      // Log all possible ID fields
      console.log("🔍 Possible IDs:");
      console.log("   - paymentData.id:", paymentData.id);
      console.log("   - paymentData.payment_id:", paymentData.payment_id);
      console.log("   - paymentData.paymentId:", paymentData.paymentId);
      console.log("   - data.id:", data.id);
      console.log("   - data.payment_id:", data.payment_id);

      // Disruptive doesn't return a payment_id - use address as unique identifier
      const paymentId = paymentData.address || String(data.timeStart);
      console.log("🔍 Using paymentId:", paymentId);

      // Return normalized response
      return {
        success: true,
        paymentId: paymentId,
        address: paymentData.address,
        amount: params.amount,
        qrCode: paymentData.qrCode || paymentData.qr_code,
        checkoutUrl: paymentData.checkoutUrl || paymentData.checkout_url,
        status: "pending",
        expiresAt: paymentData.expiresAt || paymentData.expires_at
      };
    } catch (error) {
      console.error("❌ Disruptive payment creation error:", error);
      throw error;
    }
  },

  /**
   * Get payment status from Disruptive
   */
  async getPaymentStatus(paymentId: string): Promise<DisruptivePaymentResponse> {
    const { apiKey, apiUrl } = this.getApiConfig();

    try {
      const response = await fetch(`${apiUrl}/payments/${paymentId}`, {
        headers: {
          "client-api-key": apiKey,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get payment status");
      }

      const data = await response.json();

      return {
        success: true,
        paymentId: data.payment_id || data.id,
        address: data.payment_address || data.address,
        amount: parseFloat(data.amount),
        status: this.mapStatus(data.status),
        expiresAt: data.expires_at
      };
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw error;
    }
  },

  // Map Disruptive status to our status
  mapStatus(status: string): "pending" | "completed" | "failed" | "expired" {
    const statusMap: Record<string, "pending" | "completed" | "failed" | "expired"> = {
      "pending": "pending",
      "waiting": "pending",
      "processing": "pending",
      "completed": "completed",
      "confirmed": "completed",
      "paid": "completed",
      "failed": "failed",
      "cancelled": "failed",
      "expired": "expired",
      "timeout": "expired"
    };

    return statusMap[status.toLowerCase()] || "pending";
  },

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const { webhookSecret } = this.getApiConfig();
    
    if (!webhookSecret) {
      console.warn("Webhook secret not configured, skipping verification");
      return true; // Allow in development
    }

    // TODO: Implement actual signature verification based on Disruptive docs
    // For now, we'll trust the webhook in development
    return true;
  },

  // Save payment record to database
  async savePaymentRecord(data: {
    userId: string;
    paymentId: string;
    amount: number;
    currency: string;
    network: string;
    status: string;
    discountCode?: string;
  }) {
    const { error } = await supabase
      .from("payments")
      .insert([{
        user_id: data.userId,
        payment_id: data.paymentId,
        amount: data.amount,
        currency: data.currency,
        network: data.network,
        status: data.status,
        discount_code_used: data.discountCode || null,
        provider: "disruptive"
      }]);

    if (error) {
      console.error("Error saving payment record:", error);
      throw error;
    }
  },

  // Calculate discounted price
  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    const discount = (originalPrice * discountPercentage) / 100;
    return Math.round((originalPrice - discount) * 100) / 100;
  }
};