// lib/collections.ts
import { Message, Chat } from "@/types/types";
import { getDb } from "./mongodb";
import { Collection } from "mongodb";

export async function getChatsCollection(): Promise<Collection<Chat>> {
  const db = await getDb();
  return db.collection<Chat>("chats");
}

export async function getMessagesCollection(): Promise<Collection<Message>> {
  const db = await getDb();
  return db.collection<Message>("messages");
} // update this asweel
