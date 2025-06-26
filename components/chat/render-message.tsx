import { cn } from "@/lib/utils";
import AiMessageActionButtons from "./ai-meesage-action-buttons";
import { renderAttachments } from "./render-attachments";
import { renderMarkdown } from "./render-markdown";
import UserMessageActionButtons from "./user-message-action-buttons";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useChatboxStore } from "@/store/chatbox-store";

export default function RenderMessage({ msg }: { msg: any }) {
  const [isEditing, setIsEditing] = useState(false);

  const [textContent, setTextContent] = useState(msg.content || "");

  const { setEditedMessage } = useChatboxStore();

  const handleEditMessage = () => {
    setEditedMessage({ id: msg.id, content: textContent }); // Update the message content in the store
    setIsEditing(false); // Exit editing mode (closes the textarea)
  };

  useEffect(() => {
    setTextContent(msg.content || ""); // Initialize textContent with the message content
  }, [msg]);

  return (
    <>
      {!isEditing ? (
        <div
          key={msg.id}
          className={cn(
            msg.role == "user" ? "self-end" : "",
            "flex flex-col group"
          )}
        >
          {renderAttachments(msg)}
          <div
            className={cn(
              "whitespace-pre-wrap prose prose-neutral dark:prose-invert",
              msg.experimental_attachments?.length > 0
                ? "rounded-t-3xl rounded-b-3xl rounded-l-3xl rounded-r-sm"
                : "rounded-3xl",
              msg.role == "user"
                ? "self-end dark:bg-[#323232d9] dark:text-white px-5 py-2.5"
                : ""
            )}
          >
            <div className="markdown">{renderMarkdown(msg.content || "")}</div>
            {msg.role !== "user" && <AiMessageActionButtons />}
          </div>
          {msg.role === "user" && (
            <UserMessageActionButtons
              role={msg.role}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      ) : (
        <div className="flx flex-col dark:bg-[#424242] w-full rounded-3xl p-3">
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="border-none focus-visible:border-none focus-visible:ring-0 shadow-none !bg-transparent hide-resizer"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              className="dark:bg-[#212121] rounded-full hover:dark:bg-[#303030] border-1 py-0 px-3"
            >
              Cancel
            </Button>
            <Button
              className="border-1 max-h-9 rounded-full py-0 px-3"
              onClick={handleEditMessage}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
