import { NextRequest, NextResponse } from "next/server";

function upgradePhotoUrl(url: string | null): string | null {
  if (!url) return null;
  // rdcpix URLs end in a size letter before .jpg: s=small, m=medium, l=large
  return url.replace(/s\.jpg$/, "l.jpg");
}

export async function POST(req: NextRequest) {
  if (!process.env.RAPIDAPI_KEY) {
    return NextResponse.json({ error: "RAPIDAPI_KEY not configured" }, { status: 500 });
  }

  const { location, priceMin, priceMax, bedsMin, bathsMin, homeType, status } = await req.json();
  if (!location?.trim()) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }

  const forRent = status === "for_rent";
  const isZip = /^\d{5}$/.test(location.trim());
  const body: Record<string, unknown> = {
    limit: 20,
    offset: 0,
    status: [forRent ? "for_rent" : "for_sale"],
    sort: { direction: "desc", field: "list_date" },
  };

  if (isZip) {
    body.postal_code = location.trim();
  } else {
    const parts = location.split(",").map((p: string) => p.trim());
    body.city = parts[0];
    if (parts[1]) body.state_code = parts[1].toUpperCase().slice(0, 2);
  }

  if (priceMin || priceMax) {
    body.list_price = {
      ...(priceMin ? { min: Number(priceMin) } : {}),
      ...(priceMax ? { max: Number(priceMax) } : {}),
    };
  }
  if (bedsMin) body.beds = { min: Number(bedsMin) };
  if (bathsMin) body.baths = { min: Number(bathsMin) };

  // Map UI home-type labels to RapidAPI "Realty in US" type codes (verified against /v3/list).
  const HOME_TYPE_CODES: Record<string, string> = {
    house: "single_family",
    apartment: "apartment",
    condo: "condos",
  };
  if (homeType && HOME_TYPE_CODES[homeType]) {
    body.type = [HOME_TYPE_CODES[homeType]];
  }

  const res = await fetch("https://realty-in-us.p.rapidapi.com/properties/v3/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "realty-in-us.p.rapidapi.com",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("RapidAPI error:", res.status, text);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 502 });
  }

  const data = await res.json();
  const results: Record<string, unknown>[] = data?.data?.home_search?.results ?? [];

  const properties = results.map((p) => {
    const loc = p.location as Record<string, unknown> | undefined;
    const addr = (loc?.address as Record<string, unknown> | undefined) ?? {};
    const desc = (p.description as Record<string, unknown> | undefined) ?? {};
    const photo = p.primary_photo as Record<string, unknown> | undefined;
    return {
      property_id: p.property_id as string,
      address: (addr.line as string) ?? "",
      city: (addr.city as string) ?? "",
      state_code: (addr.state_code as string) ?? "",
      postal_code: (addr.postal_code as string) ?? "",
      // Rentals leave list_price null and list the rent in list_price_min/max.
      price: (p.list_price as number) ?? (p.list_price_min as number) ?? null,
      price_max: forRent ? ((p.list_price_max as number) ?? null) : null,
      for_rent: forRent,
      beds: (desc.beds as number) ?? null,
      baths: (desc.baths_full_calc as number)?.toString() ?? null,
      sqft: (desc.sqft as number) ?? null,
      year_built: (desc.year_built as number) ?? null,
      photo_url: upgradePhotoUrl((photo?.href as string) ?? null),
      property_type: (desc.type as string) ?? null,
    };
  });

  const seen = new Set<string>();
  const unique = properties.filter((p) => {
    if (seen.has(p.property_id)) return false;
    seen.add(p.property_id);
    return true;
  });

  return NextResponse.json({ properties: unique });
}
