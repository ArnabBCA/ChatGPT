import { auth } from "@clerk/nextjs/server";
import { getChatsCollection } from "@/lib/collection";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const chatsCollection = await getChatsCollection();

  try {
    const chats = await chatsCollection
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    return Response.json(chats || [], { status: 200 });
  } catch (err) {
    console.error("Failed to fetch chats:", err);
    return new Response("Failed to fetch chats", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { chatId } = await req.json();

  if (!chatId) {
    return new Response("chatId is required", { status: 400 });
  }

  const chatsCollection = await getChatsCollection();

  try {
    const isValidChatId = await chatsCollection.findOne({
      chatId,
      userId,
    });

    if (!isValidChatId) {
      return new Response("Invalid chatId", { status: 400 });
    }
    return Response.json("Valid chatId", { status: 200 });
  } catch (error) {
    return new Response("Failed to validate chatId", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const chatsCollection = await getChatsCollection();

  let title: string | undefined;
  let chatId: string | undefined;

  // Gracefully parse JSON if it exists and is valid
  try {
    const text = await req.text();
    if (text) {
      const body = JSON.parse(text);
      title = body.title;
      chatId = body.chatId;
    }
  } catch {
    // Do nothing — just assume it's a new chat without data
  }

  const isNewChat = !chatId;
  const newChatId = isNewChat ? crypto.randomUUID() : chatId;

  try {
    await chatsCollection.findOneAndUpdate(
      { chatId: newChatId, userId },
      {
        $set: {
          updatedAt: new Date(),
          title: title || "New Chat",
        },
        ...(isNewChat && {
          $setOnInsert: { createdAt: new Date() },
        }),
      },
      { upsert: isNewChat }
    );

    return isNewChat
      ? Response.json({ chatId: newChatId })
      : Response.json("Updated Chat Title", { status: 200 });
  } catch (err) {
    console.error("Failed to create/update chat:", err);
    return new Response("Failed to update chat", { status: 500 });
  }
}
