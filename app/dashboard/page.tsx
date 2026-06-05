"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePlan, FREE_SEARCH_LIMIT } from "@/context/PlanContext";
import { useRouter } from "next/navigation";
import { HouseComparison } from "@/app/components/HouseComparison";
import { PropertyAnalysis, type AnalysisData } from "@/app/components/PropertyAnalysis";
import { PropertyListings } from "@/app/components/PropertyListings";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { plan, searchesToday, canSearch, incrementSearch } = usePlan();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const runSearch = useCallback(async (address: string) => {
    if (!address.trim() || !canSearch) return;
    setIsSearching(true);
    setAnalysis(null);
    setAnalysisError(null);
    await incrementSearch();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setAnalysis(data);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSearching(false);
    }
  }, [canSearch, incrementSearch]);

  useEffect(() => {
    const pending = sessionStorage.getItem("pending_search");
    if (pending) {
      sessionStorage.removeItem("pending_search");
      setSearchQuery(pending);
      runSearch(pending);
    }
  }, [runSearch]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch(searchQuery);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  const isPro = plan === "pro";
  const searchesLeft = FREE_SEARCH_LIMIT - searchesToday;

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              Settla
            </div>
            {/* Plan badge */}
            {isPro ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Pro
              </span>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50 transition-colors hover:border-indigo-500/30 hover:text-indigo-300"
              >
                Free
                <span className="text-indigo-400">· Upgrade</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              {user?.user_metadata?.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile picture"
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-white/70">
                {user?.user_metadata?.full_name ?? user?.email ?? "there"}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Address Search */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  !canSearch
                    ? "Daily search limit reached — upgrade to Pro for unlimited searches"
                    : "Enter an address (e.g. 412 E Pine St, Seattle, WA)"
                }
                disabled={!canSearch}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim() || !canSearch}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSearching ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Search usage indicator — free only */}
          {!isPro && (
            <div className="mt-2.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: FREE_SEARCH_LIMIT }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-5 rounded-full transition-colors ${
                        i < searchesToday ? "bg-indigo-500" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/30">
                  {canSearch
                    ? `${searchesLeft} of ${FREE_SEARCH_LIMIT} searches left today`
                    : "Daily limit reached"}
                </span>
              </div>
              {!canSearch && (
                <Link href="/pricing" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                  Upgrade for unlimited →
                </Link>
              )}
            </div>
          )}
        </form>

        {/* AI Analysis result */}
        {isSearching && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/50">
            <svg className="h-4 w-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing property — this takes a few seconds…
          </div>
        )}
        {analysisError && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-400">
            {analysisError}
          </div>
        )}
        {analysis && <PropertyAnalysis data={analysis} />}

        {/* Browse & Save Listings */}
        <PropertyListings />

        {/* House Comparison */}
        <HouseComparison />
      </div>
    </main>
  );
}
