"use client";
import { ChevronDown } from "lucide-react";
import EditChatIcon from "../icons/edit-chat-icon";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useChatboxStore } from "@/store/chatbox-store";
import axios from "axios";
import { use, useEffect } from "react";

export default function ChatHeader() {
  const { open } = useSidebar();

  const { setChats, setIsFinished } = useChatboxStore();
  const isFinished = useChatboxStore((state) => state.isFinished);

  const getAllChats = async () => {
    console.log("Fetching all chats...");
    try {
      const res = await axios.get("/api/chats");
      setChats(res.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    if (!isFinished) return;
    getAllChats();
  }, [isFinished]);

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <div className="header-height w-full p-2 flex items-center justify-between">
      <div className="flex items-center">
        {!open && <SidebarTrigger />}
        {!open && (
          <Button
            size={"icon"}
            variant={"ghost"}
            className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-[var(--menu-button-highlighted)]"
          >
            <EditChatIcon />
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
        <ThemeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
