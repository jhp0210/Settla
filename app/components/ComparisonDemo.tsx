"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Sample homes for the landing-page comparison demo (same metro so the
// comparison reads like a real decision). Mirrors the dashboard's real feature.
const COMPARE_HOMES = [
  {
    address: "412 E Pine St",
    city: "Capitol Hill, Seattle",
    price: 689000,
    beds: 2,
    baths: 2,
    sqft: 1120,
    year: 2015,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&auto=format&q=80",
  },
  {
    address: "1808 Bellevue Ave",
    city: "First Hill, Seattle",
    price: 625000,
    beds: 2,
    baths: 1,
    sqft: 980,
    year: 1998,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format&q=80",
  },
  {
    address: "530 Broadway E",
    city: "Broadway, Seattle",
    price: 749000,
    beds: 3,
    baths: 2,
    sqft: 1340,
    year: 2019,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format&q=80",
  },
];

type CompareHome = (typeof COMPARE_HOMES)[number];

const COMPARE_ROWS: {
  label: string;
  get: (h: CompareHome) => number;
  fmt: (v: number) => string;
  best: "min" | "max";
}[] = [
  { label: "Sale price", get: (h) => h.price, fmt: (v) => "$" + v.toLocaleString(), best: "min" },
  { label: "Bedrooms", get: (h) => h.beds, fmt: (v) => String(v), best: "max" },
  { label: "Bathrooms", get: (h) => h.baths, fmt: (v) => String(v), best: "max" },
  { label: "Size", get: (h) => h.sqft, fmt: (v) => v.toLocaleString() + " sq ft", best: "max" },
  { label: "Year built", get: (h) => h.year, fmt: (v) => String(v), best: "max" },
];

// Which columns hold the "best" value in a row (ties highlight all winners).
function bestFlags(values: number[], mode: "min" | "max"): boolean[] {
  const target = mode === "min" ? Math.min(...values) : Math.max(...values);
  return values.map((v) => v === target);
}

const GLIDE_MS = 700; // cursor travel time between bookmark buttons
const PRESS_MS = 160; // click press
const DWELL_MS = 520; // pause after each bookmark
const HOLD_MS = 3000; // hold the finished table before looping

export function ComparisonDemo() {
  // How many homes have been "bookmarked" so far (0..3), in order.
  const [addedCount, setAddedCount] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const [done, setDone] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, pressing: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const timersRef = useRef<number[]>([]);

  const measure = useCallback(() => {
    const c = containerRef.current?.getBoundingClientRect();
    if (!c) return;
    targetsRef.current = btnRefs.current.map((b) => {
      if (!b) return { x: 0, y: 0 };
      const r = b.getBoundingClientRect();
      return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 };
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const play = useCallback(() => {
    clearTimers();
    measure();
    setAddedCount(0);
    setHighlight(false);
    setDone(false);
    setCursor((c) => ({ ...c, visible: false, pressing: false }));

    const at = (fn: () => void, t: number) => {
      timersRef.current.push(window.setTimeout(fn, t));
    };

    let acc = 450;
    for (let i = 0; i < COMPARE_HOMES.length; i++) {
      const start = acc;
      at(() => {
        const target = targetsRef.current[i] ?? { x: 0, y: 0 };
        setCursor({ x: target.x, y: target.y, visible: true, pressing: false });
      }, start);
      at(() => setCursor((c) => ({ ...c, pressing: true })), start + GLIDE_MS);
      at(() => {
        setAddedCount(i + 1);
        setCursor((c) => ({ ...c, pressing: false }));
      }, start + GLIDE_MS + PRESS_MS);
      acc = start + GLIDE_MS + PRESS_MS + DWELL_MS;
    }

    at(() => setCursor((c) => ({ ...c, visible: false })), acc);
    at(() => setHighlight(true), acc + 250);
    at(() => setDone(true), acc + 900);
    at(() => play(), acc + HOLD_MS);
  }, [clearTimers, measure]);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAddedCount(COMPARE_HOMES.length);
      setHighlight(true);
      setDone(true);
      return;
    }
    play();
    return clearTimers;
  }, [play, clearTimers]);

  const fmtPrice = (n: number) => "$" + Math.round(n / 1000) + "k";

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Demo header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-[#166534] ${done ? "" : "animate-ping opacity-60"}`} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#166534]" />
          </span>
          {done ? "That's it — three homes, one view" : "Watch: bookmark homes to compare them"}
        </div>
        <button
          onClick={play}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-green-300 hover:text-[#166534]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356M3.999 5.082a8.25 8.25 0 0113.803-3.7L21.015 4.5m0 0v4.992m0-4.992h-4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7" />
          </svg>
          Replay
        </button>
      </div>

      {/* Step 1 — mini listings strip with bookmark targets */}
      <div className="border-b border-gray-100 px-5 pb-5 pt-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          1 · Browse listings — bookmark the ones you toured
        </p>
        <div className="grid grid-cols-3 gap-3">
          {COMPARE_HOMES.map((h, i) => {
            const added = i < addedCount;
            return (
              <div
                key={h.address}
                className={`relative flex items-center gap-2.5 rounded-xl border p-2 transition-colors duration-300 ${
                  added ? "border-green-300 bg-green-50/60" : "border-gray-200 bg-white"
                }`}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5">
                  <Image src={h.image} alt={h.address} fill className="object-cover" sizes="44px" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-gray-900">{h.address}</div>
                  <div className="text-[11px] text-gray-400">{fmtPrice(h.price)}</div>
                </div>
                <button
                  ref={(el) => { btnRefs.current[i] = el; }}
                  onClick={() => setAddedCount((n) => Math.max(n, i + 1))}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                    added
                      ? "border-green-300 bg-[#166534] text-white"
                      : "border-gray-200 bg-white text-gray-400 hover:text-[#166534]"
                  }`}
                  title={added ? "Bookmarked" : "Bookmark"}
                  aria-label={added ? `${h.address} bookmarked` : `Bookmark ${h.address}`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={added ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2 — comparison table that fills in */}
      <div className="px-5 pb-2 pt-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          2 · Compare them side by side
        </p>
      </div>
      <div className="overflow-x-auto px-1 pb-1">
        <div className="min-w-[560px]">
          {/* Home headers */}
          <div className="grid grid-cols-[120px_repeat(3,1fr)]">
            <div />
            {COMPARE_HOMES.map((h, i) => {
              const added = i < addedCount;
              return (
                <div key={h.address} className="border-l border-gray-100 px-4 pb-3">
                  {added ? (
                    <div className="animate-[fadeInUp_0.4s_ease]">
                      <div className="relative mb-2 h-16 overflow-hidden rounded-lg ring-1 ring-black/5">
                        <Image src={h.image} alt={h.address} fill className="object-cover" sizes="180px" />
                      </div>
                      <div className="truncate text-xs font-semibold text-gray-900">{h.address}</div>
                      <div className="truncate text-[11px] text-gray-400">{h.city}</div>
                    </div>
                  ) : (
                    <div className="flex h-[88px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 text-gray-300">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Metric rows */}
          {COMPARE_ROWS.map((row, ri) => {
            const values = COMPARE_HOMES.map(row.get);
            const flags = bestFlags(values, row.best);
            const isPrice = row.best === "min";
            return (
              <div
                key={row.label}
                className={`grid grid-cols-[120px_repeat(3,1fr)] border-t border-gray-100 ${ri % 2 ? "bg-gray-50/30" : ""}`}
              >
                <div className="flex items-center px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {row.label}
                </div>
                {values.map((v, i) => {
                  const added = i < addedCount;
                  const isBest = highlight && added && flags[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-1 border-l border-gray-100 px-4 py-3 transition-colors duration-300"
                      style={{
                        transitionDelay: highlight ? `${ri * 110}ms` : "0ms",
                        backgroundColor: isBest ? "rgba(240, 253, 244, 0.8)" : "transparent",
                      }}
                    >
                      {added ? (
                        <>
                          <span
                            className={`${isPrice ? "text-base" : "text-sm"} transition-colors duration-300 ${
                              isBest ? "font-bold text-[#166534]" : "font-medium text-gray-700"
                            }`}
                            style={{ transitionDelay: highlight ? `${ri * 110}ms` : "0ms" }}
                          >
                            {row.fmt(v)}
                          </span>
                          {isBest && (
                            <span className="flex h-5 w-5 shrink-0 animate-[fadeInUp_0.3s_ease] items-center justify-center rounded-full bg-[#166534] text-white">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend + CTA footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/40 px-5 py-4 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#166534] text-white">
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          Best value in each row
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#166534] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#14532d]"
        >
          Compare your own homes →
        </Link>
      </div>

      {/* Animated cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 transition-transform ease-in-out"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px) scale(${cursor.pressing ? 0.85 : 1})`,
          transitionDuration: `${GLIDE_MS}ms`,
          opacity: cursor.visible ? 1 : 0,
        }}
      >
        {/* click ripple */}
        <span
          className={`absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#166534]/30 ${cursor.pressing ? "animate-ping" : ""}`}
          style={{ opacity: cursor.pressing ? 1 : 0 }}
        />
        <svg className="h-5 w-5 drop-shadow-md" viewBox="0 0 24 24" fill="white" stroke="#166534" strokeWidth={1.5}>
          <path strokeLinejoin="round" d="M5 3l4.5 16 2.5-6.5L18.5 10 5 3z" />
        </svg>
      </div>
    </div>
  );
}
