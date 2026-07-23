"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "../components/Navbar";

const FAQS = [
  {
    q: "What is Settla?",
    a: "Settla is a tool for home buyers who are weighing a few options. Search real listings, bookmark the homes you've toured, and line them up side by side so you can compare price, size, beds, baths, and year built at a glance — without juggling browser tabs and spreadsheets.",
  },
  {
    q: "Is Settla free?",
    a: "Yes. The Free plan includes up to 5 property searches per day and lets you compare 2 homes side by side. The Pro plan unlocks unlimited searches, a third comparison slot, and AI match scores. You can see the full breakdown on the Pricing page.",
  },
  {
    q: "Where do the listings come from?",
    a: "Listings are pulled live from a real estate data provider, so you're searching current homes on the market. Search by ZIP code or by city and state (for example \"98122\" or \"Seattle, WA\"), then narrow down with the price, bedroom, and bathroom filters.",
  },
  {
    q: "How does the comparison work?",
    a: "As you browse, bookmark any listing you like. Your saved homes stay in one place across sessions. When you're ready, pick the ones you're deciding between and Settla lays them out in a single table — the best value in each row is highlighted so the trade-offs are obvious.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse listings on the landing page without signing in. To save homes and compare them, you'll need a free account. You can sign in with Google in one click, or create an account with your email and password.",
  },
  {
    q: "Are my saved homes private?",
    a: "Yes. Your saved properties and notes are tied to your account and are only visible to you. Signing in with Google only shares the basic profile information needed to create your account.",
  },
  {
    q: "What are AI match scores?",
    a: "On the Pro plan, Settla can analyze a property and surface an AI-generated summary — neighborhood context, a price range read, and pros and cons — to give you a quick second opinion alongside the raw numbers.",
  },
  {
    q: "How do I upgrade or cancel?",
    a: "Head to the Pricing page and choose Pro to upgrade, or switch back to Free at any time from the same page. Your saved homes stay put either way.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-gray-900 md:text-lg">{q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-[#166534] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 pr-8 text-sm leading-relaxed text-gray-600 md:text-base">{a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Navbar />

      <main className="relative overflow-hidden px-4 pb-20 pt-16">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[340px] bg-gradient-to-b from-green-50 via-[#F8F7F4] to-[#F8F7F4]" />
        <div className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl" />

        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#166534]/20 bg-[#166534]/5 px-4 py-1.5 text-sm font-medium text-[#166534]">
              FAQ
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Everything you need to know about searching, saving, and comparing homes with Settla.
            </p>
          </div>

          {/* Accordion */}
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-2 shadow-sm md:px-8">
            {FAQS.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">Still have a question?</p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-lg bg-[#166534] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#14532d]"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
