"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatboxState {
  userInput: string | null;
  setUserInput: (value: string | null) => void;

  userFiles: any[];
  setUserFiles: (files: any[]) => void;

  chats: any[];
  setChats: (chats: any[]) => void;

  editedMessage: {
    id: string;
    content: string;
  };
  setEditedMessage: (message: { id: string; content: string }) => void;

  isFinished: boolean;
  setIsFinished: (value: boolean) => void;

  slideToBottom: boolean;
  setSlideToBottom: (value: boolean) => void;

  isSubmited: boolean;
  setIsSubmited: (value: boolean) => void;
}

export const useChatboxStore = create<ChatboxState>()(
  persist(
    (set) => ({
      userInput: null,
      setUserInput: (value) => set({ userInput: value }),

      userFiles: [],
      setUserFiles: (files) => set({ userFiles: files }),

      chats: [],
      setChats: (chats) => set({ chats }),

      editedMessage: { id: "", content: "" },
      setEditedMessage: (message) => set({ editedMessage: message }),

      isFinished: false,
      setIsFinished: (value) => set({ isFinished: value }),

      slideToBottom: false,
      setSlideToBottom: (value) => set({ slideToBottom: value }),

      isSubmited: false,
      setIsSubmited: (value) => set({ isSubmited: value }),
    }),
    {
      name: "chatbox-storage",
      storage: createJSONStorage(() => localStorage),
      // Optional: only persist some fields
    }
  )
);
