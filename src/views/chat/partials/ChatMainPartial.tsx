import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../../../hooks/useEvent";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import type { IMessageDetail } from "../../../types/interfaces/IMessageDetail";
import { ArrowDown, Download, X, Forward } from "lucide-react";
import ForwardMessageModal from "./ForwardMessageModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import { extractUrl } from "../../../utils/extractUrl";
import LinkPreview from "../../../components/LinkPreview";
import MessageContent from "./MessageContent";

interface IChatMainProps {
  messages: Array<IChatMessage>;
  setPageUp?: () => void;
}

export default function ChatMainPartial({
  messages,
  setPageUp,
}: IChatMainProps) {
  const username = localStorage.getItem("USER_NAME") || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false); // Flag để bỏ qua lần đầu tiên
  const prevScrollHeightRef = useRef<number>(0); // Lưu scrollHeight trước khi load more
  const prevMessagesLengthRef = useRef<number>(0); // Lưu số lượng messages để detect tin nhắn mới
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    name: string;
  } | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [messageToForward, setMessageToForward] =
    useState<IMessageDetail | null>(null);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(
    null,
  );

  // Lấy recipients từ Redux store
  const recipients = useSelector(
    (state: RootState) => state.recipients.recipients,
  );

  // Scroll xuống cuối
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detect khi người dùng cuộn lên đầu trang
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // Hiển thị nút scroll khi không ở cuối trang
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distanceFromBottom > 100);

    // Bỏ qua load more nếu chưa initialized (tránh trigger khi mới vào trang)
    if (!isInitializedRef.current) return;

    // Khi scrollTop <= threshold (ví dụ 50px), gọi setPageUp
    const threshold = 50;
    if (container.scrollTop <= threshold) {
      // Lưu scrollHeight trước khi load more
      prevScrollHeightRef.current = container.scrollHeight;
      setPageUp?.();
    }
  };

  // Đánh dấu initialized sau khi messages load lần đầu
  useEffect(() => {
    if (!isInitializedRef.current && messages.length > 0) {
      // Scroll xuống cuối lần đầu tiên khi vào trang
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      prevMessagesLengthRef.current = messages.length;
      setTimeout(() => {
        isInitializedRef.current = true;
      }, 300);
    }
  }, [messages]);

  // Auto scroll khi có tin nhắn mới (nếu đang ở gần cuối hoặc tôi là người gửi)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isInitializedRef.current) return;

    // Kiểm tra xem có phải tin nhắn mới không (không phải load more)
    // Load more: messages tăng và prevScrollHeightRef > 0
    // Tin nhắn mới: messages tăng nhưng prevScrollHeightRef === 0
    const isNewMessage =
      messages.length > prevMessagesLengthRef.current &&
      prevScrollHeightRef.current === 0;

    prevMessagesLengthRef.current = messages.length;

    if (!isNewMessage) return;

    // Lấy tin nhắn mới nhất để kiểm tra ai gửi
    // messages[0] là tin nhắn mới nhất (được thêm vào đầu mảng trong ChatMain)
    const latestMessage = messages[0];
    let isSentByMe = false;

    if (latestMessage) {
      try {
        const parsed: IMessageDetail[] = JSON.parse(latestMessage.mes);
        const lastDetail = parsed[parsed.length - 1];
        isSentByMe = lastDetail?.sender === username;
      } catch {
        isSentByMe = false;
      }
    }

    // Nếu tôi là người gửi → luôn scroll xuống
    if (isSentByMe) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Nếu là người khác gửi → chỉ scroll nếu đang ở gần cuối (< 150px)
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 150) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, username]);

  // Giữ scroll position khi load more messages
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !isInitializedRef.current) return;

    // Nếu có scrollHeight cũ (đã load more), điều chỉnh scrollTop
    if (prevScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      container.scrollTop = scrollDiff;
      prevScrollHeightRef.current = 0; // Reset
    }
  }, [messages]);

  /**
   * Previous version filtering out typing status
   */
  // const messageDetailList = useMemo(() => {
  //   return messages.flatMap((msg) => {
  //     try {
  //       const parsed: IMessageDetail[] = JSON.parse(msg.mes);
  //       return parsed;
  //     } catch (error) {
  //       return [];
  //     }
  //   });
  // }, [messages]);

  /**
   * Handle Code by Tai - filtering out typing status
   */
  const messageDetailList = useMemo(() => {
    return messages.flatMap((msg) => {
      try {
        const parsed: IMessageDetail[] = JSON.parse(msg.mes);
        const filtered = Array.isArray(parsed)
          ? parsed.filter((item: any) => item?.type !== "TYPING_STATUS")
          : [];
        return filtered.length > 0 ? filtered : [];
      } catch (error) {
        return [];
      }
    });
  }, [messages]);

  const { name: partnerName } = useParams();
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  /**
   *
   * Only handle typing events from the current partner to me
   * Example: partnerName = "alice", username = "bob"
   * When receiving typing status from alice to bob, show typing indicator
   * When receiving typing status from bob to alice, ignore
   */
  useEvent("typing_status", (payload: any) => {
    try {
      const t = payload?.data || payload; // handle either {data: t} or direct t
      if (!t) return;
      if (t.sender === partnerName && t.receiver === username) {
        if (t.isTyping) {
          setIsPartnerTyping(true);
          if (typingTimerRef.current)
            window.clearTimeout(typingTimerRef.current);
          typingTimerRef.current = window.setTimeout(() => {
            setIsPartnerTyping(false);
            typingTimerRef.current = null;
          }, 4000);
        } else {
          setIsPartnerTyping(false);
          if (typingTimerRef.current) {
            window.clearTimeout(typingTimerRef.current);
            typingTimerRef.current = null;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to process typing status", e);
    }
  });

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* Sửa lại thành so sánh tên user để phân biệt tin nhắn gửi và nhận */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col"
      >
        <div className="mt-auto flex flex-col space-y-4">
          {messageDetailList
            .slice()
            .reverse()
            .map((msg, index) => {
              const isme = username === msg.sender;

              // Tai
              // =========================

              return (
                <div
                  key={index}
                  className={`flex ${username === msg.sender ? "justify-end" : "justify-start"} group`}
                  onMouseEnter={() => setHoveredMessageIndex(index)}
                  onMouseLeave={() => setHoveredMessageIndex(null)}
                >
                  {username !== msg.sender && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-2 shrink-0">
                      👨‍💻
                    </div>
                  )}
                  <div className="flex flex-col max-w-md">
                    <div className="relative">
                      <div
                        className={`px-4 py-2 rounded-2xl ${username === msg.sender
                          ? "bg-[var(--chat-bubble-sent)] text-[var(--chat-text-sent)]"
                          : "bg-[var(--chat-bubble-received)] text-[var(--chat-text-received)]"
                          }`}
                      >
                        {/* {msg.type === "TEXT" ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : msg.type === "IMAGE" ||
                          (msg.type === "FORWARDED" &&
                            msg.originalType === "IMAGE") ? (
                          <img
                            src={msg.content}
                            alt="sent"
                            className="rounded-lg max-w-full h-auto"
                            onClick={() =>
                              setSelectedImage({
                                imageUrl: msg.content,
                                name: isme
                                  ? "Ảnh của bạn"
                                  : `Ảnh của ${msg.to}`,
                              })
                            }
                          />
                        ) : msg.type === "FORWARDED" &&
                          msg.originalType === "TEXT" ? (
                          <p className="text-sm">{msg.content}</p>
                        ) : null} */}
                        <MessageContent msg={msg} isme={isme} onImageClick={(url) => setSelectedImage({ imageUrl: url, name: isme ? "Ảnh của bạn" : `Ảnh của ${msg.to}` })} />
                      </div>
                     
                      {/* Forward button */}
                      {/* {hoveredMessageIndex === index &&
                        (msg.type === "TEXT" ||
                          msg.type === "IMAGE" ||
                          msg.type === "FORWARDED") &&
                        recipients.length > 0 && (
                          <button
                            onClick={() => setMessageToForward(msg)}
                            className="absolute -right-8 top-1/2 transform -translate-y-1/2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                            title="Chuyển tiếp"
                          >
                            <Forward size={14} />
                          </button>
                        )} */}

                      {hoveredMessageIndex === index &&
                        recipients.length > 0 && (
                          <button
                            onClick={() => setMessageToForward(msg)}
                            className="absolute -right-8 top-1/2 transform -translate-y-1/2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                            title="Chuyển tiếp"
                          >
                            <Forward size={14} />
                          </button>
                        )}

                    </div>
                  </div>
                  {username === msg.sender && (
                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm ml-2 shrink-0">
                      👤
                    </div>
                  )}

                </div>
              );
            })}
        </div>
        {isPartnerTyping && (
          <div className="mt-2 flex justify-start">
            <div className="max-w-md px-4 py-2 rounded-2xl bg-[var(--chat-bubble-received)] text-[var(--chat-text-received)] italic text-sm">
              Đang nhập...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Nút scroll xuống cuối */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] p-3 rounded-full shadow-lg transition-all duration-200 z-10"
          title="Scroll xuống cuối"
        >
          <ArrowDown size={20} />
        </button>
      )}

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
            <p className="mt-4 text-white text-lg font-medium">
              {selectedImage.name}
            </p>
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
      )}

      {/* Forward Message Modal */}
      {messageToForward && (
        <ForwardMessageModal
          message={messageToForward}
          recipients={recipients}
          onClose={() => setMessageToForward(null)}
        />
      )}
    </div>
  );
}
