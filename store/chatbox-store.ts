"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatboxState {
  userInput: string | null;
  setUserInput: (value: string | null) => void;

  chats: any[];
  setChats: (chats: any[]) => void;

  slideToBottom: boolean;
  fixedToBottom: boolean;
  setSlideToBottom: (value: boolean) => void;
  setFixedToBottom: (value: boolean) => void;

  isSubmited: boolean;
  setIsSubmited: (value: boolean) => void;
}

export const useChatboxStore = create<ChatboxState>()(
  persist(
    (set) => ({
      userInput: null,
      setUserInput: (value) => set({ userInput: value }),

      chats: [],
      setChats: (chats) => set({ chats }),

      slideToBottom: false,
      fixedToBottom: false,
      setSlideToBottom: (value) => set({ slideToBottom: value }),
      setFixedToBottom: (value) => set({ fixedToBottom: value }),

      isSubmited: false,
      setIsSubmited: (value) => set({ isSubmited: value }),
    }),
    {
      name: "chatbox-storage",
      storage: createJSONStorage(() => localStorage),
      // Optional: only persist some fields
      partialize: (state) => ({
        slideToBottom: state.slideToBottom,
        fixedToBottom: state.fixedToBottom,
      }),
    }
  )
);
