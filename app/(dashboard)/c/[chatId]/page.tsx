"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { useChatboxStore } from "@/store/chatbox-store";
import RenderMessage from "@/components/chat/render-message";

export default function ChatId() {
  const { chatId } = useParams();
  const router = useRouter();
  const { setUserInput, setUserFiles, setIsFinished } = useChatboxStore();

  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [oldMessages, setOldMessages] = useState<any[]>([]);
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
    experimental_prepareRequestBody: ({ messages, id }) => ({
      message: messages[messages.length - 1],
      id,
    }),
    onFinish: () => setIsFinishedState(true),
    onResponse: () => setIsThinking(false),
  });

  useEffect(() => {
    const validateChat = async () => {
      try {
        const res = await axios.post("/api/chats", { chatId });
        if (res.status !== 200) router.push("/");
      } catch (error: any) {
        console.error("Chat ID validation error:", error);
        router.push("/");
      }
    };

    const fetchOldMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/messages?chatId=${chatId}`);
        setOldMessages(res.data || []);
      } catch (error) {
        console.error("Fetching messages failed:", error);
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };

    validateChat();
    fetchOldMessages();
  }, [chatId]);

  useEffect(() => {
    if (userInput?.trim() || userFiles?.length) {
      setIsThinking(true);
      append({
        role: "user",
        content: userInput ?? "",
        experimental_attachments: userFiles,
      });
      setUserInput("");
      setUserFiles([]);
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userInput, userFiles]);

  useEffect(() => {
    const merged = [...oldMessages, ...messages];
    const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
    setAllMessages(unique);
  }, [messages, oldMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" });
  }, [loading]);

  useEffect(() => {
    setIsFinished(isFinishedState);
  }, [isFinishedState]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full items-center h-[calc(100vh-10.5rem)] overflow-y-auto py-5 pb-25 outline-0 ring-0 pr-2 pl-6 my-scrollbar"
    >
      <div className="flex flex-col gap-10 h-full w-full max-w-[48rem] mt-1.5">
        {allMessages.map((msg) => (
          <RenderMessage key={msg.id} msg={msg} />
        ))}
        {isThinking && (
          <div>
            <span className="inline-block w-3 h-3 rounded-full bg-white animate-[scaleUpDown_1.2s_ease-in-out_infinite]" />
          </div>
        )}
        <div
          ref={scrollRef}
          className={cn(
            "w-full",
            allMessages.length > 2 ? "pb-[calc(100vh-300px)]" : "pb-25"
          )}
        />
      </div>
    </div>
  );
}
