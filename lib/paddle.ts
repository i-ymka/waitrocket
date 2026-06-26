// Paddle Billing v2 — server-side API helper.
// Docs: https://developer.paddle.com/api-reference/transactions/create-transaction
//
// Set PADDLE_API_URL=https://api.paddle.com for production.
// Default points at the sandbox so test keys work out of the box.

const PADDLE_API_URL =
  process.env.PADDLE_API_URL ?? "https://sandbox-api.paddle.com";

type PaddleItem =
  | { price_id: string; quantity: number }
  | {
      price: {
        description: string;
        unit_price: { amount: string; currency_code: string };
        // PADDLE_PRODUCT_ID must point to an existing Paddle product.
        // Create a "Digital Product" in the Paddle dashboard and set this env var.
        product_id: string;
      };
      quantity: number;
    };

export async function createPaddleTransaction(body: {
  items: PaddleItem[];
  checkout?: { url: string };
  custom_data?: Record<string, string>;
}): Promise<{ id: string; checkout: { url: string | null } }> {
  const res = await fetch(`${PADDLE_API_URL}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paddle API ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.data as { id: string; checkout: { url: string } };
}
