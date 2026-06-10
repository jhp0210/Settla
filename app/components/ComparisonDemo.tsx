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
const COMPARE_MS = 1050; // beat to read the filled-in table before highlighting
const REVEAL_MS = 650; // beat after the best-value cascade
const HOLD_MS = 2600; // hold the finished table before looping

// The three chapters of the walkthrough, surfaced as a clickable step rail.
const STEPS = [
  { title: "Browse & bookmark", hint: "Save the homes you toured" },
  { title: "Compare side by side", hint: "Every spec lined up" },
  { title: "See the best value", hint: "Winners highlighted per row" },
];

export function ComparisonDemo() {
  // How many homes have been "bookmarked" so far (0..3), in order.
  const [addedCount, setAddedCount] = useState(0);
  // Which chapter (0..2) is currently in focus, drives the rail + dimming.
  const [activeStep, setActiveStep] = useState(0);
  const [highlight, setHighlight] = useState(false);
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
    setActiveStep(0);
    setHighlight(false);
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

    // Step 2 — hide the cursor and shift focus to the comparison table.
    at(() => {
      setCursor((c) => ({ ...c, visible: false }));
      setActiveStep(1);
    }, acc);
    // Step 3 — cascade the best-value highlights.
    at(() => {
      setActiveStep(2);
      setHighlight(true);
    }, acc + COMPARE_MS);
    at(() => play(), acc + COMPARE_MS + REVEAL_MS + HOLD_MS);
  }, [clearTimers, measure]);

  // Jump straight to a chapter's resting state (used by the rail), then resume
  // the auto-loop after a short pause so the walkthrough keeps running.
  const jumpTo = useCallback(
    (step: number) => {
      clearTimers();
      setCursor((c) => ({ ...c, visible: false, pressing: false }));
      setAddedCount(COMPARE_HOMES.length);
      setActiveStep(step);
      setHighlight(step >= 2);
      timersRef.current.push(window.setTimeout(() => play(), HOLD_MS));
    },
    [clearTimers, play],
  );

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAddedCount(COMPARE_HOMES.length);
      setActiveStep(2);
      setHighlight(true);
      return;
    }
    play();
    return clearTimers;
  }, [play, clearTimers]);

  const fmtPrice = (n: number) => "$" + Math.round(n / 1000) + "k";

  return (
    <div ref={containerRef} className="relative">
      {/* Step rail — clickable chapters that track the walkthrough */}
      <div className="overflow-x-auto px-1 py-3">
        <div className="grid min-w-[560px] grid-cols-[120px_repeat(3,1fr)] items-center">
          {/* spacer above the row-label column */}
          <div />
          {STEPS.map((s, i) => {
            const active = i === activeStep;
            const complete = i < activeStep;
            return (
              <div key={s.title} className="px-4">
                <button
                  onClick={() => jumpTo(i)}
                  aria-current={active ? "step" : undefined}
                  className="group flex w-full items-center gap-2 py-1 text-left transition-all duration-300"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
                      active || complete
                        ? "bg-[#166534] text-white"
                        : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                    }`}
                  >
                    {complete ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-[11px] font-semibold leading-tight transition-colors duration-300 sm:text-xs ${
                        active ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`hidden truncate text-[10px] leading-tight text-gray-400 transition-opacity duration-300 sm:block ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {s.hint}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1 — mini listings strip; columns share the comparison table's
          template so each card sits directly above its column (leading cell
          spans the row-label column). */}
      <div
        className={`overflow-x-auto px-1 pb-5 pt-5 transition-all duration-500 ${
          activeStep === 0 ? "opacity-100" : "opacity-40"
        }`}
      >
        <div className="grid min-w-[560px] grid-cols-[120px_repeat(3,1fr)]">
          <div />
          {COMPARE_HOMES.map((h, i) => {
            const added = i < addedCount;
            return (
              <div key={h.address} className="px-4">
                <div
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps 2 & 3 — comparison table fills in, then best values highlight */}
      <div
        className={`overflow-x-auto px-1 pb-1 pt-4 transition-all duration-500 ${
          activeStep === 0 ? "opacity-40" : "opacity-100"
        }`}
      >
        <div className="min-w-[560px]">
          {/* Home headers */}
          <div className="grid grid-cols-[120px_repeat(3,1fr)]">
            <div />
            {COMPARE_HOMES.map((h, i) => {
              const added = i < addedCount;
              return (
                <div key={h.address} className="border-l border-gray-200 px-4 pb-3">
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
                      className="flex items-center justify-between gap-1 border-l border-gray-200 px-4 py-3 transition-colors duration-300"
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
      <div className="flex flex-col items-center justify-between gap-2 px-5 pb-3 pt-1 sm:flex-row">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#166534] text-white">
            <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          Best value in each row
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#166534] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#14532d]"
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
