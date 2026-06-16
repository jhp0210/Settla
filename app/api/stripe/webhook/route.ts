import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe needs the raw, unparsed body to verify the signature.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return new Response(`Webhook signature verification failed: ${msg}`, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      // Payment succeeded → grant Pro and remember the customer for later cancellation.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.user_id;
        if (userId) {
          await supabase
            .from("profiles")
            .update({
              plan: "pro",
              stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        }
        break;
      }

      // Subscription canceled / lapsed → downgrade back to Free.
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
        await supabase
          .from("profiles")
          .update({ plan: "free", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch {
    // Returning 500 tells Stripe to retry; the handlers above are idempotent.
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
