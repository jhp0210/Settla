import { createClient } from "@/lib/supabase/server";
import { getStripe, PRO_PRICE_CENTS, PRO_TRIAL_DAYS } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Sign in to upgrade" }, { status: 401 });
  }

  // Build absolute return URLs from the request origin (no extra env var needed).
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      // client_reference_id ties the payment back to the Supabase user in the webhook.
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PRO_PRICE_CENTS,
            recurring: { interval: "month" },
            product_data: { name: "Settla Pro", description: "Unlimited searches and 3 comparison slots" },
          },
        },
      ],
      // Free trial: the subscription starts "trialing" (Pro active immediately via the
      // webhook), and Stripe auto-charges $10/mo when the trial ends. A card is collected
      // upfront (Checkout subscription mode default) so conversion is automatic.
      subscription_data: { trial_period_days: PRO_TRIAL_DAYS },
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/pricing`,
      metadata: { user_id: user.id },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Checkout failed";
    return Response.json({ error: msg }, { status: 502 });
  }
}
