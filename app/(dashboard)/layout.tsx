import ChatHeader from "@/components/chat/chat-header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-svh w-full flex-col">
      <ChatHeader />
      <div className="h-full w-full flex justify-center flex-col">
        {children}
      </div>
    </div>
  );
}
