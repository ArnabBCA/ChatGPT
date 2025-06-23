"use client";

import ChatHeader from "@/components/chat/chat-header";
import Chatbox from "@/components/chat/chatbox";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-screen w-full flex-col">
      <ChatHeader />
      <div className="h-full w-full flex justify-center flex-col">
        {children}
      </div>
    </div>
  );
}
