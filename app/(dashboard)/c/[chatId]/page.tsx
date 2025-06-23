"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { useChatboxStore } from "@/store/chatbox-store";
import RenderMessage from "@/components/chat/render-message";
import Chatbox from "@/components/chat/chatbox";

export default function ChatId() {
  const { chatId } = useParams();
  const router = useRouter();
  const { setUserInput, setUserFiles, setIsFinished, setEditedMessage } =
    useChatboxStore();

  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isFinishedState, setIsFinishedState] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userInput = useChatboxStore((state) => state.userInput);
  const userFiles = useChatboxStore((state) => state.userFiles);
  const editedMessage = useChatboxStore((state) => state.editedMessage);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  if (!chatId || typeof chatId !== "string") return null;

  const { messages, append, setMessages } = useChat({
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

  const fetchOldMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/messages?chatId=${chatId}`);
      if (res.data.length === 0) return;
      setMessages(res.data);
    } catch (error) {
      console.error("Fetching messages failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateChat = async () => {
      try {
        await axios.post("/api/chats", { chatId });
        fetchOldMessages();
      } catch (error: any) {
        console.error("Chat ID validation error:", error);
        router.push("/");
      }
    };
    validateChat();
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
    scrollRef.current?.scrollIntoView({ behavior: "instant" });
  }, [loading]);

  useEffect(() => {
    setIsFinished(isFinishedState);
  }, [isFinishedState]);

  const handleEdit = async () => {
    if (!editedMessage.id) return;
    const updatedMessages = await updateMessages(
      editedMessage.id,
      chatId as string
    );
    setMessages(updatedMessages);
    setUserInput(editedMessage.content);
    setEditedMessage({ id: "", content: "" });
  };

  useEffect(() => {
    handleEdit();
  }, [editedMessage]);

  const updateMessages = async (messageId: string, chatId: string) => {
    try {
      const res = await axios.delete("/api/messages", {
        data: { messageId: messageId, chatId: chatId },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to update messages:", error);
    }
  };

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const handleScroll = () => {
      setScrolled(el.scrollTop > 0);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full flex flex-col",
        scrolled && "shadow-xs shadow-neutral-400"
      )}
    >
      <div
        ref={scrollAreaRef}
        className="flex flex-col w-full items-center h-[calc(100vh-170px)] overflow-y-auto outline-0 ring-0 my-scrollbar px-6 relative"
      >
        <div className="flex flex-col gap-10 h-full w-full max-w-[48rem] mt-1.5">
          {messages.map((msg) => (
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
              messages.length > 2 ? "pb-[calc(100vh-300px)]" : "pb-25"
            )}
          />
        </div>
        <Chatbox className="bottom-8 fixed" />
        <div className="text-xs fixed bottom-0 w-full text-center min-h-8 p-2 md:px-[60px]">
          ChatGPT can make mistakes. Check important info. See{" "}
          <a href="#" className="underline">
            Cookie Preferences
          </a>
          .
        </div>
      </div>
    </div>
  );
}
