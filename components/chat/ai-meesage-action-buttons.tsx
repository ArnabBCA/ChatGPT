"use client";

import {
  ChevronDown,
  Copy,
  Pencil,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Volume2,
} from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export default function AiMessageActionButtons() {
  const icons = [
    <Copy size={18} />,
    <ThumbsUp size={18} />,
    <ThumbsDown size={18} />,
    <Volume2 size={18} />,
    <Pencil size={18} />,
    <div className="flex items-center">
      <RefreshCcw size={18} />
      <ChevronDown size={18} />
    </div>,
    <Upload size={18} />,
  ];

  return (
    <div className="flex items-center mx-[-0.5rem] px-1 py-1.5">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: (i: number) => ({
              opacity: 1,
              transition: {
                delay: i * 0.05, // stagger delay
                duration: 0.15,
                ease: "easeIn",
              },
            }),
          }}
        >
          <Button
            variant={"ghost"}
            size={index === 5 ? undefined : "icon"}
            className={`[&_svg]:!w-auto [&_svg]:!h-auto dark:hover:bg-neutral-500/20 ${
              index === 5 ? "h-8 w-13" : "size-8"
            }`}
          >
            {icon}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
