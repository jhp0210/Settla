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
          AI 기반 주거 솔루션
        </div>

        {/* Heading */}
        <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
          더 스마트한
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            AI 주거 탐색
          </span>
        </h1>

        {/* Description */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/50">
          인공지능이 당신의 라이프스타일, 예산, 위치 선호도를 분석해
          <br className="hidden md:block" />
          최적의 주거 공간을 추천합니다. 복잡한 부동산 탐색, 이제 AI에게 맡기세요.
        </p>

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            무료로 시작하기
          </Link>
          <button className="rounded-lg border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95">
            데모 보기
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-10 text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">50,000+</span>
            <span className="text-white/40">등록 매물</span>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">98%</span>
            <span className="text-white/40">매칭 정확도</span>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">3분</span>
            <span className="text-white/40">평균 매칭 시간</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}
