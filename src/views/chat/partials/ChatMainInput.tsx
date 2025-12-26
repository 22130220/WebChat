import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useState } from "react";

interface Props {
  message?: string;
  setMessage: Function;
  handleKeyPress: Function;
  handleSend: Function;
}
export default function ChatMainInput({
  message,
  setMessage,
  handleKeyPress,
  handleSend,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
    setShowPicker(false);
  }

  return (
    <>
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-row items-center justify-items-center gap-3">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
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
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn"
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button className="absolute right-3 bottom-5 text-gray-400 hover:text-gray-600"
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
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white"
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
