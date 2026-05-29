"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      sessionStorage.setItem("pending_search", query.trim());
    }
    router.push("/login");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-4 flex max-w-2xl gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-md"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <svg
          className="h-5 w-5 shrink-0 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city, ZIP code, or address..."
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532d]"
      >
        Search homes
      </button>
    </form>
  );
}
