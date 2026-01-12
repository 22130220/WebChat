import { useState } from "react";
import type {
  IClipboardItem,
  ImageClipboardItem,
  FileClipboardItem,
} from "../types/interfaces/IClipboard";
import { processFiles } from "../services/clipboardServices";

interface ClipboardState {
  items: IClipboardItem[];
  isLoading: boolean;
}

interface UseClipboardReturn extends ClipboardState {
  pasteEvent: <T extends HTMLElement>(event: React.ClipboardEvent<T>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

/**
 * Check if file already exists in clipboard items
 * Compare by fileName AND lastModified for accuracy
 */
function isDuplicateFile(file: File, existingItems: IClipboardItem[]): boolean {
  return existingItems.some((item) => {
    if (item.type !== "image" && item.type !== "file") return false;
    const fileItem = item as ImageClipboardItem | FileClipboardItem;
    return (
      fileItem.fileName === file.name &&
      fileItem.lastModified === file.lastModified
    );
  });
}

export function useClipboard(): UseClipboardReturn {
  const [clipboard, setClipboard] = useState<ClipboardState>({
    items: [],
    isLoading: false,
  });

  function pasteEvent<T extends HTMLElement>(event: React.ClipboardEvent<T>) {
    const paste = event.clipboardData;
    if (!paste) return;

    const files = paste.files;
    // TODO: If message is too long, truncate and notify user
    if (files.length === 0) {
      return;
    }

    event?.preventDefault();

    // Set loading state
    setClipboard((prev) => ({ ...prev, isLoading: true }));

    if (!paste) {
      console.log("No data on paste");
      setClipboard((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    if (files.length === 0) {
      console.log("No files on paste");
      setClipboard((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Convert FileList to Array and filter duplicates (by name + lastModified)
    const filesArray = Array.from(files);
    const newFiles = filesArray.filter(
      (file) => !isDuplicateFile(file, clipboard.items),
    );

    if (newFiles.length === 0) {
      console.log("All files already exist in clipboard");
      setClipboard((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Process new files
    const newItems = processFiles(newFiles);

    // Update state with new items
    setClipboard((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
      isLoading: false,
    }));
  }

  function removeItem(id: string) {
    // Cleanup blob URL before removing
    const item = clipboard.items.find((i) => i.id === id);
    if (item && item.type === "image" && "previewUrl" in item) {
      URL.revokeObjectURL(item.previewUrl);
    }

    setClipboard((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }

  function clearItems() {
    // Cleanup all blob URLs
    clipboard.items.forEach((item) => {
      if (item.type === "image" && "previewUrl" in item) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });

    setClipboard((prev) => ({
      ...prev,
      items: [],
    }));
  }

  return {
    items: clipboard.items,
    isLoading: clipboard.isLoading,
    pasteEvent,
    removeItem,
    clearItems,
  };
}
