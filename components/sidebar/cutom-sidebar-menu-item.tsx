"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";
import { set } from "zod";
import { Button } from "../ui/button";
import axios from "axios";
import { useChatboxStore } from "@/store/chatbox-store";

interface Props {
  chat?: any;
  icon?: ReactNode;
  text?: string;
}

export default function CustomSidebarMenuItem({ chat, icon, text }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = chat ? pathname === `/c/${chat.chatId}` : false;
  const [dialogOpen, setDialogOpen] = useState(false);
  const chats = useChatboxStore((state) => state.chats);
  const setChats = useChatboxStore((state) => state.setChats);

  const handleDialog = () => {
    setDialogOpen(true);
  };

  const handleDeleteChat = async () => {
    if (!chat) return;
    try {
      await axios.delete("/api/chats/", {
        data: { chatId: chat.chatId },
      });
      const updatedChats = chats.filter((c) => c.chatId !== chat.chatId);
      setChats(updatedChats);
      setDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <>
      <SidebarMenuItem
        key={chat?.chatId}
        className="mx-1.5 hover-with-ellipsis"
      >
        {chat && (
          <Link href={`/c/${chat.chatId}`}>
            <SidebarMenuButton
              asChild
              className={cn(
                isActive ? "bg-white/5" : "dark:hover:bg-white/10",
                "py-2 px-2.5 min-h-9 text-sm overflow-ellipsis flex items-center gap-2"
              )}
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
                    <DropdownMenuItem
                      className="py-2! px-2.5! text-red-500! dark:text-red-400! rounded-xl hover:bg-red-400/10!"
                      onClick={handleDialog}
                    >
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

      {/* Moved Dialog outside */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="z-50 inset-0 fixed outline-none backdrop-blur-[1px] bg-black/50 p-0 flex items-center justify-center">
          <div className="bg-white dark:bg-[#2f2f2f] rounded-xl px-3 py-3 max-w-md w-full mx-auto">
            <DialogHeader className="p-0">
              <DialogTitle className="p-0 text-lg font-normal">
                Delete chat?
              </DialogTitle>
            </DialogHeader>

            <p className="pt-4 text-sm">
              This will delete <strong>New chat</strong>.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Visit settings to delete any memories saved during this chat.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setDialogOpen(false)}
                className="dark:bg-[#2f2f2f] dark:hover:bg-neutral-600/50!  text-white rounded-full border-1 py-0 px-3 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                className="border-1 max-h-9 rounded-full py-0 px-3 bg-[#e02e2a] text-white hover:bg-red-600/50"
                onClick={handleDeleteChat}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
