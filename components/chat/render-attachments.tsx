import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const renderAttachments = (msg: any) => {
  const attachments = msg.experimental_attachments;
  return (
    attachments?.length > 0 && (
      <>
        {attachments.map((file: any) => (
          <Link
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            key={file.internalId}
            className={cn(
              msg.role === "user" ? "self-end w-full" : "w-full",
              file.contentType.startsWith("image/")
                ? "p-0 max-w-max border-white/5 border rounded-xl flex items-center gap-2 min-w-20 mb-1 overflow-hidden"
                : "p-2 max-w-60 sm:min-w-80 border-white/5 border rounded-xl flex items-center gap-2 min-w-20 mb-1"
            )}
          >
            {file.contentType.startsWith("image/") ? (
              <Image
                height={200}
                width={200}
                alt={file.name || "Image"}
                src={file.url}
              />
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center bg-[#FF5588] rounded-[6px] ml-1">
                  <FileText size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {file.name || file.url}
                  </span>
                  <span className="font-light">{file.contentType}</span>
                </div>
              </>
            )}
          </Link>
        ))}
      </>
    )
  );
};
