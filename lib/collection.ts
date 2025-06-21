// lib/collections.ts
import { getDb } from "./mongodb";
import { Collection } from "mongodb";

export async function getChatsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection("chats");
}

export async function getMessagesCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection("messages");
}
