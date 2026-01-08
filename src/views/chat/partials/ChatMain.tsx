import React, { useEffect, useState } from "react";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import ChatMainHeader from "./ChatMainHeader";
import ChatMainPartial from "./ChatMainPartial";
import ChatMainInput from "./ChatMainInput";
import wSocket from "../../../utils/wSocket";
import { useParams } from "react-router-dom";
import { useEvent } from "../../../hooks/useEvent";

const ChatMain: React.FC = () => {
  const { name, type } = useParams();
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  useEffect(() => {
    setMessages([]);
    const typeEvent =
      Number(type) === 1 ? "GET_ROOM_CHAT_MES" : "GET_PEOPLE_CHAT_MES";
    const getPeopleChatMessages = {
      action: "onchat",
      data: {
        event: typeEvent,
        data: {
          name: `${name}`,
          page: 1,
        },
      },
    };
    wSocket.send(JSON.stringify(getPeopleChatMessages));
  }, [name, type]);

  const setPeopleChatMess = (data: any) => {
    setMessages(data.data);
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
    <div className="flex-1 flex flex-col bg-[var(--bg-primary)] h-screen">
      {/* Header */}
      <ChatMainHeader />
      {/* Messages */}
      <ChatMainPartial messages={messages} />
      {/* Input */}
      <ChatMainInput setMessages={setMessages} />
    </div>
  );
};

export default ChatMain;
