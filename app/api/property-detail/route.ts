import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const property_id = req.nextUrl.searchParams.get("property_id");
  if (!property_id) {
    return NextResponse.json({ error: "property_id is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://realty-in-us.p.rapidapi.com/properties/v3/detail?property_id=${property_id}`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "realty-in-us.p.rapidapi.com",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch property detail" }, { status: 502 });
  }

  const data = await res.json();
  const desc = data?.data?.home?.description ?? {};

  return NextResponse.json({
    year_built: (desc.year_built as number) ?? null,
    baths: (desc.baths_consolidated as string) ?? (desc.baths_full_calc as number)?.toString() ?? null,
  });
}
