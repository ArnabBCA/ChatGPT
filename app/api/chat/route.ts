import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const result = streamText({
    model: google("models/gemini-2.0-flash"),
    messages,
  });

  return result.toDataStreamResponse();
}
