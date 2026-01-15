import React, { useEffect, useState } from "react";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import ChatMainHeader from "./ChatMainHeader";
import ChatMainPartial from "./ChatMainPartial";
import ChatMainInput from "./ChatMainInput";
import wSocket from "../../../utils/wSocket";
import { useParams } from "react-router-dom";
import { useEvent } from "../../../hooks/useEvent";
import { useClipboard } from "../../../hooks/useClipboard";
import { Upload } from "lucide-react";

const ChatMain: React.FC = () => {
  const { name, type } = useParams();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [page, SetPage] = useState<number>(1);
  const [canLoadingMove, setCanLoadingMore] = useState<boolean>(true);

  // Clipboard & Drag/Drop state
  const {
    items: clipboardItems,
    isDragging,
    dropZoneProps,
    pasteEvent,
    removeItem,
    clearItems,
  } = useClipboard();

  // Reset state khi chuyển sang người/room khác
  useEffect(() => {
    setMessages([]);
    SetPage(1);
    setCanLoadingMore(true);
  }, [name, type]);

  // Fetch messages khi page thay đổi hoặc khi chuyển người (page reset về 1)
  useEffect(() => {
    if (canLoadingMove === false) return;
    const typeEvent =
      Number(type) === 1 ? "GET_ROOM_CHAT_MES" : "GET_PEOPLE_CHAT_MES";
    const getPeopleChatMessages = {
      action: "onchat",
      data: {
        event: typeEvent,
        data: {
          name: `${name}`,
          page: page,
        },
      },
    };
    wSocket.send(JSON.stringify(getPeopleChatMessages));
  }, [name, type, page, canLoadingMove]);

  const setPeopleChatMess = (data: any) => {
    if (data.data.length === 0) {
      setCanLoadingMore(false);
      return;
    }
    if (messages.length === 0 || page === 1) {
      setMessages(data.data);
      return;
    }
    setMessages((prev) => [...prev, ...data.data]);
  };

  const canSetPageUp = () => {
    if (canLoadingMove === false) return;
    SetPage((prev) => prev + 1);
  };

  const receiveChatEvent = (data: any) => {
    const rev: IChatMessage = {
      id: Math.floor(Math.random() * 100000000),
      to: data.data.to,
      mes: data.data.mes,
      name: data.data.name,
      type: data.data.type,
      createAt: data.data.createAt,
    };
    setMessages((prev) => [rev, ...prev]);
  };
  useEvent(`receive_chat:${name}`, receiveChatEvent);
  useEvent("get_people_chat_messages_success", setPeopleChatMess);

  return (
    <div
      {...dropZoneProps}
      className="flex-1 flex flex-col bg-[var(--bg-primary)] h-screen relative"
    >
      {/* Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 flex flex-col items-center justify-center z-50 pointer-events-none">
          <Upload className="w-12 h-12 text-blue-500 mb-3" />
          <span className="text-blue-600 font-medium text-lg">
            Tha file vao day de gui
          </span>
        </div>
      )}

      {/* Header */}
      <ChatMainHeader />
      {/* Messages */}
      <ChatMainPartial messages={messages} setPageUp={canSetPageUp} />
      {/* Input */}
      <ChatMainInput
        setMessages={setMessages}
        clipboardItems={clipboardItems}
        pasteEvent={pasteEvent}
        removeItem={removeItem}
        clearItems={clearItems}
      />
    </div>
  );
};

export default ChatMain;
