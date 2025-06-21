"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SlidersIcon from "../icons/sliders-icon";
import PlusIcon from "../icons/plus-icon";
import MicIcon from "../icons/mic-icon";
import VoiceIcon from "../icons/voice-icon";
import { useChatboxStore } from "@/store/chatbox-store";
import axios from "axios";

export default function Chatbox() {
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const { chatId } = useParams();
  const router = useRouter();

  const {
    setUserInput,
    slideToBottom,
    fixedToBottom,
    setSlideToBottom,
    setFixedToBottom,
  } = useChatboxStore();

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setUserInput(trimmed);
    setInput("");
    setSlideToBottom(true);

    if (!chatId) {
      try {
        const res = await axios.patch("/api/chats");
        const { chatId } = res.data;
        router.push(`/c/${chatId}`);
      } catch (error) {
        console.error("Failed to create chat:", error);
        return;
      }
    }
  };

  // Set correct bottom state on mount depending on path
  useEffect(() => {
    if (pathname === "/") {
      setSlideToBottom(false);
      setFixedToBottom(false);
    } else {
      setSlideToBottom(false);
      setFixedToBottom(true);
    }
  }, [pathname]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex w-full flex-col max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem] items-center mt-[-25px]"
      initial={pathname === "/" ? { y: 0 } : { y: "calc(100vh - 450px)" }}
      animate={
        slideToBottom
          ? { y: "calc(100vh - 450px)" }
          : fixedToBottom
          ? { y: "calc(100vh - 450px)" }
          : { y: 0 }
      }
      transition={
        slideToBottom ? { type: "tween", duration: 0.2 } : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (slideToBottom) {
          setSlideToBottom(false);
          setFixedToBottom(true);
        }
      }}
    >
      <div className="w-full rounded-[28px] overflow-hidden p-2.5 dark:bg-[#303030] shadow-short">
        <Textarea
          className="w-full border-none focus-visible:border-none focus-visible:ring-0 shadow-none !bg-transparent pb-0 pt-[7px] px-3 pl-[11px] min-h-12 !text-[16px] font-normal hide-resizer placeholder:font-normal"
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-[1px]">
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal"
              variant={"ghost"}
              size={"icon"}
            >
              <PlusIcon size={20} />
            </Button>
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal flex items-center gap-1.5 !px-2"
              variant={"ghost"}
            >
              <SlidersIcon size={20} />
              <span className="pb-[1px]">Tools</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal size-8"
              variant={"ghost"}
              size={"icon"}
            >
              <MicIcon size={20} />
            </Button>
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-200 dark:hover:!bg-neutral-500/80 rounded-full font-normal bg-[#00000014] dark:bg-[#ffffff29]"
              variant={"ghost"}
              size={"icon"}
              onClick={handleSubmit}
            >
              <VoiceIcon size={20} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
