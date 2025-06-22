import { Attachment } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
