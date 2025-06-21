import { ObjectId } from "mongodb";

export interface Chat {
  _id?: ObjectId;
  userId: string;
  chatId: string; // ✅ add this if not already present
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id?: ObjectId;
  chatId: string; // ✅ changed from ObjectId to string
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  updatedAt: Date;
} // no insted oof interface i want teh schema
