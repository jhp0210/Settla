"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { HouseComparison } from "@/app/components/HouseComparison";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // TODO: wire up real address search logic
    await new Promise((r) => setTimeout(r, 800));
    setIsSearching(false);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            AI Housing
          </div>

          {/* Welcome (compact) */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter an address (e.g. 412 E Pine St, Seattle, WA)"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSearching ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        {/* House Comparison */}
        <HouseComparison />
      </div>
    </main>
  );
}
