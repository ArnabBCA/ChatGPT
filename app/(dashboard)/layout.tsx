import ChatHeader from "@/components/chat/chat-header";
import Chatbox from "@/components/chat/chatbox";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
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
