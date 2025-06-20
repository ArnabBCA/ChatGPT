"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useChatboxStore } from "@/store/chatbox-store";
import { useParams } from "next/navigation";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatId() {
  const { chatId } = useParams();
  const { messages, append } = useChat({
    api: "/api/chat",
    id: Array.isArray(chatId) ? chatId[0] : chatId,
  });

  const pendingMessage = useChatboxStore((state) => state.pendingMessage);
  const setPendingMessage = useChatboxStore((state) => state.setPendingMessage);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingMessage) {
      console.log("Appending pending message:", pendingMessage);
      append({ role: "user", content: pendingMessage });
      setPendingMessage(null);
    }
  }, [pendingMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full items-center h-[calc(100vh-10rem)] overflow-y-auto py-5 px-[calc(0.25rem*6)] pb-25 outline-0 ring-0">
      <div className="flex flex-col gap-10 h-full w-full max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem]">
        {messages.map((msg, i) => (
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
