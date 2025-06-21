"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatboxStore } from "@/store/chatbox-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ChatId() {
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [oldMessages, setOldMessages] = useState<any[]>([]);
  const { chatId } = useParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const pendingMessage = useChatboxStore((state) => state.pendingMessage);

  // Prevent running if chatId is undefined (especially during SSR)
  if (!chatId || typeof chatId !== "string") return null;

  const { messages, append } = useChat({
    api: "/api/messages",
    id: chatId,
    sendExtraMessageFields: true,
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
  });

  // Validate chatId on mount
  useEffect(() => {
    const isValidChatId = async () => {
      try {
        const res = await axios.post("/api/chats", { chatId });
        if (res.status !== 200) {
          console.error("Invalid chatId:", chatId);
          router.push("/");
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          console.error("Invalid chatId:", chatId);
        } else {
          console.error("Failed to validate chatId:", error);
        }
        router.push("/");
      }
    };

    const getOldMessages = async () => {
      try {
        const res = await axios.get(`/api/messages?chatId=${chatId}`);
        setOldMessages(res.data || []);
        console.log("Fetched old messages:", res.data);
      } catch (error) {
        console.error("Failed to fetch old messages:", error);
      }
    };

    isValidChatId();
    getOldMessages();
  }, [chatId]);

  // Append pending message
  useEffect(() => {
    if (pendingMessage?.trim()) {
      append({
        role: "user",
        content: pendingMessage,
      });
    }
  }, [pendingMessage]);

  // Combine new and old messages into allMessages
  useEffect(() => {
    setAllMessages([...oldMessages, ...messages]);
  }, [messages, oldMessages]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Detect overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollHeight > containerRef.current.clientHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [allMessages]);
  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col w-full items-center h-[calc(100vh-10rem)] overflow-y-auto py-5 pb-25 outline-0 ring-0",
        isOverflowing ? "pr-2 pl-6" : "px-6"
      )}
    >
      <div className="flex flex-col gap-10 h-full w-full max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem]">
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap w-full prose prose-neutral dark:prose-invert ${
              msg.role === "user"
                ? "self-end px-5 pt-2.5 pb-1 dark:bg-[#323232d9] dark:text-white rounded-3xl mb-[42px] max-w-max "
                : "self-start"
            }`}
          >
            <div className="markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <SyntaxHighlighter
                        wrapLongLines={true}
                        style={vscDarkPlus as any}
                        language={match[1]}
                        customStyle={{
                          borderRadius: "0.75rem",
                          padding: "1rem",
                          backgroundColor: "#171717",
                        }}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="dark:bg-[#424242] px-[0.3rem] py-[0.15rem] rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={scrollRef} className="w-full pb-25"></div>
      </div>
    </div>
  );
}
