import { CLIPBOARD_CONFIG } from "../common/constants";
import { generateId } from "../helpers/StringHelper";
import { showError } from "../stores/notificationSlice";
import { store } from "../stores/store";
import type { FileClipboardItem, IClipboardItem, ImageClipboardItem } from "../types/interfaces/IClipboard";

/**
 * Process array of Files into ClipboardItems
 * Validates file type and size before processing
 */
export function processFiles(files: File[]): IClipboardItem[] {
  const result: IClipboardItem[] = [];

  for (const file of files) {
    if (!validateFile(file)) continue;

    if (file.type.startsWith("image/")) {
      result.push(imageProcessing(file));
    } else {
      result.push(fileProcessing(file));
    }
  }

  return result;
}


export function hasFile(item: IClipboardItem): item is ImageClipboardItem | FileClipboardItem {
  return item.type === 'image' || item.type === 'file';
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
    lastModified: file.lastModified,
    createdAt: Date.now(),
    dimensions: undefined,
  };
}

function fileProcessing(file: File): FileClipboardItem {
  return {
    id: generateId(),
    type: 'file',
    file,
    fileName: file.name || `file-${Date.now()}`,
    fileSize: file.size,
    mimeType: file.type,
    extension: file.name.split('.').pop() || '',
    lastModified: file.lastModified,
    createdAt: Date.now(),
  };
}

function validateFile(file: File): boolean {
  const { allowedFileTypes, allowedImageTypes, maxFileSize } = CLIPBOARD_CONFIG;

  const allAllowedTypes = [...allowedImageTypes, ...allowedFileTypes];
  const isAllowedType = allAllowedTypes.includes(file.type);

  if (!isAllowedType) {
    store.dispatch(showError(`${file.type} không được hỗ trợ`));
    console.warn(`File type "${file.type}" không được hỗ trợ`);
    return false;
  }

  if (file.size > maxFileSize) {
    store.dispatch(showError(`File "${file.name}" vượt quá ${maxFileSize / 1024 / 1024}MB`));
    console.warn(`File "${file.name}" vượt quá ${maxFileSize / 1024 / 1024}MB`);
    return false;
  }
  return true;
}

// function textProcessing(plain: string, html?: string): TextClipboardItem {
//   return;
// }
