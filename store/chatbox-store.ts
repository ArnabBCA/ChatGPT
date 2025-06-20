"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatboxState {
  input: string;
  setInput: (value: string) => void;

  pendingMessage: string | null;
  setPendingMessage: (value: string | null) => void;

  slideToBottom: boolean;
  fixedToBottom: boolean;
  setSlideToBottom: (value: boolean) => void;
  setFixedToBottom: (value: boolean) => void;
}

export const useChatboxStore = create<ChatboxState>()(
  persist(
    (set) => ({
      input: "",
      setInput: (value) => set({ input: value }),

      pendingMessage: null,
      setPendingMessage: (value) => set({ pendingMessage: value }),

      slideToBottom: false,
      fixedToBottom: false,
      setSlideToBottom: (value) => set({ slideToBottom: value }),
      setFixedToBottom: (value) => set({ fixedToBottom: value }),
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
