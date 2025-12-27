import SidebarHeader from "../partials/SidebarHeader";
import SidebarSearch from "../partials/SidebarSearch";
import MessageItem from "../partials/MessageItem";
import SidebarLogout from "../partials/SidebarLogout";
import CreateRoomPanel from "./CreateRoomPanel";
import React, { useEffect, useMemo } from "react";
import wSocket from "../../../utils/wSocket";
import { useEvent } from "../../../hooks/useEvent";
import { useNavigate, useParams } from "react-router-dom";
import { PATH_CONSTRAINT } from "../../../routers";
import type { IMessage } from "../../../types/interfaces/IMessage";

const ChatSidebar = () => {
  const { name, type } = useParams();
  const [showCreateRoom, setShowCreateRoom] = React.useState(false);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();

  const fetchUserList = () => {
    console.log("Requesting user list");
    const getUserListPayload = {
      action: "onchat",
      data: {
        event: "GET_USER_LIST",
      },
    };
    wSocket.send(JSON.stringify(getUserListPayload));
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const isUserExist = messages.some(
        (msg) => msg.name === name && msg.type === Number(type),
      );
      if (!isUserExist) {
        navigate(PATH_CONSTRAINT.CHAT);
      }
    }
  }, [messages, name, type]);

  // function fetchUserList() {
  //   console.log("ChatSidebar mounted, requesting user list");
  //   const getUserListPayload = {
  //     action: "onchat",
  //     data: {
  //       event: "GET_USER_LIST",
  //     },
  //   };
  //   wSocket.send(JSON.stringify(getUserListPayload));
  // }
  //
  // useEvent("getUserList", fetchUserList);

  function getUserListHandler(data: any) {
    console.log("Received user list:", data);

    setMessages(data.data);
  }

  useEvent("user_list_success", getUserListHandler);

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) {
      return messages;
    }

    const lowercaseSearch = searchTerm.toLowerCase().trim();

    return messages.filter((msg) => {
      return msg.name?.toLowerCase().includes(lowercaseSearch);
    });
  }, [messages, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  //  Callback khi phòng được tạo thành công
  const handleRoomCreated = () => {
    console.log("Room created, refreshing user list");
    fetchUserList();
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col relative">
      <SidebarHeader
        setShowCreateRoom={setShowCreateRoom}
        quantityUser={filteredMessages.length}
      />
      <SidebarSearch onSearch={handleSearch} />

      <div className="flex-1 overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <MessageItem
              key={msg.actionTime}
              message={{
                name: msg.name,
                avatar: "👨‍💼",
                actionTime: msg.actionTime,
                type: msg.type,
              }}
              activeMessageName={name || ""}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchTerm ? "Không tìm thấy kết quả" : "Đang load dữ liệu..."}
          </div>
        )}
      </div>

      <SidebarLogout />

      {showCreateRoom && (
        <CreateRoomPanel
         onClose={() => setShowCreateRoom(false)}
         onRoomCreated={handleRoomCreated}
         />
      )}
    </div>
  );
};

export default ChatSidebar;