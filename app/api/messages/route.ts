import { auth } from "@clerk/nextjs/server";
import { appendClientMessage, appendResponseMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getChatsCollection, getMessagesCollection } from "@/lib/collection";

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

  const messagesCollection = await getMessagesCollection();
  const chatsCollection = await getChatsCollection();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const { message, id } = await req.json();

  function formatTitle(str: string) {
    if (!str) return;
    const sliced = str.slice(0, 50);
    return sliced.charAt(0).toUpperCase() + sliced.slice(1);
  }

  //update chat title if it exists
  try {
    const chat = await chatsCollection.findOne({ chatId: id, userId });

    const update: any = { updatedAt: new Date() };

    if (chat?.title === "New Chat") {
      update.title = formatTitle(message.content);
    }

    await chatsCollection.updateOne({ chatId: id, userId }, { $set: update });
  } catch (error) {
    console.error("Failed to update chat title:", error);
  }

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
