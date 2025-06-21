import { auth } from "@clerk/nextjs/server";
import { getChatsCollection } from "@/lib/collection";

export async function POST(req: Request) {
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
