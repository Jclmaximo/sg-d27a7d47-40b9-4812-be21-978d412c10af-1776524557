import { supabase } from "@/integrations/supabase/client";

// Disruptive Payment Gateway Integration
// Docs: https://my.disruptivepayments.io/api/docs

interface DisruptivePaymentRequest {
  amount: number;
  currency: string;
  network: string;
  orderId: string;
  description: string;
  customerEmail?: string;
  webhookUrl?: string;
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

  // Create payment invoice
  async createPayment(params: CreatePaymentParams): Promise<DisruptivePaymentResponse> {
    // CRITICAL DEBUG - Check API key FIRST
    console.log("🔍 ========================================");
    console.log("🔍 DISRUPTIVE PAYMENT DEBUG - START");
    console.log("🔍 ========================================");
    
    const envApiKey = process.env.NEXT_PUBLIC_DISRUPTIVE_API_KEY;
    console.log("🔍 STEP 1: Raw environment variable");
    console.log("   📌 Variable name: NEXT_PUBLIC_DISRUPTIVE_API_KEY");
    console.log("   📌 Exists:", !!envApiKey);
    console.log("   📌 Length:", envApiKey?.length || 0);
    console.log("   📌 Preview:", envApiKey ? envApiKey.substring(0, 20) + "..." : "❌ MISSING");
    
    const { apiKey, apiUrl } = this.getApiConfig();
    
    console.log("🔍 STEP 2: After getApiConfig()");
    console.log("   📌 API URL:", apiUrl);
    console.log("   📌 API Key exists:", !!apiKey);
    console.log("   📌 API Key length:", apiKey?.length || 0);
    console.log("   📌 API Key preview:", apiKey ? apiKey.substring(0, 20) + "..." : "❌ MISSING");
    
    if (!apiKey) {
      console.error("❌ API KEY IS MISSING - CANNOT PROCEED");
      throw new Error("Disruptive API key not configured");
    }

    const payload = {
      amount: params.amount,
      currency: params.currency,
      network: params.network,
      orderId: params.orderId,
      customerEmail: params.customerEmail,
      description: params.description,
      metadata: params.metadata,
      callback_url: params.callback_url,
      success_url: params.success_url,
      cancel_url: params.cancel_url,
      webhookUrl: params.webhookUrl
    };

    const authHeader = `Bearer ${apiKey}`;
    
    console.log("🔍 STEP 3: Request preparation");
    console.log("   📌 Full URL:", `${apiUrl}/payments`);
    console.log("   📌 Authorization header:", authHeader.substring(0, 30) + "...");
    console.log("   📌 Payload:", JSON.stringify(payload, null, 2));

    try {
      console.log("🔍 STEP 4: Sending request to Disruptive...");
      
      const response = await fetch(`${apiUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("🔍 STEP 5: Response received");
      console.log("   📌 Status:", response.status);
      console.log("   📌 Status Text:", response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Disruptive response:", { errorCode: errorData.errorCode, errorMessage: errorData.errorMessage });
        throw new Error(`Failed to create payment: ${errorData.errorMessage || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Disruptive payment creation error:", error);
      throw error;
    }
  },

  // Check payment status
  async getPaymentStatus(paymentId: string): Promise<DisruptivePaymentResponse> {
    const { apiKey, apiUrl } = this.getApiConfig();

    try {
      const response = await fetch(`${apiUrl}/payments/${paymentId}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
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