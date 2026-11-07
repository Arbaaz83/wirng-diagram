// POST /api/verify-payment
// Body: { orderId, clientSecret, paymentData }
// Returns: { active, orderId } — confirms the Google Pay payment completed.
// Requires env vars: GOOGLE_PAY_API_KEY, GOOGLE_PAY_MERCHANT_ID
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let body;
  try { body = JSON.parse(req.body || "{}"); } catch (e) { return res.status(400).json({ error: "Invalid JSON body" }); }
  const { orderId, clientSecret, paymentData } = body || {};
  if (!orderId || !clientSecret) return res.status(400).json({ error: "orderId and clientSecret are required" });

  const apiKey = process.env.GOOGLE_PAY_API_KEY;
  const merchantId = process.env.GOOGLE_PAY_MERCHANT_ID;
  if (!apiKey || !merchantId) {
    return res.status(500).json({ error: "Google Pay is not configured on the server." });
  }

  try {
    // Confirm the payment order with Google Pay.
    const confirmRes = await fetch(`https://payments.googleapis.com/v1/paymentOrders/${encodeURIComponent(orderId)}:confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({ clientSecret }),
    });

    const confirmData = await confirmRes.json();
    const active = confirmRes.ok && (confirmData.paymentState === "SUCCESS" || confirmData.paymentState === "PAYMENT_STATE_SUCCESS");

    return res.status(200).json({ active, orderId, paymentState: confirmData.paymentState });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Payment verification failed." });
  }
}
