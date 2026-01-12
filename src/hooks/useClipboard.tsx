import { useState } from "react";
import type {
  IClipboardItem,
  IClipboardPayload,
} from "../types/interfaces/IClipboard";
import { processFiles } from "../services/clipboardServices";

interface ClipboardState {
  items: IClipboardItem[];
  error: IClipboardPayload[];
  isLoading: boolean;
}

interface UseClipboardReturn extends ClipboardState {
  pasteEvent: <T extends HTMLElement>(event: React.ClipboardEvent<T>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}

export function useClipboard(): UseClipboardReturn {
  const [clipboard, setClipboard] = useState<ClipboardState>({
    items: [],
    error: [],
    isLoading: false,
  });

  function pasteEvent<T extends HTMLElement>(event: React.ClipboardEvent<T>) {
    event?.preventDefault();

    // Set loading state
    setClipboard((prev) => ({ ...prev, isLoading: true, error: [] }));

    const paste = event.clipboardData;
    if (!paste) {
      console.log("No data on paste");
      setClipboard((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const files = paste.files;
    if (files.length === 0) {
      console.log("No files on paste");
      setClipboard((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Convert FileList to Array and filter duplicates
    const filesArray = Array.from(files);
    const existingFileNames = new Set(
      clipboard.items.map((item) => ("fileName" in item ? item.fileName : "")),
    );

    const newFiles = filesArray.filter(
      (file) => !existingFileNames.has(file.name),
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
    error: clipboard.error,
    isLoading: clipboard.isLoading,
    pasteEvent,
    removeItem,
    clearItems,
  };
}
