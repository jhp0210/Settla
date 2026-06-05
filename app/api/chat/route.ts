import OpenAI from "openai";

const SYSTEM_PROMPT =
  "You are a housing market assistant for Settla, a real estate search platform. You help users with questions about the housing market, property searches, home buying/selling tips, mortgage basics, neighborhood comparisons, and how to use the app. Be concise, friendly, and expert. If asked about something unrelated to real estate or the app, politely redirect.";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("OPENAI_API_KEY is not configured.", { status: 500 });
  }

  const { messages } = await request.json();
  const client = new OpenAI({ apiKey });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 1024,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`Error: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
