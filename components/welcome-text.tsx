"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useChatboxStore } from "@/store/chatbox-store";
import { useEffect, useState } from "react";

export default function WelcomeText() {
  const [hideH1, setHideH1] = useState(false);
  const pathname = usePathname();
  const { isSubmited } = useChatboxStore();

  useEffect(() => {
    if (pathname.startsWith("/c/")) {
      setHideH1(true);
    } else {
      setHideH1(false);
    }

    if (isSubmited) {
      setHideH1(true);
    } else {
      setHideH1(false);
    }
  }, [pathname, isSubmited]);

  return (
    <motion.h1
      initial={false}
      animate={{ opacity: hideH1 ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cn(
        "text-2xl leading-9 font-semibold text-page-header min-h-10.5 min-[510px]:mt-[calc(25dvh-52px)] max-[768px]:mt-[calc(25dvh-52px)] lg:mt-[calc(30dvh-27px)]"
      )}
    >
      What are you working on?
    </motion.h1>
  );
}
