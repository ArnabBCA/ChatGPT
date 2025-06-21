import { auth } from "@clerk/nextjs/server";
import { getChatsCollection } from "@/lib/collection";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const chatsCollection = await getChatsCollection();

  try {
    const chats = await chatsCollection.find({ userId }).toArray();

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
  const newChatId = crypto.randomUUID();

  let chatTitle = "New Chat";

  try {
    const body = await req.json();
    chatTitle = body.chatTitle || "New Chat";
  } catch (err) {
    console.warn("Using default chatTitle");
  }

  try {
    await chatsCollection.findOneAndUpdate(
      {
        chatId: newChatId,
        userId,
      },
      {
        $set: {
          updatedAt: new Date(),
          title: chatTitle || "New Chat",
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return Response.json({ chatId: newChatId });
  } catch (err) {
    console.error("Failed to Create Update Chat:", err);
    return new Response("Failed to update chat", { status: 500 });
  }
}
