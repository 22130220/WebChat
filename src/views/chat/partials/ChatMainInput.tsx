import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { FileText, SmilePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import wSocket from "../../../utils/wSocket";
import { useParams } from "react-router-dom";
import type { IMessageDetail } from "../../../types/interfaces/IMessageDetail";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import { supabaseClient } from "../../../services/supabaseService";

interface Props {
  setMessages: Function;
}

export default function ChatMainInput({ setMessages }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const { name, type } = useParams();
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle Emoji Click
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
    setShowPicker(false);
  };

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  async function getImageFromSupabase(selectedFile: File) {
    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const supabase = supabaseClient;
    const { error } = await supabase.storage
      .from("webchat")
      .upload(`chat/${fileName}`, selectedFile);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("webchat")
      .getPublicUrl(`chat/${fileName}`);
    return urlData.publicUrl;
  }

  async function insertFileToTable(
    publicUrl: string,
    sender: string,
    receiver: string,
    selectedFile: File,
  ) {
    const supabase = supabaseClient;
    const { error } = await supabase.from("chat_files").insert([
      {
        sender: sender,
        receiver: receiver,
        file_url: publicUrl,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
      },
    ]);

    if (error) {
      console.error("Cannot Upload File", error);
    }
  }

  const handleSend = async () => {
    const typeEvent = Number(type) === 1 ? "room" : "people";
    const username = localStorage.getItem("USER_NAME") || "";
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

    if (selectedFile) {
      const publicUrl = await getImageFromSupabase(selectedFile);
      insertFileToTable(publicUrl, username, receivedName, selectedFile);
      const imageChat: IMessageDetail = {
        type: "IMAGE",
        content: publicUrl,
        sender: username,
        to: `${name}`,
        timestamp: new Date().toISOString(),
      };
      messageList.push(imageChat);
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
      setMessages((prev: any) => [
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
    clearFile();
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
        {selectedFile && (
          <div className="mb-3 flex items-center">
            <div className="relative p-2 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-2 border border-[var(--border-primary)]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <FileText className="w-8 h-8 text-[var(--accent-primary)]" />
              )}
              <div className="flex flex-col pr-6">
                <span className="text-xs font-medium truncate max-w-[150px] text-[var(--text-primary)]">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={clearFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
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
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
