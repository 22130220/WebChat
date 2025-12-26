import { useState } from "react";
import wSocket from "../../../utils/wSocket";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import { useParams } from "react-router-dom";

interface Props {
  setMessages: Function;
}
export default function ChatMainInput({ setMessages }: Props) {
  const { name, type } = useParams();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const typeEvent = Number(type) === 1 ? "room" : "people";
    const username = localStorage.getItem("USER_NAME") || "";
    if (message.trim()) {
      const messagePayload = {
        action: "onchat",
        data: {
          event: "SEND_CHAT",
          data: {
            type: `${typeEvent}`,
            to: `${name}`,
            mes: `${message.trim()}`,
          },
        },
      };
      console.log(messagePayload);
      wSocket.send(JSON.stringify(messagePayload));
      setMessages((prev) => [
        {
          id: prev.length + 1,
          to: "phucdz2",
          mes: message.trim(),
          name: `${username}`,
          type: 1,
          createAt: new Date().toISOString(),
        } as IChatMessage,
        ...prev,
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
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
            <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
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
