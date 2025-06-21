"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Logo from "./icons/logo-icon";
import { Button } from "./ui/button";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useChatboxStore } from "@/store/chatbox-store";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const chats = useChatboxStore((state) => state.chats);

  return (
    <Sidebar className="dark:border-[var(--sidebar-chatgpt-border)]">
      <SidebarHeader className="px-2 py-0 flex justify-between flex-row header-height items-center">
        <Link href={"/"}>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-200/70 dark:hover:!bg-neutral-700/80"
          >
            <Logo size={24} />
          </Button>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="mx-1.5 py-2 px-2.5 min-h-9 text-sm overflow-ellipsis text-muted-foreground">
              Chats
            </SidebarMenuItem>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.chatId} className="mx-1.5">
                <Link href={`/c/${chat.chatId}`}>
                  <SidebarMenuButton
                    asChild
                    className="py-2 px-2.5 min-h-9 text-sm overflow-ellipsis"
                  >
                    <span>{chat.title || "New Chat"}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
