import OpenAI from "openai";
import { fetchNearbySchools } from "@/lib/schools";
import { createClient } from "@/lib/supabase/server";

const PROMPT = (address: string) => `You are a real estate market analyst. Analyze this property address and return a JSON object.

Address: ${address}

Return ONLY a raw JSON object with these exact fields:
{
  "address": "formatted address",
  "neighborhood": "neighborhood and city",
  "overview": "2-3 sentence market overview of this area",
  "marketCondition": "Seller's market" or "Buyer's market" or "Balanced market",
  "priceRange": { "low": number, "high": number },
  "matchScore": integer 60-98,
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "amenities": ["amenity with distance", "amenity with distance", "amenity with distance"],
  "walkScore": integer 40-99,
  "transitScore": integer 30-99,
  "schools": { "rating": integer 1-10, "summary": "one sentence on school district quality and fit for families" },
  "safety": { "level": "Low" or "Moderate" or "High", "summary": "one sentence on the area's crime/safety profile" }
}

For "safety.level", report the level of safety CONCERN — "Low" means a safe area, "High" means notable crime concern.
Base analysis on your knowledge of the city/neighborhood. Always return valid JSON, no markdown.`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { address } = await request.json();
  if (!address?.trim()) {
    return Response.json({ error: "Address is required" }, { status: 400 });
  }

  // Server-authoritative auth + rate limit. The browser's PlanContext is advisory
  // only; this is the real gate that protects OpenAI/RapidAPI spend.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Sign in to analyze an address" }, { status: 401 });
  }

  const { data: usage, error: usageError } = await supabase.rpc("consume_search");
  if (usageError) {
    return Response.json({ error: "Could not verify search quota" }, { status: 500 });
  }
  if (!usage?.allowed) {
    if (usage?.error === "no_profile") {
      return Response.json({ error: "Profile not found" }, { status: 403 });
    }
    return Response.json(
      { error: "Daily search limit reached — upgrade to Pro for unlimited searches", usage },
      { status: 429 },
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const [completion, schoolNames] = await Promise.all([
    client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: PROMPT(address) }],
    }),
    fetchNearbySchools(address),
  ]);

  const text = completion.choices[0]?.message?.content ?? "{}";
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    return Response.json({ error: "Analysis returned an invalid response — please try again" }, { status: 502 });
  }

  // Merge in real nearby schools (names + ratings) when available; the AI keeps
  // providing the rating/summary, and these are layered on top.
  if (schoolNames && schoolNames.length > 0) {
    result.schools = { ...(result.schools ?? {}), names: schoolNames };
  }

  // Surface the authoritative count so the client meter stays in sync.
  result.usage = usage;
  return Response.json(result);
}
