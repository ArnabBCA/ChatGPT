import { auth } from "@clerk/nextjs/server";
import { appendClientMessage, appendResponseMessages, streamText } from "ai";
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
  try {
    const chat = await messagesCollection.find({ chatId: chatId }).toArray();
    return Response.json(chat[0]?.messages || [], { status: 200 });
  } catch (error) {
    console.error("Failed to get all old messages:", error);
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { message, id } = await req.json();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const messagesCollection = await getMessagesCollection();

  const getAllOldMessages = async () => {
    try {
      const chat = await messagesCollection.find({ chatId: id }).toArray();
      return chat[0]?.messages || [];
    } catch (error) {
      console.error("Failed to get all old messages:", error);
    }
  };

  const messages = appendClientMessage({
    messages: await getAllOldMessages(),
    message,
  });

  const result = streamText({
    model: google("models/gemini-2.0-flash"),
    messages,
    async onFinish({ response }) {
      await messagesCollection.findOneAndUpdate(
        { chatId: id },
        {
          $set: {
            messages: appendResponseMessages({
              messages,
              responseMessages: response.messages,
            }),
          },
        },
        {
          upsert: true,
        }
      );
    },
  });

  return result.toDataStreamResponse();
}
