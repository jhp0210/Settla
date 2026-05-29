"use client";

export interface AnalysisData {
  address: string;
  neighborhood: string;
  overview: string;
  marketCondition: string;
  priceRange: { low: number; high: number };
  matchScore: number;
  pros: string[];
  cons: string[];
  amenities: string[];
  walkScore: number;
  transitScore: number;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs text-white/40">{label}</span>
      <div className="flex-1 rounded-full bg-white/10 h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-xs font-semibold text-white/70">{value}</span>
    </div>
  );
}

const MARKET_COLORS: Record<string, string> = {
  "Seller's market": "border-red-500/30 bg-red-500/10 text-red-400",
  "Buyer's market": "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  "Balanced market": "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

export function PropertyAnalysis({ data }: { data: AnalysisData }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const scoreColor =
    data.matchScore >= 90
      ? "text-emerald-400"
      : data.matchScore >= 80
        ? "text-blue-400"
        : "text-yellow-400";

  const marketColor = MARKET_COLORS[data.marketCondition] ?? "border-white/20 bg-white/5 text-white/50";

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-white/40 mb-1">{data.neighborhood}</p>
          <h3 className="text-base font-semibold text-white">{data.address}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{data.overview}</p>
        </div>
        <div className="shrink-0 text-center">
          <div className={`text-4xl font-bold ${scoreColor}`}>{data.matchScore}</div>
          <div className="text-[10px] text-white/40 mt-0.5">AI match</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
        {[
          { label: "Price range (low)", value: fmt(data.priceRange.low) },
          { label: "Price range (high)", value: fmt(data.priceRange.high) },
          { label: "Market condition", value: data.marketCondition, badge: marketColor },
          { label: "Walk score", value: String(data.walkScore) },
        ].map(({ label, value, badge }) => (
          <div key={label} className="bg-[#0a0a0f] px-5 py-4">
            <div className="text-[11px] text-white/35 mb-1">{label}</div>
            {badge ? (
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
                {value}
              </span>
            ) : (
              <div className="text-sm font-semibold text-white">{value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 gap-4 px-6 py-5 border-t border-white/10">
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-400/70">Pros</p>
          <ul className="space-y-1.5">
            {data.pros.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-red-400/70">Cons</p>
          <ul className="space-y-1.5">
            {data.cons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-0.5 shrink-0 text-red-500">✕</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Amenities + scores */}
      <div className="border-t border-white/10 px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/40">Nearby</p>
          <div className="flex flex-wrap gap-2">
            {data.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
        <div className="w-52 shrink-0 space-y-2">
          <ScoreBar label="Walk" value={data.walkScore} />
          <ScoreBar label="Transit" value={data.transitScore} />
        </div>
      </div>
    </div>
  );
}
