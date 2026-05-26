"use client";

import Link from "next/link";
import { useState } from "react";
import { usePlan, FREE_COMPARE_LIMIT } from "@/context/PlanContext";

interface HouseInfo {
  id: number;
  name: string;
  address: string;
  price: string;
  monthlyRent?: string;
  size: string;
  rooms: string;
  floor: string;
  buildYear: string;
  heating: string;
  parking: string;
  maintenanceFee: string;
  tags: string[];
  matchScore: number;
}

const SAMPLE_HOUSES: HouseInfo[] = [
  {
    id: 1,
    name: "Seattle — Capitol Hill",
    address: "412 E Pine St, Seattle, WA 98122",
    price: "$689,000",
    size: "1,120 sq ft",
    rooms: "2 bed / 2 bath",
    floor: "4F / 6F",
    buildYear: "2017",
    heating: "Forced air",
    parking: "1 space / unit",
    maintenanceFee: "~$480 / mo",
    tags: ["Walkable", "Near light rail", "Rooftop deck"],
    matchScore: 94,
  },
  {
    id: 2,
    name: "New York — Upper West Side",
    address: "350 W 85th St, New York, NY 10024",
    price: "$1,250,000",
    size: "980 sq ft",
    rooms: "2 bed / 1 bath",
    floor: "8F / 15F",
    buildYear: "1965",
    heating: "Steam radiator",
    parking: "Nearby garage",
    maintenanceFee: "~$1,200 / mo",
    tags: ["Central Park views", "Top school district", "Doorman building"],
    matchScore: 87,
  },
  {
    id: 3,
    name: "Bay Area — Palo Alto",
    address: "728 Emerson St, Palo Alto, CA 94301",
    price: "$2,850,000",
    size: "1,640 sq ft",
    rooms: "3 bed / 2 bath",
    floor: "Single family",
    buildYear: "2004",
    heating: "Central HVAC",
    parking: "2-car garage",
    maintenanceFee: "~$150 / mo",
    tags: ["Top-rated schools", "Near Caltrain", "Tech hub"],
    matchScore: 91,
  },
];

const FIELDS: { label: string; key: keyof HouseInfo }[] = [
  { label: "Address", key: "address" },
  { label: "Sale price", key: "price" },
  { label: "Size", key: "size" },
  { label: "Bed / Bath", key: "rooms" },
  { label: "Floor", key: "floor" },
  { label: "Built", key: "buildYear" },
  { label: "Heating", key: "heating" },
  { label: "Parking", key: "parking" },
  { label: "HOA fee", key: "maintenanceFee" },
];

function ScoreBadge({ score, locked }: { score: number; locked: boolean }) {
  if (locked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white/30">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Pro only
      </span>
    );
  }

  const color =
    score >= 90
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 80
        ? "text-blue-400 border-blue-500/30 bg-blue-500/10"
        : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      AI match {score}%
    </span>
  );
}

export function HouseComparison() {
  const { plan } = usePlan();
  const isPro = plan === "pro";
  const maxSlots = isPro ? 3 : FREE_COMPARE_LIMIT;

  const [selected, setSelected] = useState<(HouseInfo | null)[]>([
    SAMPLE_HOUSES[0],
    SAMPLE_HOUSES[1],
    SAMPLE_HOUSES[2],
  ]);

  function handleChange(slotIdx: number, houseId: string) {
    const house = houseId === "" ? null : SAMPLE_HOUSES.find((h) => h.id === Number(houseId)) ?? null;
    setSelected((prev) => {
      const next = [...prev];
      next[slotIdx] = house;
      return next;
    });
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Property Comparison</h2>
        <span className="text-xs text-white/40">
          Compare up to {maxSlots} properties side by side
        </span>
      </div>

      <div className={`grid gap-4 mb-0 ${isPro ? "grid-cols-3" : "grid-cols-3"}`}>
        {/* Active slots */}
        {Array.from({ length: maxSlots }).map((_, idx) => (
          <div key={idx}>
            <select
              value={selected[idx]?.id ?? ""}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0a0f] text-white/50">
                — Select a property —
              </option>
              {SAMPLE_HOUSES.map((h) => (
                <option key={h.id} value={h.id} className="bg-[#0a0a0f] text-white">
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Locked 3rd slot for free users */}
        {!isPro && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-indigo-500/20 bg-indigo-500/5 px-3 py-2">
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Pro — unlock 3rd slot
            </Link>
          </div>
        )}
      </div>

      {/* Comparison cards */}
      <div className="mt-3 grid grid-cols-3 gap-4">
        {/* Active slots */}
        {Array.from({ length: maxSlots }).map((_, idx) => {
          const house = selected[idx];
          return house ? (
            <div
              key={house.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
            >
              <div className="border-b border-white/10 px-5 py-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white leading-snug">{house.name}</h3>
                  <ScoreBadge score={house.matchScore} locked={!isPro} />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {house.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col divide-y divide-white/5 px-5 py-2 flex-1">
                {FIELDS.map(({ label, key }) => (
                  <div key={key} className="flex items-start justify-between gap-2 py-2.5">
                    <span className="shrink-0 text-xs text-white/40">{label}</span>
                    <span className="text-right text-xs font-medium text-white/80">
                      {String(house[key])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center"
            >
              <div className="mb-2 text-3xl text-white/10">+</div>
              <p className="text-xs text-white/30">Select a property above</p>
            </div>
          );
        })}

        {/* Locked 3rd card for free users */}
        {!isPro && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-500/20 bg-indigo-500/[0.03] py-16 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-white/50">Pro feature</p>
            <p className="mb-4 text-xs text-white/30">Compare a 3rd property</p>
            <Link
              href="/pricing"
              className="rounded-lg bg-indigo-600/80 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-600"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
