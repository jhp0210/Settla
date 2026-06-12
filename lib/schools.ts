// Looks up real nearby schools (names + ratings) for an address via SchoolDigger.
// Geocoding uses the free U.S. Census geocoder (no API key). Everything here fails
// soft — any missing key / no match / network error returns null so the caller can
// fall back to AI-only school info.

export interface NearbySchool {
  name: string;
  level?: string;
  stars?: number; // SchoolDigger rank, 1–5 (0 / undefined = unrated)
}

interface GeoResult {
  lat: number;
  lng: number;
  state?: string;
}

// Order for display: Elementary → Middle → High → everything else.
function levelRank(level?: string): number {
  const l = (level ?? "").toLowerCase();
  if (l.includes("elementary") || l.includes("primary")) return 0;
  if (l.includes("middle")) return 1;
  if (l.includes("high") || l.includes("secondary")) return 2;
  return 3;
}

interface CensusMatch {
  coordinates?: { x?: number; y?: number };
  matchedAddress?: string;
}

interface SchoolDiggerSchool {
  schoolName?: string;
  schoolLevel?: string;
  rankHistory?: { rankStars?: number }[];
}

async function geocode(address: string): Promise<GeoResult | null> {
  try {
    const url =
      `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress` +
      `?address=${encodeURIComponent(address)}&benchmark=Public_AR_Current&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: { addressMatches?: CensusMatch[] } };
    const match = data.result?.addressMatches?.[0];
    const lat = match?.coordinates?.y;
    const lng = match?.coordinates?.x;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    // Census returns a normalized address like "412 E PINE ST, SEATTLE, WA, 98122"
    const state = match?.matchedAddress?.match(/\b([A-Z]{2})\b,?\s*\d{5}/)?.[1];
    return { lat, lng, state };
  } catch {
    return null;
  }
}

export async function fetchNearbySchools(address: string): Promise<NearbySchool[] | null> {
  const appId = process.env.SCHOOLDIGGER_APP_ID;
  const appKey = process.env.SCHOOLDIGGER_API_KEY;
  if (!appId || !appKey) return null;

  const geo = await geocode(address);
  if (!geo?.state) return null;

  try {
    const params = new URLSearchParams({
      st: geo.state,
      nearLatitude: String(geo.lat),
      nearLongitude: String(geo.lng),
      distanceMiles: "8",
      perPage: "30",
      sortBy: "distance",
      appID: appId,
      appKey: appKey,
    });
    const res = await fetch(`https://api.schooldigger.com/v2.0/schools?${params}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { schoolList?: SchoolDiggerSchool[] };
    const list = data.schoolList;
    if (!Array.isArray(list) || list.length === 0) return null;

    // SchoolDigger only rates public schools, so the physically nearest results
    // (often private, unrated) get crowded out. Map the wider set, then surface
    // rated schools first — each group stays in the API's distance order.
    const mapped = list
      .map((s): NearbySchool => {
        const stars = s.rankHistory?.[0]?.rankStars;
        return {
          name: s.schoolName ?? "",
          level: s.schoolLevel,
          stars: typeof stars === "number" ? stars : undefined,
        };
      })
      .filter((s) => s.name);

    const isRated = (s: NearbySchool) => typeof s.stars === "number" && s.stars > 0;
    const top = [...mapped.filter(isRated), ...mapped.filter((s) => !isRated(s))].slice(0, 5);
    // Group for display by level (stable sort keeps rated/distance order within a level).
    return top.sort((a, b) => levelRank(a.level) - levelRank(b.level));
  } catch {
    return null;
  }
}
