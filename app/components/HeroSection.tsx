import Link from "next/link";
import Image from "next/image";
import { PropertyListings } from "./PropertyListings";

export function HeroSection() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-[#166534]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">AI Housing</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Find Homes
            </Link>
            <Link href="#market" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Market Trends
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </div>

          <Link
            href="/login"
            className="rounded-lg bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14532d]"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pb-16 pt-20">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            AI-Powered Real Estate Analysis
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Find your perfect home
            <br />
            <span className="text-[#166534]">with AI market insights</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500">
            Our AI analyzes real estate trends, neighborhood data, and market conditions
            to help you make smarter homebuying decisions.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <PropertyListings theme="light" />
        </div>
      </section>

      {/* Market Stats */}
      <section id="market" className="border-y border-gray-200 bg-white px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$485K</div>
              <div className="mt-1 text-sm text-gray-500">Median Home Price</div>
              <div className="mt-1 text-xs font-semibold text-green-600">▲ 3.2% this month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50,000+</div>
              <div className="mt-1 text-sm text-gray-500">Active Listings</div>
              <div className="mt-1 text-xs font-semibold text-amber-600">Updated daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">28 days</div>
              <div className="mt-1 text-sm text-gray-500">Avg. Days on Market</div>
              <div className="mt-1 text-xs font-semibold text-green-600">▼ 5 days YoY</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="mt-1 text-sm text-gray-500">AI Match Accuracy</div>
              <div className="mt-1 text-xs font-semibold text-green-600">Verified results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Built for the modern homebuyer</h2>
            <p className="mt-3 text-gray-500">Everything you need to navigate today&apos;s housing market</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">Market Trend Analysis</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Track price trends, inventory levels, and market conditions in any neighborhood across the US.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">AI Property Matching</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Tell us your needs. Our AI instantly ranks thousands of listings by how well they match your criteria.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">Side-by-Side Comparison</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                Compare properties on price, size, location scores, school ratings, and AI match percentage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Property previews */}
      <section className="border-t border-gray-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured listings</h2>
              <p className="mt-1 text-sm text-gray-500">AI-matched properties based on popular searches</p>
            </div>
            <Link href="/login" className="text-sm font-semibold text-[#166534] hover:text-[#14532d]">
              View all listings →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                label: "Seattle — Capitol Hill",
                address: "412 E Pine St, Seattle, WA",
                price: "$689,000",
                beds: "2 bed",
                baths: "2 bath",
                sqft: "1,120 sq ft",
                match: 94,
                tag: "Hot market",
                tagColor: "bg-red-50 text-red-600",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=350&fit=crop&auto=format&q=80",
              },
              {
                label: "New York — Upper West Side",
                address: "350 W 85th St, New York, NY",
                price: "$1,250,000",
                beds: "2 bed",
                baths: "1 bath",
                sqft: "980 sq ft",
                match: 87,
                tag: "Highly sought",
                tagColor: "bg-amber-50 text-amber-700",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=350&fit=crop&auto=format&q=80",
              },
              {
                label: "Bay Area — Palo Alto",
                address: "728 Emerson St, Palo Alto, CA",
                price: "$2,850,000",
                beds: "3 bed",
                baths: "2 bath",
                sqft: "1,640 sq ft",
                match: 91,
                tag: "Top schools",
                tagColor: "bg-green-50 text-green-700",
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=350&fit=crop&auto=format&q=80",
              },
            ].map((p) => (
              <div key={p.label} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                {/* Property image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.label}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 m-3 flex items-center justify-between px-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.tagColor}`}>
                      {p.tag}
                    </span>
                    <span className="rounded-full bg-[#166534] px-2.5 py-0.5 text-xs font-bold text-white">
                      {p.match}% match
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-1 text-lg font-bold text-gray-900">{p.price}</div>
                  <div className="mb-0.5 text-sm font-medium text-gray-700">{p.label}</div>
                  <div className="mb-3 text-xs text-gray-400">{p.address}</div>
                  <div className="flex gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span>{p.beds}</span>
                    <span>{p.baths}</span>
                    <span>{p.sqft}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#166534] px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to find your next home?</h2>
          <p className="mb-8 text-green-200">
            Join thousands of buyers who found their perfect match with AI Housing.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#166534] transition-all hover:bg-green-50 hover:shadow-lg active:scale-95"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="h-4 w-4 text-[#166534]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">AI Housing</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 AI Housing. Demo project.</p>
        </div>
      </footer>
    </div>
  );
}
