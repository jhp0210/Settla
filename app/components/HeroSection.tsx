import Link from "next/link";
import { Navbar } from "./Navbar";
import { PropertyListings } from "./PropertyListings";
import { ComparisonDemo } from "./ComparisonDemo";

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
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            Search listings, save the ones you tour, and compare them side by side.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <PropertyListings theme="light" />
        </div>
      </section>

      {/* Comparison preview */}
      <section id="about" className="border-t border-gray-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#166534]">
              About
            </span>
            <h2 className="text-3xl font-bold text-gray-900">See the difference at a glance</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
              Bookmark the homes you toured and Settla lines them up — watch it work.
            </p>
          </div>

          <ComparisonDemo />
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
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="transition-colors hover:text-gray-900">Pricing</Link>
            <Link href="/faq" className="transition-colors hover:text-gray-900">FAQ</Link>
          </div>
          <p className="text-xs text-gray-400">© 2026 Settla.</p>
        </div>
      </footer>
    </div>
  );
}
