import { Copy, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function UserMessageActionButtons({
  role,
  setIsEditing,
}: {
  role: "user" | "assistant";
  setIsEditing: (isEditing: boolean) => void;
}) {
  const actions = [
    {
      icon: <Copy size={18} />,
      onClick: () => {
        // TODO: implement copy logic
        console.log("Copy clicked");
      },
    },
    {
      icon: <Pencil size={18} />,
      onClick: () => setIsEditing(true),
    },
  ];

  return (
    <div
      className={cn(
        role === "user" ? "self-end" : "",
        "flex items-center px-1 py-1.5 opacity-0 group-hover:opacity-100"
      )}
    >
      {actions.map(({ icon, onClick }, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className="[&_svg]:!w-auto [&_svg]:!h-auto dark:hover:bg-neutral-500/20 size-8"
          onClick={onClick}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
}
