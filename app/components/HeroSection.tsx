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
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              How it works
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
            Real listings. Real comparisons.
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Stop second-guessing.
            <br />
            <span className="text-[#166534]">Compare and decide.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500">
            Search homes by price, bedrooms, and size. Save the ones worth a second look,
            then compare them side by side — so you can choose with confidence.
          </p>
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
          <h2 className="mb-4 text-3xl font-bold text-white">Stop losing track of homes you love.</h2>
          <p className="mb-8 text-green-200">
            Search, save, and compare — all in one place. Free to start.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#166534] transition-all hover:bg-green-50 hover:shadow-lg active:scale-95"
          >
            Start comparing homes
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
