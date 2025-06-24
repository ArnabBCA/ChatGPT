"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SlidersIcon from "../icons/sliders-icon";
import MicIcon from "../icons/mic-icon";
import VoiceIcon from "../icons/voice-icon";
import { useChatboxStore } from "@/store/chatbox-store";
import axios from "axios";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { cn } from "@/lib/utils";
import { ArrowUp, FileText, X } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import Image from "next/image";
import { UploadCtxProvider } from "@uploadcare/react-uploader";

export default function Chatbox({ className = "" }: { className?: string }) {
  const [input, setInput] = useState("");
  const [uploadcarefiles, setUploadcareFiles] = useState<any[]>([]);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const [yValue, setYValue] = useState(0);

  const pathname = usePathname();
  const { chatId } = useParams();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const { setUserInput, setUserFiles, slideToBottom, setSlideToBottom } =
    useChatboxStore();
  const userFiles = useChatboxStore((state) => state.userFiles);

  const uploaderRef = useRef<InstanceType<UploadCtxProvider> | null>(null);

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

  const deleteFile = (internalId: string) => {
    const api = uploaderRef.current?.getAPI();
    api?.removeFileByInternalId(internalId);
  };

  function updateChatboxPosition() {
    const chatboxHeight = chatboxRef.current?.offsetHeight ?? 0;
    const chatboxYpos = chatboxRef.current?.getBoundingClientRect().y ?? 0;
    const windowHeight = window.innerHeight;
    const targetY = windowHeight - chatboxYpos - chatboxHeight - 24; // 24px bottom margin
    setYValue(targetY);
  }

  useEffect(() => {
    setSlideToBottom(false);
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
          {uploadcarefiles.length !== 0 && (
            <div className="w-full p-1 flex gap-2">
              {uploadcarefiles.map((file) => {
                const isImage = file.contentType.startsWith("image/");
                return (
                  <div
                    key={file.internalId}
                    className={cn(
                      "relative rounded-2xl",
                      isImage
                        ? "h-14.5 w-14.5 overflow-hidden"
                        : "p-2 max-w-60 sm:min-w-80 min-w-20 border-white/5 border flex items-center gap-2"
                    )}
                  >
                    <div
                      className="absolute cursor-pointer top-2 right-2 text-black bg-white rounded-full"
                      onClick={() => deleteFile(file.internalId)}
                    >
                      <X size={12} />
                    </div>

                    {isImage ? (
                      <Image
                        src={file.url}
                        height={100}
                        width={100}
                        alt={file.name || "Uploaded file"}
                      />
                    ) : (
                      <>
                        <div className="flex h-9 w-9 items-center justify-center bg-[#FF5588] rounded-[6px] ml-1">
                          <FileText size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {file.name || file.url}
                          </span>
                          <span className="font-light">{file.contentType}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
              <div className="relative min-w-[120.68px] min-h-[32.4px]">
                <FileUploaderRegular
                  apiRef={uploaderRef}
                  key={userFiles.length}
                  className="absolute"
                  useCloudImageEditor={false}
                  sourceList="local, gdrive"
                  pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY!}
                  onChange={(files) => {
                    setUploadcareFiles(
                      files.successEntries.map((file: any) => ({
                        name: file.name,
                        size: file.size,
                        url: file.cdnUrl,
                        internalId: file.internalId,
                        contentType: file.mimeType,
                      }))
                    );
                  }}
                />
              </div>
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
              <Button
                className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal size-8"
                variant={"ghost"}
                size={"icon"}
                type="button"
              >
                <MicIcon size={20} />
              </Button>
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
