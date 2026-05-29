import OpenAI from "openai";

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
  "transitScore": integer 30-99
}

Base analysis on your knowledge of the city/neighborhood. Always return valid JSON, no markdown.`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { address } = await request.json();
  if (!address?.trim()) {
    return Response.json({ error: "Address is required" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 600,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: PROMPT(address) }],
  });

  const text = completion.choices[0]?.message?.content ?? "{}";
  return Response.json(JSON.parse(text));
}
