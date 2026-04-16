import { supabase } from "@/integrations/supabase/client";

// Disruptive Payment Gateway Integration
// Docs: https://docs.disruptive.com (update with actual docs URL)

interface DisruptivePaymentRequest {
  amount: number;
  currency: string; // "USDT"
  network: string; // "BSC"
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

export const disruptiveService = {
  // Get API configuration from environment
  getApiConfig() {
    const apiKey = process.env.NEXT_PUBLIC_DISRUPTIVE_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_DISRUPTIVE_API_URL || "https://api.disruptive.com/v1";
    const webhookSecret = process.env.DISRUPTIVE_WEBHOOK_SECRET;

    if (!apiKey) {
      throw new Error("Disruptive API Key not configured");
    }

    return { apiKey, apiUrl, webhookSecret };
  },

  // Create payment invoice
  async createPayment(request: DisruptivePaymentRequest): Promise<DisruptivePaymentResponse> {
    const { apiKey, apiUrl } = this.getApiConfig();

    try {
      const response = await fetch(`${apiUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`, // Update based on actual Disruptive format
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          network: request.network,
          order_id: request.orderId,
          description: request.description,
          customer_email: request.customerEmail,
          webhook_url: request.webhookUrl
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment");
      }

      const data = await response.json();

      // Map Disruptive response to our interface
      // Update this based on actual Disruptive API response structure
      return {
        success: true,
        paymentId: data.id || data.payment_id,
        address: data.address || data.payment_address,
        amount: data.amount,
        qrCode: data.qr_code,
        checkoutUrl: data.checkout_url,
        status: data.status || "pending",
        expiresAt: data.expires_at
      };
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
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get payment status");
      }

      const data = await response.json();

      return {
        success: true,
        paymentId: data.id || data.payment_id,
        address: data.address,
        amount: data.amount,
        status: data.status,
        expiresAt: data.expires_at
      };
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw error;
    }
  },

  // Verify webhook signature (implement based on Disruptive docs)
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const { webhookSecret } = this.getApiConfig();
    
    if (!webhookSecret) {
      console.warn("Webhook secret not configured");
      return false;
    }

    // TODO: Implement signature verification based on Disruptive documentation
    // This is typically done with HMAC SHA256
    // Example:
    // const expectedSignature = crypto
    //   .createHmac('sha256', webhookSecret)
    //   .update(payload)
    //   .digest('hex');
    // return signature === expectedSignature;

    return true; // Placeholder - implement actual verification
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
  }
};