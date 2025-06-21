"use client";

import ChatHeader from "@/components/chat/chat-header";
import Chatbox from "@/components/chat/chatbox";
import { ReactNode } from "react";
import { useChatboxStore } from "@/store/chatbox-store";
import axios from "axios";
import { useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { setChats } = useChatboxStore();

  const getAllChats = async () => {
    try {
      const res = await axios.get("/api/chats");
      setChats(res.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    getAllChats();
  }, []);
  
  return (
    <div className="flex h-screen w-full flex-col">
      <ChatHeader />
      <div className="h-full w-full flex justify-center relative">
        {children}
        <Chatbox />
      </div>
    </div>
  );
}
