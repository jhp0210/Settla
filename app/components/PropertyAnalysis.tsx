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
      <span className="w-16 shrink-0 text-xs text-gray-400">{label}</span>
      <div className="flex-1 rounded-full bg-gray-200 h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#166534] transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-xs font-semibold text-gray-700">{value}</span>
    </div>
  );
}

const MARKET_COLORS: Record<string, string> = {
  "Seller's market": "border-red-200 bg-red-50 text-red-600",
  "Buyer's market": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Balanced market": "border-blue-200 bg-blue-50 text-blue-600",
};

export function PropertyAnalysis({ data }: { data: AnalysisData }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const scoreColor =
    data.matchScore >= 90
      ? "text-emerald-600"
      : data.matchScore >= 80
        ? "text-blue-600"
        : "text-amber-500";

  const marketColor = MARKET_COLORS[data.marketCondition] ?? "border-gray-200 bg-gray-50 text-gray-500";

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">{data.neighborhood}</p>
          <h3 className="text-base font-semibold text-gray-900">{data.address}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{data.overview}</p>
        </div>
        <div className="shrink-0 text-center">
          <div className={`text-4xl font-bold ${scoreColor}`}>{data.matchScore}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">AI match</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
        {[
          { label: "Price range (low)", value: fmt(data.priceRange.low) },
          { label: "Price range (high)", value: fmt(data.priceRange.high) },
          { label: "Market condition", value: data.marketCondition, badge: marketColor },
          { label: "Walk score", value: String(data.walkScore) },
        ].map(({ label, value, badge }) => (
          <div key={label} className="bg-white px-5 py-4">
            <div className="text-[11px] text-gray-400 mb-1">{label}</div>
            {badge ? (
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
                {value}
              </span>
            ) : (
              <div className="text-sm font-semibold text-gray-900">{value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 gap-4 px-6 py-5 border-t border-gray-100">
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-600">Pros</p>
          <ul className="space-y-1.5">
            {data.pros.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-red-500">Cons</p>
          <ul className="space-y-1.5">
            {data.cons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 shrink-0 text-red-500">✕</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Amenities + scores */}
      <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Nearby</p>
          <div className="flex flex-wrap gap-2">
            {data.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-[#166534]"
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
