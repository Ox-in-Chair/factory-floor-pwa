/* src/lib/stripe.ts */
export async function createCheckoutSession() {
  try {
    const response = await fetch("https://factory-floor-licencev2.mike-e17.workers.dev/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supervisorInitial: "M", return_url: "http://localhost:5173/" })
    });
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    return response.json();
  } catch (err) {
    console.error("Stripe session error:", err);
    throw err;
  }
}
