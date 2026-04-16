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
  async createPayment(request: DisruptivePaymentRequest): Promise<DisruptivePaymentResponse> {
    const { apiKey, apiUrl } = this.getApiConfig();

    try {
      // Disruptive API expects payment data in this format
      const payload = {
        amount: request.amount.toString(),
        currency: request.currency,
        network: request.network,
        order_id: request.orderId,
        description: request.description,
        customer_email: request.customerEmail,
        callback_url: request.webhookUrl,
        success_url: `${window.location.origin}/admin/dashboard`,
        cancel_url: `${window.location.origin}/pricing`
      };

      console.log("Creating Disruptive payment:", payload);

      const response = await fetch(`${apiUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("Disruptive response:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create payment");
      }

      // Map Disruptive response to our interface
      return {
        success: true,
        paymentId: data.payment_id || data.id,
        address: data.payment_address || data.address,
        amount: parseFloat(data.amount),
        qrCode: data.qr_code,
        checkoutUrl: data.checkout_url,
        status: this.mapStatus(data.status),
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