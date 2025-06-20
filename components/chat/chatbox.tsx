"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SlidersIcon from "../icons/sliders-icon";
import PlusIcon from "../icons/plus-icon";
import MicIcon from "../icons/mic-icon";
import VoiceIcon from "../icons/voice-icon";
import { useChatboxStore } from "@/store/chatbox-store";
import { cn } from "@/lib/utils";

export default function Chatbox() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    input,
    setInput,
    setPendingMessage,
    slideToBottom,
    fixedToBottom,
    setSlideToBottom,
    setFixedToBottom,
  } = useChatboxStore();

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setPendingMessage(trimmed);
    setInput("");
    setSlideToBottom(true);

    router.push(`/c/33`);
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
      className="absolute flex w-full flex-col max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem] items-center mb-4"
      initial={pathname === "/" ? { y: 0 } : { y: "calc(100vh - 100% - 80px)" }}
      animate={
        slideToBottom
          ? { y: "calc(100vh - 100% - 80px)" }
          : fixedToBottom
          ? { y: "calc(100vh - 100% - 80px)" }
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
      <h1
        className={cn(
          "text-2xl leading-9 font-semibold mb-7 text-page-header min-h-10.5 min-[510px]:mt-[cal(25dvh-52px)] max-[768px]:mt-[cal(25dvh-52px)] lg:mt-[calc(30dvh-27px)]",
          pathname !== "/" && "invisible"
        )}
      >
        What are you working on?
      </h1>

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
