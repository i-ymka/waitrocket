"use server";
import { auth } from "@clerk/nextjs/server";
import { createPaddleTransaction } from "@/lib/paddle";

export type StartCheckoutResult =
  | { ok: true; transactionId: string }
  | { ok: false; error: string };

export async function startWaitlistCheckout(): Promise<StartCheckoutResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthorized" };
  try {
    const transaction = await createPaddleTransaction({
      items: [{ price_id: process.env.PADDLE_WAITLIST_PRO_PRICE_ID!, quantity: 1 }],
      custom_data: { clerk_user_id: userId },
    });
    // Paddle Billing returns the hosted-checkout URL on the transaction, but the
    // seller account's Default Payment Link points to a different product domain
    // (creatdrop.com) — so we DO NOT use transaction.checkout.url. Instead we
    // return the transactionId and let the client open the Paddle overlay on
    // waitrocket itself via Paddle.js. Never leaves the user's current page.
    return { ok: true, transactionId: transaction.id };
  } catch (err) {
    console.error("[waitlist-checkout] createPaddleTransaction failed", err);
    return { ok: false, error: "paddle_create_failed" };
  }
}
