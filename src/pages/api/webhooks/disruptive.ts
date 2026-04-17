import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import { disruptiveService } from "@/services/disruptiveService";
import { subscriptionService } from "@/services/subscriptionService";
import { discountService } from "@/services/discountService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get webhook signature from headers
    const signature = req.headers["x-disruptive-signature"] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!disruptiveService.verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Parse webhook data
    const { payment_id, status, amount, user_id, order_id, discount_code, fundStatus, amountCaptured } = req.body;

    console.log("Disruptive webhook received:", { payment_id, status, fundStatus, amountCaptured, user_id });

    // Update payment record in database
    const { error: updateError } = await supabase
      .from("payments")
      .update({ status: fundStatus === "FUNDED" ? "completed" : status })
      .eq("payment_id", payment_id);

    if (updateError) {
      console.error("Error updating payment:", updateError);
    }

    // If payment is FUNDED (completed), activate subscription
    if (fundStatus === "FUNDED" && amountCaptured > 0) {
      // Determine if this is initial payment or renewal based on amount
      const isInitialPayment = amount >= 39.50; // Minimum with 50% discount on $79

      // Get discount percentage if code was used
      let discountPercentage = 0;
      if (discount_code) {
        const discountResult = await discountService.validateDiscountCode(discount_code);
        if (discountResult.valid && discountResult.discount) {
          discountPercentage = discountResult.discount.discount_percentage;
          // Increment usage count
          await discountService.incrementUsage(discount_code);
        }
      }

      const originalPrice = isInitialPayment ? 79 : 10;
      const finalPrice = amount;

      if (isInitialPayment) {
        // Create initial subscription
        await subscriptionService.createInitialSubscription(
          user_id,
          payment_id,
          discount_code,
          discountPercentage,
          originalPrice,
          finalPrice
        );
      } else {
        // Renew subscription
        await subscriptionService.renewSubscription(
          user_id,
          payment_id,
          discount_code,
          discountPercentage,
          originalPrice,
          finalPrice
        );
      }

      console.log("✅ Subscription activated successfully");

      return res.status(200).json({ 
        success: true,
        message: "Subscription activated",
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/main-dashboard`
      });
    }

    // Respond to webhook
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}