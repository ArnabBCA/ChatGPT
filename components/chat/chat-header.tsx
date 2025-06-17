"use client";
import { ChevronDown } from "lucide-react";
import EditChatIcon from "../icons/edit-chat-icon";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export default function ChatHeader() {
  const { open } = useSidebar();
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
      <ThemeToggle />
    </div>
  );
}
