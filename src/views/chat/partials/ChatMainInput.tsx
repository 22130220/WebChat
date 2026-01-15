import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { FileText, SmilePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import wSocket from "../../../utils/wSocket";
import { useParams } from "react-router-dom";
import type { IMessageDetail } from "../../../types/interfaces/IMessageDetail";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import {
  getImageFromSupabase,
  insertFileToTable,
} from "../../../services/supabaseService";
import pubSub from "../../../utils/eventBus";
import type { ITypingStatus } from "../../../types/interfaces/ITypingStatus";
import { useClipboard } from "../../../hooks/useClipboard";
import { hasFile } from "../../../services/clipboardServices";
import { generateId } from "../../../helpers/StringHelper";

interface Props {
  setMessages: Function;
}

export default function ChatMainInput({ setMessages }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const { name, type } = useParams();
  const [message, setMessage] = useState("");
  const { pasteEvent, items, isLoading, removeItem, clearItems } =
    useClipboard();
  const username = localStorage.getItem("USER_NAME") || "";
  const typeEvent = Number(type) === 1 ? "room" : "people";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Emoji Click
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
    setShowPicker(false);
  };

  /** Handle File Change (support multiple)
   * files : currently selected files
   * newFiles : newly selected files
   *
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
    );
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearAllFiles = () => {
    previewUrls.forEach((u) => u && URL.revokeObjectURL(u));
    setSelectedFiles([]);
    setPreviewUrls([]);
    clearItems();
  };

  const removeFileAt = (index: number) => {
    const removed = selectedFiles[index];
    if (!removed) return;
    if (previewUrls[index]) URL.revokeObjectURL(previewUrls[index]);
    const nextFiles = selectedFiles.filter((_, i) => i !== index);
    const nextPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(nextFiles);
    setPreviewUrls(nextPreviews);
  };

  /**
   * Handle TypingStatus
   */
  function sendTypingStatus(isTyping: boolean) {
    const messageList: ITypingStatus[] = [];
    const typingStatus: ITypingStatus = {
      type: "TYPING_STATUS",
      sender: username,
      receiver: `${name}`,
      isTyping: isTyping,
    };
    messageList.push(typingStatus);

    const messagePayload = {
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: `${typeEvent}`,
          to: `${name}`,
          mes: JSON.stringify(messageList),
        },
      },
    };
    wSocket.send(JSON.stringify(messagePayload));
  }

  /**
   * 
   */
  function getMessageTypeFromFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase() || "";
    const type = file.type.toLowerCase();

    if (extension === "pdf" || type === "application/pdf") {
      return "PDF";
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension) || type.startsWith("image/")) {
      return "IMAGE";
    }

    if (['doc', 'docx'].includes(extension) ||
      type === "application/msword" ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return "DOCUMENT";
    }

    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension) || type.startsWith("video/")) {
      return "VIDEO";
    }

    if (['mp3', 'wav', 'ogg'].includes(extension) || type.startsWith("audio/")) {
      return "AUDIO";
    }

    return "FILE";
  }

  /**
   * Handle Message
   */
  const handleSend = async () => {
    const messageList: IMessageDetail[] = [];
    const receivedName = name || "";

    if (message.trim()) {
      const messageChat: IMessageDetail = {
        type: "TEXT",
        content: message,
        sender: username,
        to: `${name}`,
        timestamp: new Date().toISOString(),
      };
      messageList.push(messageChat);
    }

    if (selectedFiles.length > 0 || items.length > 0) {
      for (const file of selectedFiles) {
        try {
          const uploadResult = await getImageFromSupabase(file);
          const publicUrl = uploadResult.publicUrl;

          if (!publicUrl) {
            console.error("No public URL returned for", file.name);
            continue;
          }

          const inserted = await insertFileToTable(
            publicUrl,
            username,
            receivedName,
            file,
          );

          /**
           * Only add message if DB insert succeeded
           * publish event so directory can refresh immediately
           * then add to message list
           *  */
          if (inserted) {
            try {
              pubSub.publish("updateChatFiles", {
                sender: username,
                receiver: receivedName,
                file: inserted,
              });
            } catch (e) {
              console.warn("Failed to publish chat_files_updated", e);
            }

            const msgType = getMessageTypeFromFileType(file);

            const imageChat: IMessageDetail = {
              type: msgType,
              content: publicUrl,
              sender: username,
              to: `${name}`,
              timestamp: new Date().toISOString(),
            };
            messageList.push(imageChat);
          } else {
            console.error("DB insert failed for", file.name);
          }
        } catch (err) {
          console.error("Upload failed for file", file.name, err);
        }
      }

      for (const item of items.filter(hasFile)) {
        try {
          const uploadResult = await getImageFromSupabase(item.file);
          const publicUrl = uploadResult.publicUrl;

          if (!publicUrl) {
            console.error("No public URL returned for", item.fileName);
            continue;
          }

          const inserted = await insertFileToTable(
            publicUrl,
            username,
            receivedName,
            item.file,
          );

          if (inserted) {
            try {
              pubSub.publish("updateChatFiles", {
                sender: username,
                receiver: receivedName,
                file: inserted,
              });
            } catch (e) {
              console.warn("Failed to publish chat_files_updated", e);
            }

            const msgType = getMessageTypeFromFileType(item.file);

            const imageChat: IMessageDetail = {
              type: msgType,
              content: publicUrl,
              sender: username,
              to: `${name}`,
              timestamp: new Date().toISOString(),
            };
            messageList.push(imageChat);
          } else {
            console.error("DB insert failed for", item.fileName);
          }
        } catch (err) {
          console.error("Upload failed for file", item.fileName, err);
        }
      }
    }

    const messagePayload = {
      action: "onchat",
      data: {
        event: "SEND_CHAT",
        data: {
          type: `${typeEvent}`,
          to: `${name}`,
          mes: JSON.stringify(messageList),
        },
      },
    };
    console.log(messagePayload);
    wSocket.send(JSON.stringify(messagePayload));

    if (Number(type) === 0) {
      setMessages((prev) => [
        {
          id: prev.length + 1,
          to: `${name}`,
          mes: JSON.stringify(messageList),
          name: `${username}`,
          type: Number(type),
          createAt: new Date().toISOString(),
        } as IChatMessage,
        ...prev,
      ]);
    }
    setMessage("");
    clearAllFiles();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]">
        {/* Preview File area */}
        {(selectedFiles.length > 0 || items.length > 0) && (
          <div className="mb-3 flex items-center gap-2 overflow-x-auto">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${generateId()}`}
                className="relative p-2 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-2 border border-[var(--border-primary)]"
              >
                {previewUrls[idx] ? (
                  <img
                    src={previewUrls[idx]}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-[var(--accent-primary)]" />
                )}
                <div className="flex flex-col pr-6">
                  <span className="text-xs font-medium truncate max-w-[150px] text-[var(--text-primary)]">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeFileAt(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {items.filter(hasFile).map((item, idx) => (
              <div
                key={`${item.fileName}-${item.lastModified}`}
                className="relative p-2 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-2 border border-[var(--border-primary)]"
              >
                {item.type === "image" ? (
                  <img
                    src={item.previewUrl}
                    alt={item.fileName}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-[var(--accent-primary)]" />
                )}
                <div className="flex flex-col pr-6">
                  <span className="text-xs font-medium truncate max-w-[150px] text-[var(--text-primary)]">
                    {item.fileName}{" "}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {(item.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFiles}
              className="text-xs text-[var(--text-muted)] ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-row items-center justify-items-center gap-3">
          <button
            className="w-10 h-10 rounded-full hover:bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <div className="flex-1 relative">
            {/* Input File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              multiple
            />

            <textarea
              value={message}
              onPaste={(e: React.ClipboardEvent<HTMLTextAreaElement>) =>
                pasteEvent(e)
              }
              onChange={(e) => {
                setMessage(e.target.value);
                const value = e.target.value;

                if (value.length > 0) {
                  if (!isTypingRef.current) {
                    isTypingRef.current = true;
                    sendTypingStatus(true);
                  }

                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }

                  typingTimeoutRef.current = setTimeout(() => {
                    isTypingRef.current = false;
                    sendTypingStatus(false);
                  }, 2000);
                } else {
                  isTypingRef.current = false;
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }
                  sendTypingStatus(false);
                }
              }}
              onKeyDown={handleKeyPress}
              placeholder="Nhập tin nhắn"
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent"
            />
            <button
              className="absolute right-3 bottom-5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setShowPicker(!showPicker)}
            >
              <SmilePlus size={20} />
            </button>
          </div>
          {showPicker && (
            <div className="absolute bottom-16 right-100 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] flex items-center justify-center text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
