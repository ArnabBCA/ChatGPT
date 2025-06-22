import { Copy, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function UserMessageActionButtons({
  role,
}: {
  role: "user" | "assistant";
}) {
  const icons = [
    <Copy size={18} />,
    <Pencil size={18} />,
    <Pencil size={18} />,
  ];
  return (
    <div
      className={cn(
        role === "user" ? "self-end" : "",
        "flex items-center px-1 py-1.5 opacity-0 group-hover:opacity-100"
      )}
    >
      {icons.map((icon, index) => (
        <Button
          key={index}
          variant={"ghost"}
          size={index === 5 ? undefined : "icon"}
          className={`[&_svg]:!w-auto [&_svg]:!h-auto dark:hover:bg-neutral-500/20 ${
            index === 5 ? "h-8 w-13" : "size-8"
          }`}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
}
