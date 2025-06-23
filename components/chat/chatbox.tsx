"use client";

import { useEffect, useRef, useState } from "react";
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
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function Chatbox({ className = "" }: { className?: string }) {
  const [input, setInput] = useState("");
  const [uploadcarefiles, setUploadcareFiles] = useState<any[]>([]);
  const chatboxRef = useRef<HTMLDivElement>(null); // ✅ Ref to measure height
  const [yValue, setYValue] = useState(0);

  const pathname = usePathname();
  const { chatId } = useParams();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const { setUserInput, setUserFiles, slideToBottom, setSlideToBottom } =
    useChatboxStore();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called");
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    setUserInput(trimmed);
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
    setUserFiles(uploadcarefiles);

    setUploadcareFiles([]);
    setInput("");
  };

  function updateChatboxPosition() {
    const chatboxHeight = chatboxRef.current?.offsetHeight ?? 0;
    const chatboxYpos = chatboxRef.current?.getBoundingClientRect().y ?? 0;
    const windowHeight = window.innerHeight;
    const targetY = windowHeight - chatboxYpos - chatboxHeight - 24; // 24px bottom margin
    setYValue(targetY);
  }

  useEffect(() => {
    if (pathname !== "/") {
      setSlideToBottom(false);
    }
    // Initial call
    updateChatboxPosition();
    // Add event listener
    window.addEventListener("resize", updateChatboxPosition);
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", updateChatboxPosition);
    };
  }, [pathname]);

  return (
    <div className={cn(className, "w-full mx-auto")}>
      <motion.div
        animate={
          pathname === "/" && !isMobile && slideToBottom && { y: yValue }
        }
        transition={{ type: "tween", duration: 0.25 }}
        className={"mx-auto flex w-full flex-col max-w-[48rem] items-center"}
        ref={chatboxRef}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[28px] overflow-hidden p-2.5 dark:bg-[#303030] shadow-short"
        >
          <Textarea
            className="w-full border-none focus-visible:border-none focus-visible:ring-0 shadow-none !bg-transparent pb-0 pt-[7px] px-3 pl-[11px] min-h-12 !text-[16px] font-normal hide-resizer placeholder:font-normal"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
          />
          <div className="w-full flex items-center justify-between mt-2">
            <div className="flex items-center gap-[1px]">
              {/* Uploadcare file uploader */}
              <div className="relative min-w-[120.68px] min-h-[32.4px]">
                <FileUploaderRegular
                  className="absolute"
                  useCloudImageEditor={false}
                  sourceList="local, gdrive"
                  pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY!}
                  onFileUploadSuccess={(file) => {}}
                  onChange={(files) => {
                    setUploadcareFiles(
                      files.successEntries.map((file: any) => ({
                        name: file.name,
                        size: file.size,
                        url: file.cdnUrl,
                        contentType: file.mimeType,
                      }))
                    );
                  }}
                />
              </div>

              {/* Tools Button */}
              <Button
                className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal flex items-center gap-1.5 !px-2"
                variant={"ghost"}
                type="button"
              >
                <SlidersIcon size={20} />
                <span className="pb-[1px]">Tools</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Mic Button */}
              <Button
                className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal size-8"
                variant={"ghost"}
                size={"icon"}
                type="button"
              >
                <MicIcon size={20} />
              </Button>

              {/* Send Button */}
              {input.trim() ? (
                <Button
                  className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-300/85 hover:text-black rounded-full font-normal dark:bg-white text-black"
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => handleSubmit(e)}
                >
                  <ArrowUp size={20} />
                </Button>
              ) : (
                <Button
                  className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-200 dark:hover:!bg-neutral-500/80 rounded-full font-normal bg-[#00000014] dark:bg-[#ffffff29]"
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => handleSubmit(e)}
                >
                  <VoiceIcon size={20} />
                </Button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
