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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Logo from "../icons/logo-icon";
import { Button } from "../ui/button";

import { useChatboxStore } from "@/store/chatbox-store";
import Link from "next/link";
import CustomSidebarMenuItem from "./cutom-sidebar-menu-item";

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
            <CustomSidebarMenuItem text="Chats" />
            {chats.map((chat) => (
              <CustomSidebarMenuItem chat={chat} key={chat.chatId} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
