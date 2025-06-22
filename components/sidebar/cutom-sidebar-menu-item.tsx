import Link from "next/link";
import { ReactNode } from "react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Ellipsis, Pencil, Trash2, Upload } from "lucide-react";

interface Props {
  chat?: any;
  icon?: ReactNode;
  text?: string;
}

export default function CustomSidebarMenuItem({ chat, icon, text }: Props) {
  return (
    <SidebarMenuItem key={chat?.chatId} className="mx-1.5 hover-with-ellipsis">
      {chat && (
        <Link href={`/c/${chat.chatId}`}>
          <SidebarMenuButton
            asChild
            className="py-2 px-2.5 min-h-9 text-sm overflow-ellipsis flex items-center gap-2"
          >
            <div className="flex items-center w-full justify-between">
              <span className="truncate text-ellipsis whitespace-nowrap">
                {chat.title || "New Chat"}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer outline-0 opacity-0 transition-opacity duration-0 hover-with-ellipsis:hover:opacity-100">
                  <Ellipsis size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute left-[-40px] dark:bg-[#353535] rounded-2xl shadow-long duration-0">
                  <DropdownMenuItem className="py-2! px-2.5! dark:text-white rounded-xl dark:hover:bg-neutral-500/30">
                    <Upload className="text-inherit" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2! px-2.5! dark:text-white rounded-xl dark:hover:bg-neutral-500/30">
                    <Pencil className="text-inherit" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-2.5" />
                  <DropdownMenuItem className="py-2! px-2.5! dark:text-white rounded-xl dark:hover:bg-neutral-500/30">
                    <Archive className="text-inherit" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2! px-2.5! text-red-500! dark:text-red-400! rounded-xl hover:bg-red-400/10!">
                    <Trash2 className="text-inherit" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarMenuButton>
        </Link>
      )}
      {text && (
        <span className="py-2 px-2.5 min-h-9 text-sm overflow-ellipsis flex items-center gap-2 text-muted-foreground">
          {text}
        </span>
      )}
    </SidebarMenuItem>
  );
}
