import { CLIPBOARD_CONFIG } from "../common/constants";
import { generateId } from "../helpers/StringHelper";
import type { FileClipboardItem, IClipboardItem, ImageClipboardItem } from "../types/interfaces/IClipboard";

// interface FileHandler {
//   canHandle(file: File): boolean;
//   handle(file: File): Promise<IClipboardItem>
// }
//
//
//
// const imageHandler: FileHandler = {
//   canHandle: (file: File) => file.type.startsWith("image/"),
//   handle: (file) => {
//
//   }
// }

// const FileHandler: FileHandler = {
//   canHandle: (file: File) => file.type.startsWith("image/"),
//   handle: (file) => {
//
//   }
// }

export function pasteClipboard<T extends HTMLElement>(event: React.ClipboardEvent<T>): IClipboardItem[] {
  event?.preventDefault();
  let paste: DataTransfer | null = event.clipboardData;
  if (!paste) {
    console.log("Not data on paste");
    return [];
  }

  let result: IClipboardItem[] = []
  let types: readonly string[] = paste.types;
  if (types.includes("Files")) {
    const files: FileList = paste.files;
    const resFiles = filesProcessing(files)
    result.push(...resFiles);
  }

  if (result.length === 0) {
    if (types.includes("text/html")) {

    } else if (types.includes("text/plain")) {

    }
  }


  console.log(types);
  return result;
}


function filesProcessing(files: FileList) {
  let result: IClipboardItem[] = []
  for (let i = 0; i < files.length; i++) {
    const file: File | null = files.item(i);
    if (file) {
      if (!validateFile(file)) continue;

      const fileType: string = file.type;
      const afterApplication: string = fileType
        .substring(fileType.indexOf("/") + 1, fileType.length);

      switch (afterApplication) {
        case "png":
        case "jpeg":
        case "gif": {
          const imageFile = imageProcessing(file);
          result.push(imageFile);
          break;
        }
        case "pdf": {
          break;
        }
        case "msword": {
          break;
        }
        case "vnd.openxmlformats-officedocument.wordprocessingml.document": {
          break;
        }
        case "plain": {
          break;
        }
      }


    }
  }

  return result;
}

function imageProcessing(file: File): ImageClipboardItem {
  return {
    id: generateId(),
    type: 'image',
    file,
    previewUrl: URL.createObjectURL(file),
    fileName: file.name || `image-${Date.now()}.png`,
    fileSize: file.size,
    mimeType: file.type,
    createdAt: Date.now(),
  };
}

// false if not allowed or over maxFileSize
function validateFile(file: File): boolean {
  const config = CLIPBOARD_CONFIG;
  const type = config.allowedFileTypes.some(allowed => file.type === allowed);
  if (type) {
    if (file.size > config.maxFileSize) return false;
    return true;
  }

  return false;
}

// function textProcessing(plain: string, html?: string): TextClipboardItem {
//   return;
// }
