import React, { useState } from "react";
import type { IChatMessage } from "../../../types/interfaces/IChatMessage";
import ChatMainHeader from "./ChatMainHeader";
import ChatMainPartial from "./ChatMainPartial";
import ChatMainInput from "./ChatMainInput";

const ChatMain: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages] = useState<IChatMessage[]>([
    { id: 1, text: "omg, this is amazing", sender: "other" },
    { id: 2, text: "perfect! ✅", sender: "other" },
    { id: 3, text: "Wow, this is really epic", sender: "other" },
    { id: 4, text: "How are you?", sender: "user" },
    { id: 5, text: "just ideas for next time", sender: "other" },
    { id: 6, text: "I'll be there in 2 mins ⏰", sender: "other" },
    { id: 7, text: "woohoooo", sender: "user" },
    { id: 8, text: "Haha oh man", sender: "user" },
    { id: 9, text: "Haha that's terrifying 😱", sender: "user" },
    { id: 10, text: "aww", sender: "other" },
    { id: 11, text: "omg, this is amazing", sender: "other" },
    { id: 12, text: "woohoooo 🔥", sender: "other" },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending:", message);
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

