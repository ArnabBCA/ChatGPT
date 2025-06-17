import ChatHeader from "@/components/chat/chat-header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col">
      <ChatHeader />
      {children}
    </div>
  );
}
