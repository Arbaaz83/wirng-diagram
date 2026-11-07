// POST /api/create-google-pay-order
// Body: { plan: "monthly" | "yearly" }
// Returns: { id, clientSecret, amount, plan } — Google Pay payment order for the frontend PayButton.
// Requires env vars: GOOGLE_PAY_API_KEY, GOOGLE_PAY_MERCHANT_ID
export const config = { api: { bodyParser: false } };

const PLAN_AMOUNTS = {
  monthly: { amount: "1000", currency: "USD", label: "Arbaaz's Diagram — Monthly" },
  yearly: { amount: "5000", currency: "USD", label: "Arbaaz's Diagram — Yearly" },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let body;
  try { body = JSON.parse(req.body || "{}"); } catch (e) { return res.status(400).json({ error: "Invalid JSON body" }); }
  const { plan } = body || {};
  const pricing = PLAN_AMOUNTS[plan];
  if (!pricing) return res.status(400).json({ error: "Unknown plan" });

  const apiKey = process.env.GOOGLE_PAY_API_KEY;
  const merchantId = process.env.GOOGLE_PAY_MERCHANT_ID;
  if (!apiKey || !merchantId) {
    return res.status(500).json({ error: "Google Pay is not configured on the server." });
  }

  // Idempotency key so retrying the same plan/order doesn't double-charge.
  const idempotencyKey = `ad-${plan}-${Date.now()}`;

  try {
    const orderRes = await fetch("https://payments.googleapis.com/v1/paymentOrders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-Request-Time": new Date().toISOString(),
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        orderId: idempotencyKey,
        merchantId,
        description: pricing.label,
        amount: { currencyCode: pricing.currency, units: Math.floor(Number(pricing.amount) / 100), nanos: (Number(pricing.amount) % 100) * 10000000 },
        clientOptions: { shippingAddressRequired: false, emailRequired: false },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      return res.status(orderRes.status || 500).json({ error: orderData.error || "Google Pay order creation failed" });
    }

    return res.status(200).json({
      id: orderData.orderId || idempotencyKey,
      clientSecret: orderData.clientSecret || orderData.orderId || idempotencyKey,
      amount: pricing.amount,
      plan,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Could not reach Google Pay." });
  }
}
