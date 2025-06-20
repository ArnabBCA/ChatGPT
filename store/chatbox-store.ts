"use client"; // ✅ Required in Next.js App Router

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatboxState {
  slideToBottom: boolean;
  fixedToBottom: boolean;
  setSlideToBottom: (value: boolean) => void;
  setFixedToBottom: (value: boolean) => void;
}

export const useChatboxStore = create<ChatboxState>()(
  persist(
    (set) => ({
      slideToBottom: false,
      fixedToBottom: false,
      setSlideToBottom: (value) => set({ slideToBottom: value }),
      setFixedToBottom: (value) => set({ fixedToBottom: value }),
    }),
    {
      name: "chatbox-storage",
      storage: createJSONStorage(() => localStorage), // ✅ ensures client-side only
    }
  )
);
