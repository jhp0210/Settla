import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-24 text-center">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[400px] rounded-full bg-blue-900/15 blur-[100px]" />
        <div className="absolute right-1/4 top-1/2 h-[250px] w-[350px] rounded-full bg-violet-900/15 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI-Powered Housing
        </div>

        {/* Heading */}
        <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
          Smarter home search
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            powered by AI
          </span>
        </h1>

        {/* Description */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/50">
          Our AI analyzes your lifestyle, budget, and location preferences
          <br className="hidden md:block" />
          to recommend the perfect home. Let AI handle the hard part.
        </p>

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            Get started for free
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-10 text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">50,000+</span>
            <span className="text-white/40">Listed properties</span>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">98%</span>
            <span className="text-white/40">Match accuracy</span>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">3 min</span>
            <span className="text-white/40">Avg. match time</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}
