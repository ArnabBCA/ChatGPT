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
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../icons/logo-icon";
import { Button } from "../ui/button";

import { useChatboxStore } from "@/store/chatbox-store";
import Link from "next/link";
import CustomSidebarMenuItem from "./cutom-sidebar-menu-item";
import { cn } from "@/lib/utils";
import { Images, Search, SquarePen } from "lucide-react";

export function AppSidebar() {
  const chats = useChatboxStore((state) => state.chats);
  const { open, isMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        open ? "" : "",
        "dark:border-[var(--sidebar-chatgpt-border)]!"
      )}
    >
      <SidebarHeader
        className={cn(
          open ? "" : "",
          "px-0 py-0 flex flex-row header-height items-center justify-between"
        )}
      >
        <div
          className={`relative se flex items-center ${!open ? "group" : ""}`}
        >
          {/* Logo Link — visible by default, hidden on hover when sidebar is closed */}
          <Link
            href="/"
            className={`transition-opacity duration-200 ${
              !open ? "group-hover:hidden" : ""
            }`}
          >
            <Button
              size="icon"
              variant="ghost"
              className="ml-1.25 [&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-200/70 dark:hover:!bg-neutral-700/80"
            >
              <Logo size={24} />
            </Button>
          </Link>

          {/* Sidebar Trigger — hidden by default, shown on hover when sidebar is closed */}
          {!open && (
            <div className="hidden pl-[5.5px] group-hover:block transition-opacity duration-200">
              <SidebarTrigger />
            </div>
          )}
        </div>
        {open && <SidebarTrigger className="px-2 mr-1.25" />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0 sticky top-0 bg-sidebar z-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              <Link href={`/`}>
                <SidebarMenuItem className="mx-1.5 hover-with-ellipsis">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "dark:hover:bg-white/10",
                      "py-2 px-2.5 min-h-9 text-sm overflow-ellipsis flex items-center gap-2 min-w-9"
                    )}
                  >
                    <div className="flex items-center w-full">
                      <SquarePen />
                      {open && (
                        <span className="truncate text-ellipsis whitespace-nowrap">
                          New Chat
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
              <SidebarMenuItem className="mx-1.5 hover-with-ellipsis">
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "dark:hover:bg-white/10",
                    "py-2 px-2.5 min-h-9 text-sm overflow-ellipsis flex items-center gap-2 min-w-9"
                  )}
                >
                  <div className="flex items-center w-full">
                    <Search />
                    {open && (
                      <span className="truncate text-ellipsis whitespace-nowrap">
                        Search Chat
                      </span>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mx-1.5 hover-with-ellipsis">
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "dark:hover:bg-white/10",
                    "py-2 px-2.5 min-h-9 text-sm overflow-ellipsis flex items-center gap-2 min-w-9"
                  )}
                >
                  <div className="flex items-center w-full">
                    <Images />
                    {open && (
                      <span className="truncate text-ellipsis whitespace-nowrap">
                        Libary
                      </span>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {open && (
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                <CustomSidebarMenuItem text="Chats" />
                {chats.map((chat) => (
                  <CustomSidebarMenuItem chat={chat} key={chat.chatId} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
