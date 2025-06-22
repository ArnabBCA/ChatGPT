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
      <div className="h-full w-full flex justify-center relative">
        {children}
        <Chatbox />
        {pathname !== "/" && (
          <div className="text-xs absolute bottom-0 w-full text-center min-h-8 p-2 md:px-[60px]">
            ChatGPT can make mistakes. Check important info. See{" "}
            <a href="#" className="underline">
              Cookie Preferences
            </a>
            .
          </div>
        )}
      </div>
    </div>
  );
}
