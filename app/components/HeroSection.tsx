import Link from "next/link";
import Image from "next/image";
import { Navbar } from "./Navbar";
import { PropertyListings } from "./PropertyListings";

// Sample homes for the landing-page comparison preview (same metro so the
// comparison reads like a real decision). Mirrors the dashboard's real feature.
const COMPARE_HOMES = [
  {
    address: "412 E Pine St",
    city: "Capitol Hill, Seattle",
    price: 689000,
    beds: 2,
    baths: 2,
    sqft: 1120,
    year: 2015,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&auto=format&q=80",
  },
  {
    address: "1808 Bellevue Ave",
    city: "First Hill, Seattle",
    price: 625000,
    beds: 2,
    baths: 1,
    sqft: 980,
    year: 1998,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format&q=80",
  },
  {
    address: "530 Broadway E",
    city: "Broadway, Seattle",
    price: 749000,
    beds: 3,
    baths: 2,
    sqft: 1340,
    year: 2019,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format&q=80",
  },
];

type CompareHome = (typeof COMPARE_HOMES)[number];

const COMPARE_ROWS: {
  label: string;
  get: (h: CompareHome) => number;
  fmt: (v: number) => string;
  best: "min" | "max";
}[] = [
  { label: "Sale price", get: (h) => h.price, fmt: (v) => "$" + v.toLocaleString(), best: "min" },
  { label: "Bedrooms", get: (h) => h.beds, fmt: (v) => String(v), best: "max" },
  { label: "Bathrooms", get: (h) => h.baths, fmt: (v) => String(v), best: "max" },
  { label: "Size", get: (h) => h.sqft, fmt: (v) => v.toLocaleString() + " sq ft", best: "max" },
  { label: "Year built", get: (h) => h.year, fmt: (v) => String(v), best: "max" },
];

// Which columns hold the "best" value in a row (ties highlight all winners).
function bestFlags(values: number[], mode: "min" | "max"): boolean[] {
  const target = mode === "min" ? Math.min(...values) : Math.max(...values);
  return values.map((v) => v === target);
}

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
        </div>

        <div className="mx-auto max-w-5xl">
          <PropertyListings theme="light" />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-gray-200 bg-white px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">How it works</p>
          <div className="relative flex flex-col gap-8 sm:flex-row sm:gap-0">
            {/* Connector line (desktop only) */}
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gray-200 sm:block" style={{ left: "16.6%", right: "16.6%" }} />

            {[
              {
                step: "1",
                title: "Search with filters",
                desc: "Enter a city or ZIP code, then narrow by price, bedrooms, and bathrooms to find listings that fit.",
              },
              {
                step: "2",
                title: "Save homes you like",
                desc: "Bookmark any listing as you browse. Your saved homes stay in one place across sessions.",
              },
              {
                step: "3",
                title: "Compare side by side",
                desc: "Pick up to three saved homes and see price, size, beds, and baths laid out together.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-1 flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#166534] text-sm font-bold text-white shadow-sm">
                  {step}
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison preview */}
      <section className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#166534]">
              Side by side
            </span>
            <h2 className="text-3xl font-bold text-gray-900">See the difference at a glance</h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* Home headers */}
                <div className="grid grid-cols-[132px_repeat(3,1fr)]">
                  <div className="bg-gray-50/60" />
                  {COMPARE_HOMES.map((h) => (
                    <div key={h.address} className="border-l border-gray-100 p-4">
                      <div className="relative mb-3 h-24 overflow-hidden rounded-xl ring-1 ring-black/5">
                        <Image
                          src={h.image}
                          alt={h.address}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="220px"
                        />
                      </div>
                      <div className="text-sm font-semibold leading-tight text-gray-900">{h.address}</div>
                      <div className="mt-0.5 text-xs text-gray-400">{h.city}</div>
                    </div>
                  ))}
                </div>

                {/* Metric rows */}
                {COMPARE_ROWS.map((row, ri) => {
                  const values = COMPARE_HOMES.map(row.get);
                  const flags = bestFlags(values, row.best);
                  const isPrice = row.best === "min";
                  return (
                    <div
                      key={row.label}
                      className={`grid grid-cols-[132px_repeat(3,1fr)] border-t border-gray-100 ${ri % 2 ? "bg-gray-50/30" : ""}`}
                    >
                      <div className="flex items-center bg-gray-50/60 px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {row.label}
                      </div>
                      {values.map((v, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between gap-1 border-l border-gray-100 px-4 py-4 ${
                            flags[i] ? "bg-green-50/70" : ""
                          }`}
                        >
                          <span
                            className={`${isPrice ? "text-base" : "text-sm"} ${
                              flags[i] ? "font-bold text-[#166534]" : "font-medium text-gray-700"
                            }`}
                          >
                            {row.fmt(v)}
                          </span>
                          {flags[i] && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#166534] text-white">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend + CTA footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/40 px-5 py-4 sm:flex-row">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#166534] text-white">
                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                Best value in each row
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#166534] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#14532d]"
              >
                Compare your own homes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="h-4 w-4 text-[#166534]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Settla</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Settla. Demo project.</p>
        </div>
      </footer>
    </div>
  );
}
