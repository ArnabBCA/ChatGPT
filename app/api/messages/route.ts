import { auth } from "@clerk/nextjs/server";
import { appendClientMessage, appendResponseMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getChatsCollection, getMessagesCollection } from "@/lib/collection";
import { MemoryClient } from "mem0ai";

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

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messageId, chatId } = await req.json();
  const messagesCollection = await getMessagesCollection();

  try {
    // Get the chat by unique chatId (userId not needed in query anymore)
    const chat = await messagesCollection.findOne({ chatId });

    if (!chat) return new Response("Chat not found", { status: 404 });

    // Find the index of the message to delete from
    const index = chat.messages.findIndex((m: any) => m.id === messageId);
    if (index === -1) return new Response("Message not found", { status: 404 });

    // Keep only messages AFTER the deleted one
    const updatedMessages = chat.messages.slice(0, index);

    // Update messages in DB
    const result = await messagesCollection.updateOne(
      { chatId },
      { $set: { messages: updatedMessages } }
    );

    if (result.modifiedCount === 0) {
      console.error("Update failed — no documents matched");
      return new Response("Update failed", { status: 500 });
    }

    return Response.json(updatedMessages, { status: 200 });
  } catch (error) {
    console.error("Failed to delete messages:", error);
    return new Response("Internal Server Error", { status: 500 });
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
  const memory = new MemoryClient({
    apiKey: process.env.MEM0_API_KEY!,
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

  const searchResult = await memory.search(message.content, {
    user_id: userId,
  });

  const relevant = searchResult.map((r) => r.memory).join("\n");
  const systemPrompt = relevant
    ? `These are things I remember about you:\n${relevant}`
    : "You are a helpful AI assistant.";

  const result = streamText({
    model: google("models/gemini-2.0-flash"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    async onFinish({ response, text }) {
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
      const convo: { role: "user" | "assistant"; content: any }[] = [
        { role: "user", content: message.content },
        { role: "assistant", content: text },
      ];
      await memory.add(convo, { user_id: userId });
    },
  });

  return result.toDataStreamResponse();
}
