import { Attachment } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function convertFileListToAttachments(
  fileList: FileList
): Promise<Attachment[]> {
  const attachments: Attachment[] = [];

  for (const file of Array.from(fileList)) {
    const dataUrl = await fileToDataURL(file);
    attachments.push({
      name: file.name,
      contentType: file.type,
      url: dataUrl, // this is a base64-encoded data URL
    });
  }

  return attachments;
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_TOKEN_CONTEXT_WINDOW = process.env.NEXT_PUBLIC_MAX_TOKEN_CONTEXT_WINDOW || 10000

export const fitMessagesWithinContextWindow = (messagesArray: any[]) => {
  const sortedMessages = messagesArray.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Sort in descending order
  });

  const result: any[] = [];
  let totalTokens = 0;

  for (const message of sortedMessages) {
    const tokens =
      message.role === "assistant"
        ? message.usage?.completionTokens || 0
        : message.promptTokens || 0;

    if (totalTokens + tokens > MAX_TOKEN_CONTEXT_WINDOW) {
      break;
    }

    totalTokens += tokens;
    result.push(message);
  }
  return result.reverse(); // this reverses the order to match the original order of messages (Oldest to Newest)
};

export function countTokens(text: string): number {
  const enc = new Tiktoken(o200k_base);
  return enc.encode(text).length;
}
