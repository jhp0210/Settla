import Stripe from "stripe";

// Lazily constructed so a missing STRIPE_SECRET_KEY doesn't crash at build/module
// load — only when a Stripe-backed route actually runs. The key is a test key until
// the account is activated for live payments; the whole flow works in test mode.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

export const PRO_PRICE_CENTS = 1000; // $10/mo, matches the /pricing page
export const PRO_TRIAL_DAYS = 7; // free trial before the first charge
