import Link from "next/link";
import { Navbar } from "./Navbar";
import { PropertyListings } from "./PropertyListings";

// Landing "Why Settla" cards. `icon` is the `d` of a 24px stroked heroicon.
const FEATURES = [
  {
    title: "Search real listings",
    body: "Live homes on the market — search by ZIP or city and filter by price, beds, and baths.",
    icon: "M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z",
  },
  {
    title: "Save what you tour",
    body: "Bookmark the homes worth a second look and keep your whole shortlist in one place.",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  },
  {
    title: "Compare side by side",
    body: "Line them up on price, size, beds, baths, and year built — the best value in every row is highlighted.",
    icon: "M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z",
  },
];

export function HeroSection() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px] bg-gradient-to-b from-green-50 via-[#F8F7F4] to-[#F8F7F4]" />
        <div className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl" />

        <div className="mx-auto mb-10 max-w-4xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
            Stop second-guessing.
            <br />
            <span className="text-[#166534]">Compare and decide.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            Search listings, save the ones you tour, and compare them side by side.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg bg-[#166534] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#14532d]"
            >
              Get started free
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              See how it works
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <PropertyListings theme="light" />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#166534]">
              Why Settla
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to decide</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
              From the first search to the final call — Settla keeps your shortlist in one place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#166534]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] transition-colors hover:text-[#14532d]"
            >
              See it in action
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="h-4 w-4 text-[#166534]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Settla</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/demo" className="transition-colors hover:text-gray-900">Demo</Link>
            <Link href="/pricing" className="transition-colors hover:text-gray-900">Pricing</Link>
            <Link href="/faq" className="transition-colors hover:text-gray-900">FAQ</Link>
          </div>
          <p className="text-xs text-gray-500">© 2026 Settla.</p>
        </div>
      </footer>
    </div>
  );
}
