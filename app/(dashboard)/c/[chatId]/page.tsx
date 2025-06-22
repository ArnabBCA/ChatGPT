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
import AiMessageActionButtons from "@/components/chat/ai-meesage-action-buttons";

export default function ChatId() {
  const { chatId } = useParams();
  const router = useRouter();
  const { setUserInput, setUserFiles, setIsFinished } = useChatboxStore();

  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [oldMessages, setOldMessages] = useState<any[]>([]);
  //const [isOverflowing, setIsOverflowing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isFinishedState, setIsFinishedState] = useState(false);

  const userInput = useChatboxStore((state) => state.userInput);
  const userFiles = useChatboxStore((state) => state.userFiles);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!chatId || typeof chatId !== "string") return null;

  const { messages, append } = useChat({
    api: "/api/messages",
    id: chatId,
    sendExtraMessageFields: true,
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    onFinish: () => {
      setIsFinishedState(true);
    },
    onResponse: () => {
      setIsThinking(false);
    },
  });

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
        setLoading(true);
        const res = await axios.get(`/api/messages?chatId=${chatId}`);
        setOldMessages(res.data || []);
      } catch (error) {
        console.error("Failed to fetch old messages:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100); // Simulate loading delay
      }
    };

    isValidChatId();
    getOldMessages();
  }, [chatId]);

  useEffect(() => {
    if (userInput?.trim() || userFiles?.length) {
      setIsThinking(true);
      (async () => {
        append({
          role: "user",
          content: userInput ?? "",
          experimental_attachments: userFiles,
        });
        setUserInput(""); // Clear input after appending
        setUserFiles([]);
      })();
    }
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userInput, userFiles]);

  useEffect(() => {
    const merged = [...oldMessages, ...messages];

    // Remove duplicates by `id`, keeping the last occurrence
    const unique = Array.from(
      new Map(merged.map((msg) => [msg.id, msg])).values()
    );

    setAllMessages(unique);
  }, [messages, oldMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
    /*if (containerRef.current) {
      setIsOverflowing(
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      );
    }*/
  }, [loading]);

  useEffect(() => {
    setIsFinished(isFinishedState);
  }, [isFinishedState]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col w-full items-center h-[calc(100vh-10.5rem)] overflow-y-auto py-5 pb-25 outline-0 ring-0 pr-2 pl-6"
        //"px-6"
      )}
    >
      <div className="flex flex-col gap-10 h-full w-full max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem] mt-1.5">
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap w-full prose prose-neutral dark:prose-invert ${
              msg.role === "user"
                ? "self-end px-5 pt-2.5 pb-1 dark:bg-[#323232d9] dark:text-white rounded-3xl mb-[42px] max-w-max wrap-anywhere"
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
                {typeof msg.content === "string" ? msg.content : ""}
              </ReactMarkdown>
              {msg.experimental_attachments &&
                msg.experimental_attachments.length > 0 && (
                  <div>
                    {msg.experimental_attachments.map((file: any) => (
                      <div key={file.url} className="mb-1">
                        <a
                          href={file.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {file.name || `Attachment ${file.url + 1}`}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            {msg.role !== "user" && <AiMessageActionButtons />}
          </div>
        ))}
        {isThinking && (
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-white animate-[scaleUpDown_1.2s_ease-in-out_infinite]" />
          </div>
        )}
        <div
          ref={scrollRef}
          className={cn(
            "w-full pb-[calc(100vh-300px)]",
            messages.length > 2 ? "pb-[calc(100vh-300px)]" : "pb-25"
          )}
        ></div>
      </div>
    </div>
  );
}
