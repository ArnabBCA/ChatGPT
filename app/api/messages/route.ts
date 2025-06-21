import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getMessagesCollection } from "@/lib/collection";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");

  if (!chatId) {
    return new Response("Missing chatId", { status: 400 });
  }

  const messagesCollection = await getMessagesCollection();
  const messages = await messagesCollection.find({ chatId }).toArray();

  return Response.json(messages, { status: 200 });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messages, id } = await req.json();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const messagesCollection = await getMessagesCollection();

  const result = streamText({
    model: google("models/gemini-2.0-flash"),
    messages,
    onFinish: async ({ text, finishReason, usage, response }) => {
      try {
        const lastMessage = messages[messages.length - 1];
        await messagesCollection.insertOne({
          chatId: id,
          role: lastMessage.role,
          content: lastMessage.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await messagesCollection.insertOne({
          chatId: id,
          role: "assistant",
          content: text,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (err) {
        console.error("Failed to process onFinish:", err);
      }
    },
    onError: (error) => {
      console.error("Error during streaming:", error);
    },
  });

  return result.toDataStreamResponse();
}
