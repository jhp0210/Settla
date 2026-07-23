"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSavedProperties, type SavedProperty } from "@/context/SavedPropertiesContext";
import { useAuth } from "@/context/AuthContext";

// Search results carry two rental-only fields that aren't persisted to the
// saved_properties table; they're stripped before saving (see handleToggle).
type ListingProperty = Omit<SavedProperty, "id"> & {
  price_max?: number | null;
  for_rent?: boolean;
};

function priceLabel(property: ListingProperty) {
  if (property.for_rent) {
    const min = property.price;
    const max = property.price_max;
    if (min && max && max > min) {
      return `$${min.toLocaleString()}–$${max.toLocaleString()}/mo`;
    }
    if (min) return `$${min.toLocaleString()}/mo`;
    return "Rent N/A";
  }
  if (!property.price) return "Price N/A";
  return "$" + property.price.toLocaleString();
}

function BookmarkIcon({ filled, isDark }: { filled: boolean; isDark: boolean }) {
  const accent = isDark ? "fill-indigo-400 text-indigo-400" : "fill-[#166534] text-[#166534]";
  const idle = isDark ? "fill-none text-white/60" : "fill-none text-gray-500";
  return (
    <svg
      className={`h-5 w-5 transition-colors ${filled ? accent : idle}`}
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
      // Drop rental-only fields so the insert matches the saved_properties columns.
      let enriched = { ...property };
      delete enriched.price_max;
      delete enriched.for_rent;
      try {
        const res = await fetch(`/api/property-detail?property_id=${property.property_id}`);
        if (res.ok) {
          const detail = await res.json();
          enriched = { ...enriched, year_built: detail.year_built, baths: detail.baths };
        }
      } catch {
        // save with whatever data we have
      }
      await saveProperty(enriched);
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
            isDark
              ? saved
                ? "border-indigo-500/50 bg-indigo-500/20 hover:bg-indigo-500/30"
                : "border-white/20 bg-black/40 hover:bg-black/60"
              : saved
                ? "border-green-300 bg-green-100 hover:bg-green-200"
                : "border-gray-200 bg-white/90 hover:bg-white"
          } disabled:opacity-50`}
          title={saved ? "Remove from saved" : "Save property"}
        >
          <BookmarkIcon filled={saved} isDark={isDark} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{priceLabel(property)}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isDark
              ? "border border-white/15 bg-white/10 text-white/70"
              : "border border-green-200 bg-green-50 text-[#166534]"
          }`}>
            {property.for_rent ? "Rent" : "Buy"}
          </span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`mb-0.5 block text-sm font-medium underline-offset-2 hover:underline ${isDark ? "text-white/70 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
        >
          {property.address}
        </a>
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
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedsMin, setBedsMin] = useState("");
  const [bathsMin, setBathsMin] = useState("");
  const [homeType, setHomeType] = useState("");
  const [status, setStatus] = useState<"for_sale" | "for_rent">("for_sale");
  const [showFilters, setShowFilters] = useState(false);
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
        body: JSON.stringify({
          location: location.trim(),
          priceMin: priceMin || undefined,
          priceMax: priceMax || undefined,
          bedsMin: bedsMin || undefined,
          bathsMin: bathsMin || undefined,
          homeType: homeType || undefined,
          status,
        }),
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

  const inputCls = isDark
    ? "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
    : "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]";

  const selectCls = isDark
    ? "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer"
    : "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] appearance-none cursor-pointer";

  return (
    <section className={isDark ? "mt-10" : ""}>
      <div className="mb-5">
        <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Browse Listings
        </h2>
        <p className={`mt-1 text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>
          Search by ZIP code or city (e.g. &quot;98122&quot; or &quot;Seattle, WA&quot;) — bookmark properties you&apos;ve toured to compare them.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="space-y-3">
        {/* Buy / Rent toggle */}
        <div className={`inline-flex rounded-xl border p-1 ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-100"
        }`}>
          {([
            ["for_sale", "Buy"],
            ["for_rent", "Rent"],
          ] as const).map(([value, label]) => {
            const active = status === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  if (value === status) return;
                  setStatus(value);
                  // Clear the query and stale results so nothing lingers from the prior mode.
                  setLocation("");
                  setProperties([]);
                  setSearched(false);
                  setError(null);
                }}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? isDark
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-[#166534] shadow-sm"
                    : isDark
                      ? "text-white/50 hover:text-white"
                      : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
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
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-95 ${
              isDark
                ? showFilters
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                : showFilters
                  ? "border-[#166534]/50 bg-[#166534]/10 text-[#166534]"
                  : "border-gray-200 bg-white text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>
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
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className={`grid grid-cols-2 gap-3 rounded-xl border p-4 sm:grid-cols-3 lg:grid-cols-5 ${
            isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-gray-50"
          }`}>
            <div>
              <label className={`mb-1 block text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Home type</label>
              <select value={homeType} onChange={(e) => setHomeType(e.target.value)} className={selectCls}>
                <option value="">Any</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
              </select>
            </div>
            <div>
              <label className={`mb-1 block text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Min price</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="e.g. 300000"
                className={inputCls}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Max price</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="e.g. 800000"
                className={inputCls}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Min beds</label>
              <select value={bedsMin} onChange={(e) => setBedsMin(e.target.value)} className={selectCls}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className={`mb-1 block text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>Min baths</label>
              <select value={bathsMin} onChange={(e) => setBathsMin(e.target.value)} className={selectCls}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
          isDark ? "border-red-500/20 bg-red-500/5 text-red-400" : "border-red-200 bg-red-50 text-red-600"
        }`}>
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
