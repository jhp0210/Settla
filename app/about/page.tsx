import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { ComparisonDemo } from "../components/ComparisonDemo";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Navbar />

      <main className="relative overflow-hidden px-4 pb-20 pt-16">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[340px] bg-gradient-to-b from-green-50 via-[#F8F7F4] to-[#F8F7F4]" />
        <div className="pointer-events-none absolute left-1/2 top-[-140px] -z-10 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl" />

        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#166534]/20 bg-[#166534]/5 px-4 py-1.5 text-sm font-medium text-[#166534]">
              About
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              See the difference at a glance
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Settla lines up the homes you&apos;ve toured side by side — price, size, beds, baths, and year built — and highlights the best value in every row.
            </p>
          </div>

          {/* Animated walkthrough */}
          <ComparisonDemo />

          {/* CTA */}
          <div className="mt-14 text-center">
            <p className="text-gray-600">Ready to compare your own shortlist?</p>
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
