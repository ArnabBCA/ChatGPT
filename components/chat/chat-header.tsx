"use client";
import { AlignLeft, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useChatboxStore } from "@/store/chatbox-store";
import axios from "axios";
import { useEffect } from "react";

export default function ChatHeader() {
  const { isMobile, toggleSidebar } = useSidebar();

  const { setChats } = useChatboxStore();
  const isFinished = useChatboxStore((state) => state.isFinished);

  const getAllChats = async () => {
    try {
      const res = await axios.get("/api/chats");
      setChats(res.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    if (!isFinished) return;
    getAllChats(); // Only fetch chats to update (UI) after getting response from the AI
  }, [isFinished]);

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <div className="header-height w-full p-2 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <Button
            size={"icon"}
            variant={"ghost"}
            className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-[var(--menu-button-highlighted)]"
            onClick={toggleSidebar}
          >
            <AlignLeft />
          </Button>
        )}
        <Button
          variant={"ghost"}
          className="hover:!bg-neutral-200/80 dark:hover:!bg-neutral-700 text-lg font-normal flex items-center gap-1 !px-2.5"
        >
          ChatGPT
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {/*<ThemeToggle />*/}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
