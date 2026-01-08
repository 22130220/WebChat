import { useEffect, useMemo, useRef, useState } from "react";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import type { IMessageDetail } from "../../../types/interfaces/IMessageDetail";
import { Download, X } from "lucide-react";

interface IChatMainProps {
  messages: Array<IChatMessage>;
}

export default function ChatMainPartial({ messages }: IChatMainProps) {
  const username = localStorage.getItem("USER_NAME") || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<{ imageUrl: string, name: string } | null>(null);

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
            const isme = username === msg.sender;
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
                  ? "bg-[var(--chat-bubble-sent)] text-[var(--chat-text-sent)]"
                  : "bg-[var(--chat-bubble-received)] text-[var(--chat-text-received)]"
                  }`}
              >
                {msg.type === "TEXT" ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <img src={msg.content} alt="sent" className="rounded-lg max-w-full h-auto"
                    onClick={() => setSelectedImage({
                      imageUrl: msg.content,
                      name: isme ? "Ảnh của bạn" : `Ảnh của ${msg.to}`
                    })}
                  />
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

      {selectedImage && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)} // Click ra ngoài để đóng
        >
          {/* Nút đóng */}
          <button
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>

          {/* Nội dung ảnh */}
          <div className="relative max-w-[90%] max-h-[85vh] flex flex-col items-center">
            <img
              src={selectedImage.imageUrl}
              alt="Zoomed"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()} // Click vào ảnh thì không đóng
            />
            <p className="mt-4 text-white text-lg font-medium">{selectedImage.name}</p>
          </div>
          <div className="absolute bottom-10 flex gap-4">
            <a
              href={selectedImage.imageUrl}
              download
              target="_blank"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 backdrop-blur-md transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={18} />
              Tải xuống
            </a>
          </div>
        </div>

      )
      }
    </>
  );
}
