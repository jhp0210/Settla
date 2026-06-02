"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePlan, FREE_COMPARE_LIMIT } from "@/context/PlanContext";
import { useSavedProperties, type SavedProperty } from "@/context/SavedPropertiesContext";

const FIELDS: { label: string; key: keyof SavedProperty }[] = [
  { label: "Address", key: "address" },
  { label: "City", key: "city" },
  { label: "Sale price", key: "price" },
  { label: "Bed", key: "beds" },
  { label: "Bath", key: "baths" },
  { label: "Size (sq ft)", key: "sqft" },
  { label: "Year built", key: "year_built" },
  { label: "Type", key: "property_type" },
];

function formatField(key: keyof SavedProperty, value: unknown): string {
  if (value == null || value === "") return "—";
  if (key === "price") return "$" + Number(value).toLocaleString();
  if (key === "sqft") return Number(value).toLocaleString();
  return String(value);
}

export function HouseComparison() {
  const { plan } = usePlan();
  const { savedProperties } = useSavedProperties();
  const isPro = plan === "pro";
  const maxSlots = isPro ? 3 : FREE_COMPARE_LIMIT;

  const [selected, setSelected] = useState<(SavedProperty | null)[]>([null, null, null]);

  function handleChange(slotIdx: number, propertyId: string) {
    const house = propertyId === "" ? null : savedProperties.find((p) => p.property_id === propertyId) ?? null;
    setSelected((prev) => {
      const next = [...prev];
      next[slotIdx] = house;
      return next;
    });
  }

  const hasProperties = savedProperties.length > 0;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Property Comparison</h2>
        <span className="text-xs text-white/40">
          Compare up to {maxSlots} saved properties side by side
        </span>
      </div>

      {!hasProperties ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-12 text-center">
          <p className="text-sm text-white/30">Save properties from Browse Listings above to compare them here.</p>
        </div>
      ) : (
        <>
          {/* Slot selectors */}
          <div className="grid grid-cols-3 gap-4 mb-0">
            {Array.from({ length: maxSlots }).map((_, idx) => (
              <div key={idx}>
                <select
                  value={selected[idx]?.property_id ?? ""}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0a0a0f] text-white/50">
                    — Select a saved property —
                  </option>
                  {savedProperties.map((h) => (
                    <option key={h.property_id} value={h.property_id} className="bg-[#0a0a0f] text-white">
                      {h.address}{h.city ? `, ${h.city}` : ""}
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
            {Array.from({ length: maxSlots }).map((_, idx) => {
              const house = selected[idx];
              return house ? (
                <div
                  key={house.property_id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                >
                  {/* Photo */}
                  {house.photo_url && (
                    <div className="relative h-36 shrink-0">
                      <Image
                        src={house.photo_url}
                        alt={house.address}
                        fill
                        className="object-cover"
                        sizes="33vw"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex flex-col divide-y divide-white/5 px-5 py-2 flex-1">
                    {FIELDS.map(({ label, key }) => (
                      <div key={key} className="flex items-start justify-between gap-2 py-2.5">
                        <span className="shrink-0 text-xs text-white/40">{label}</span>
                        <span className="text-right text-xs font-medium text-white/80">
                          {formatField(key, house[key])}
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
                  <p className="text-xs text-white/30">Select a saved property above</p>
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
        </>
      )}
    </section>
  );
}
