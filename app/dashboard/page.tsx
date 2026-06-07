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
    <main className="min-h-screen bg-[#F8F7F4] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-[#166534]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#166534]" />
              Settla
            </div>
            {/* Plan badge */}
            {isPro ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-[#166534]">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Pro
              </span>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-green-300 hover:text-[#166534]"
              >
                Free
                <span className="text-[#166534]">· Upgrade</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
              {user?.user_metadata?.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile picture"
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.user_metadata?.full_name ?? user?.email ?? "there"}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* AI Address Analysis */}
        <div className="mt-8 mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <svg className="h-5 w-5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            Analyze an address with AI
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Get an instant read on a specific address — market conditions, price range, pros &amp; cons, and walk &amp; transit scores.
          </p>
        </div>

        {/* Address Search */}
        <form onSubmit={handleSearch}>
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[#166534] focus:outline-none focus:ring-1 focus:ring-[#166534] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim() || !canSearch}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#14532d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
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
                        i < searchesToday ? "bg-[#166534]" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {canSearch
                    ? `${searchesLeft} of ${FREE_SEARCH_LIMIT} searches left today`
                    : "Daily limit reached"}
                </span>
              </div>
              {!canSearch && (
                <Link href="/pricing" className="text-xs font-medium text-[#166534] hover:text-[#14532d]">
                  Upgrade for unlimited →
                </Link>
              )}
            </div>
          )}
        </form>

        {/* AI Analysis result */}
        {isSearching && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-5 text-sm text-gray-500">
            <svg className="h-4 w-4 animate-spin shrink-0 text-[#166534]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing property — this takes a few seconds…
          </div>
        )}
        {analysisError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
            {analysisError}
          </div>
        )}
        {analysis && <PropertyAnalysis data={analysis} />}

        {/* Browse & Save Listings */}
        <div className="mt-10 border-t border-gray-200 pt-10">
          <PropertyListings theme="light" />
        </div>

        {/* House Comparison */}
        <HouseComparison />
      </div>
    </main>
  );
}
