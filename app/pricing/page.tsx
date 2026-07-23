"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePlan } from "@/context/PlanContext";

const FREE_FEATURES = [
  "5 property searches per day",
  "Compare 2 properties side-by-side",
  "Basic property info",
  "Google sign-in",
];

const PRO_FEATURES = [
  "Unlimited property searches",
  "Compare 3 properties side-by-side",
  "AI match scores",
  "Save & bookmark properties",
  "Search history",
  "Priority support",
];

function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function PricingPage() {
  const { user } = useAuth();
  const { plan, downgradeToFree } = usePlan();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [downgrading, setDowngrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    if (!user) {
      router.push("/login");
      return;
    }
    setUpgrading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Could not start checkout");
      // Hand off to Stripe Checkout; the webhook grants Pro on success.
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUpgrading(false);
    }
  }

  async function handleDowngrade() {
    setDowngrading(true);
    await downgradeToFree();
    setDowngrading(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-20">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[400px] rounded-full bg-violet-900/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            Simple pricing
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Choose your plan
          </h1>
          <p className="text-white/50">
            Start free, upgrade when you need more power.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className={`relative flex flex-col rounded-2xl border bg-white/5 p-8 backdrop-blur-sm ${plan === "free" ? "border-white/20" : "border-white/10"}`}>
            {plan === "free" && (
              <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/60">
                Current plan
              </span>
            )}
            <div className="mb-6">
              <h2 className="mb-1 text-xl font-bold text-white">Free</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="mb-1 text-white/40">/ month</span>
              </div>
            </div>

            <ul className="mb-8 flex flex-col gap-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {plan === "pro" ? (
                <button
                  onClick={handleDowngrade}
                  disabled={downgrading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {downgrading ? "Downgrading..." : "Downgrade to Free"}
                </button>
              ) : (
                <div className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-medium text-white/40">
                  Current plan
                </div>
              )}
            </div>
          </div>

          {/* Pro */}
          <div className={`relative flex flex-col rounded-2xl border p-8 backdrop-blur-sm ${plan === "pro" ? "border-indigo-500/50 bg-indigo-500/10" : "border-indigo-500/30 bg-indigo-500/5"}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
                Most popular
              </span>
            </div>
            {plan === "pro" && (
              <span className="absolute right-4 top-4 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                Current plan
              </span>
            )}

            <div className="mb-6">
              <h2 className="mb-1 text-xl font-bold text-white">Pro</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">$10</span>
                <span className="mb-1 text-white/40">/ month</span>
              </div>
              <p className="mt-1 text-sm font-medium text-indigo-300">7-day free trial</p>
            </div>

            <ul className="mb-8 flex flex-col gap-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {plan === "pro" ? (
                <div className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/20 py-3 text-center text-sm font-medium text-indigo-300">
                  Current plan
                </div>
              ) : (
                <>
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {upgrading ? "Redirecting to checkout..." : "Start your 7-day free trial"}
                  </button>
                  <p className="mt-2 text-center text-xs text-white/40">
                    Free for 7 days, then $10/mo. Cancel anytime.
                  </p>
                  {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
