import { useEffect, useMemo, useRef } from "react";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import type { IMessageDetail } from "../../../types/interfaces/IMessageDetail";

interface IChatMainProps {
  messages: Array<IChatMessage>;
}

export default function ChatMainPartial({ messages }: IChatMainProps) {
  const username = localStorage.getItem("USER_NAME") || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động scroll xuống bottom khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages);
  }, [messages]); // Chạy lại mỗi khi messages thay đổi (có tin nhắn mới)

  const messageDetailList = useMemo(() => {
    return messages.flatMap(msg => {
      try {
        const parsed: IMessageDetail[] = JSON.parse(msg.mes);
        return parsed;
      } catch (error) {
        return []
      }
    })
  }, [messages]);

  return (
    <>
      {/* Cái type chỗ list message chả về là gì vậy ?
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 1 ? "justify-end" : "justify-start"}`}
          >
            {msg.type === 0 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                👨‍💻
              </div>
            )}
            <div
              className={`max-w-md px-4 py-2 rounded-2xl ${
                msg.type === 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{msg.mes}</p>
            </div>
            {msg.type === 1 && (
              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm ml-2 flex-shrink-0">
                👤
              </div>
            )}
          </div>
        ))}
      </div>
      */}

      {/* Sửa lại thành so sánh tên user để phân biệt tin nhắn gửi và nhận */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messageDetailList
          .slice()
          .reverse()
          .map((msg, index) => {
            return <div
              key={index}
              className={`flex ${username === msg.sender ? "justify-end" : "justify-start"}`}
            >
              {username !== msg.sender && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-2 shrink-0">
                  👨‍💻
                </div>
              )}
              <div
                className={`max-w-md px-4 py-2 rounded-2xl ${username === msg.sender
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
                  }`}
              >
                {msg.type === "TEXT" ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <img src={msg.content} alt="sent" className="rounded-lg max-w-full h-auto" />
                )}
              </div>
              {username === msg.sender && (
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm ml-2 shrink-0">
                  👤
                </div>
              )}
            </div>
          })}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
