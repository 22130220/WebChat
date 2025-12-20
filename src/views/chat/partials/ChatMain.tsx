import React, { useEffect, useState } from "react";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import ChatMainHeader from "./ChatMainHeader";
import ChatMainPartial from "./ChatMainPartial";
import ChatMainInput from "./ChatMainInput";
import wSocket from "../../../utils/wSocket";
import pubSub from "../../../utils/eventBus";

const ChatMain: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  useEffect(() => {
    const getPeopleChatMess = () => {
      const getPeopleChatMessages = {
        action: "onchat",
        data: {
          event: "GET_PEOPLE_CHAT_MES",
          data: {
            name: "phucdz2",
            page: 1,
          },
        },
      };
      wSocket.send(JSON.stringify(getPeopleChatMessages));
    };

    const setPeopleChatMess = (data: any) => {
      setMessages(data.data);
    };

    pubSub.subscribe("get_people_chat_messages", getPeopleChatMess);
    pubSub.subscribe("get_people_chat_messages_success", setPeopleChatMess);
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      const messagePayload = {
        action: "onchat",
        data: {
          event: "SEND_CHAT",
          data: {
            type: "people",
            to: `phucdz2`,
            mes: `${message.trim()}`,
          },
        },
      };
      console.log(messagePayload);
      wSocket.send(JSON.stringify(messagePayload));
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          to: "phucdz2",
          mes: message.trim(),
          name: "phucdz",
          type: 0,
          createAt: new Date().toISOString(),
        } as IChatMessage,
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
    <div className="flex-1 flex flex-col bg-white h-screen">
      {/* Header */}
      <ChatMainHeader />
      {/* Messages */}
      <ChatMainPartial messages={messages} />
      {/* Input */}
      <ChatMainInput
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatMain;
