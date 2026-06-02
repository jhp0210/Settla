"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSavedProperties, type SavedProperty } from "@/context/SavedPropertiesContext";
import { useAuth } from "@/context/AuthContext";

type ListingProperty = Omit<SavedProperty, "id">;

function formatPrice(price: number | null) {
  if (!price) return "Price N/A";
  return "$" + price.toLocaleString();
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transition-colors ${filled ? "fill-indigo-400 text-indigo-400" : "fill-none text-white/60"}`}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
      />
    </svg>
  );
}

function PropertyCard({ property, theme = "dark" }: { property: ListingProperty; theme?: Theme }) {
  const isDark = theme === "dark";
  const { user } = useAuth();
  const { isSaved, saveProperty, unsaveProperty } = useSavedProperties();
  const router = useRouter();
  const saved = isSaved(property.property_id);
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    if (!user) {
      sessionStorage.setItem("pending_search", property.address);
      router.push("/login");
      return;
    }
    setToggling(true);
    if (saved) {
      await unsaveProperty(property.property_id);
    } else {
      await saveProperty(property);
    }
    setToggling(false);
  }

  const fullAddress = [property.address, property.city, property.state_code, property.postal_code]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all hover:shadow-md ${
      isDark ? "border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20" : "border-gray-200 bg-white shadow-sm"
    }`}>
      {/* Photo */}
      <div className={`relative h-44 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
        {property.photo_url ? (
          <Image
            src={property.photo_url}
            alt={fullAddress}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className={`h-10 w-10 ${isDark ? "text-white/10" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
        )}
        {/* Save button */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
            saved
              ? "border-indigo-500/50 bg-indigo-500/20 hover:bg-indigo-500/30"
              : "border-white/20 bg-black/40 hover:bg-black/60"
          } disabled:opacity-50`}
          title={saved ? "Remove from saved" : "Save property"}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className={`mb-1 text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{formatPrice(property.price)}</div>
        <div className={`mb-0.5 text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>{property.address}</div>
        <div className={`mb-3 text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
          {[property.city, property.state_code, property.postal_code].filter(Boolean).join(", ")}
        </div>
        <div className={`flex flex-wrap gap-3 border-t pt-3 text-xs ${isDark ? "border-white/5 text-white/50" : "border-gray-100 text-gray-500"}`}>
          {property.beds != null && <span>{property.beds} bed</span>}
          {property.baths != null && <span>{property.baths} bath</span>}
          {property.sqft != null && <span>{property.sqft.toLocaleString()} sq ft</span>}
          {property.year_built != null && <span>Built {property.year_built}</span>}
        </div>
      </div>
    </div>
  );
}

type Theme = "dark" | "light";

interface PropertyListingsProps {
  theme?: Theme;
}

export function PropertyListings({ theme = "dark" }: PropertyListingsProps) {
  const [location, setLocation] = useState("");
  const [properties, setProperties] = useState<ListingProperty[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const isDark = theme === "dark";

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) return;
    setSearching(true);
    setError(null);
    setProperties([]);
    setSearched(true);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setProperties(data.properties ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSearching(false);
    }
  }

  return (
    <section className={isDark ? "mt-10" : ""}>
      <div className="mb-5">
        <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Browse Listings
        </h2>
        <p className={`mt-1 text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
          Search by ZIP code or city (e.g. &quot;98122&quot; or &quot;Seattle, WA&quot;) — bookmark properties you&apos;ve toured to compare them.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <svg
            className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-white/30" : "text-gray-400"}`}
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ZIP code or City, State (e.g. 98122 or Seattle, WA)"
            className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
              isDark
                ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                : "border-gray-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={searching || !location.trim()}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            isDark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-[#166534] hover:bg-[#14532d]"
          }`}
        >
          {searching ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching…
            </>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {searching && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`animate-pulse overflow-hidden rounded-2xl border ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
              <div className={`h-44 ${isDark ? "bg-white/5" : "bg-gray-200"}`} />
              <div className="p-4 space-y-2">
                <div className={`h-5 w-24 rounded ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-3 w-40 rounded ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                <div className={`h-3 w-32 rounded ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!searching && properties.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.property_id} property={p} theme={theme} />
          ))}

        </div>
      )}

      {/* Empty state */}
      {!searching && searched && properties.length === 0 && !error && (
        <div className={`mt-6 rounded-2xl border py-12 text-center text-sm ${isDark ? "border-white/10 bg-white/5 text-white/30" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
          No active listings found for that location. Try a different ZIP code or city.
        </div>
      )}
    </section>
  );
}
