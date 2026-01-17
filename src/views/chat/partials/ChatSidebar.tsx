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
import {
  saveUserContact,
  getUserContacts,
  mergeUserLists,
} from "../../../services/firebaseUserService";
import { getUserAvatars } from "../../../services/firebaseProfileService";
import { useDispatch } from "react-redux";
import { setRecipients } from "../../../stores/recipientsSlice";
import type { IGetUserListPayload } from "../../../types/interfaces/IWebSocketEvent";
import { formatShortTime, generateId } from "../../../helpers/StringHelper";

const ChatSidebar = () => {
  const { name, type } = useParams();
  const [showCreateRoom, setShowCreateRoom] = React.useState(false);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUserList = () => {
    console.log("Requesting user list");
    const getUserListPayload: IGetUserListPayload = {
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
    if (messages.length > 0 && name) {
      const isUserExist = messages.some(
        (msg) => msg.name === name && msg.type === Number(type),
      );
      // Chỉ redirect nếu user không tồn tại VÀ không phải là chat cá nhân (type !== "0")
      // Cho phép chat với người dùng mới (type = 0) ngay cả khi chưa có trong list
      if (!isUserExist && type !== "0") {
        navigate(PATH_CONSTRAINT.CHAT);
      }
    }
  }, [messages, name, type]);

  async function getUserListHandler(data: any) {
    console.log("Received user list:", data);

    const backendUsers = data.data || [];
    const currentUser = localStorage.getItem("USER_NAME");

    if (currentUser) {
      try {
        // Lấy contacts từ Firebase
        const firebaseUsers = await getUserContacts(currentUser);

        // Merge backend data với Firebase data
        const mergedUsers = mergeUserLists(backendUsers, firebaseUsers);

        console.log("Merged user list:", {
          backend: backendUsers.length,
          firebase: firebaseUsers.length,
          merged: mergedUsers.length,
        });

        // Fetch avatars cho tất cả users (chỉ người dùng, không phải nhóm)
        const individualUsers = mergedUsers.filter((user) => user.type === 0);
        if (individualUsers.length > 0) {
          const usernames = individualUsers.map((user) => user.name);
          const avatarMap = await getUserAvatars(usernames);

          // Cập nhật avatar thực vào messages
          const updatedUsers = mergedUsers.map((user) => {
            if (user.type === 0 && avatarMap.has(user.name)) {
              const realAvatar = avatarMap.get(user.name);
              return {
                ...user,
                avatar: realAvatar || user.avatar,
              };
            }
            return user;
          });

          setMessages(updatedUsers);
        } else {
          setMessages(mergedUsers);
        }
      } catch (error) {
        console.error("Error loading Firebase contacts:", error);
        // Fallback to backend data only
        setMessages(backendUsers);
      }
    } else {
      setMessages(backendUsers);
    }
  }

  useEvent("user_list_success", getUserListHandler);

  // Tự động thêm người gửi vào user list và lưu vào Firebase
  const handleReceiveNewMessage = async (data: any) => {
    console.log("Received new message from:", data.data.name);

    const senderName = data.data.name;
    const messageType = data.data.type;

    // Kiểm tra xem người gửi đã có trong user list chưa
    const isUserInList = messages.some(
      (msg) => msg.name === senderName && msg.type === messageType,
    );

    // Nếu chưa có, thêm vào user list và lưu vào Firebase
    if (!isUserInList) {
      console.log(`Adding ${senderName} to user list`);

      // Fetch avatar thực cho user mới (chỉ cho người dùng, không phải nhóm)
      let userAvatar = messageType === 1 ? "👥" : "👨‍💼";
      if (messageType === 0) {
        try {
          const avatarMap = await getUserAvatars([senderName]);
          const fetchedAvatar = avatarMap.get(senderName);
          if (fetchedAvatar) {
            userAvatar = fetchedAvatar;
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }

      const newUser: IMessage = {
        name: senderName,
        avatar: userAvatar,
        actionTime: data.data.createAt || new Date().toLocaleString("vi-VN"),
        type: messageType,
      };

      // Lưu vào Firebase để persist và đồng bộ giữa thiết bị
      const currentUser = localStorage.getItem("USER_NAME");
      if (currentUser) {
        try {
          await saveUserContact(currentUser, newUser);
          console.log(`Saved ${senderName} to Firebase`);
        } catch (error) {
          console.error("Error saving to Firebase:", error);
        }
      }

      setMessages((prev) => [newUser, ...prev]);
    }
  };

  useEvent("wsMessage", (rawData: string) => {
    try {
      const data = JSON.parse(rawData);
      // Chỉ xử lý khi nhận tin nhắn chat mới
      if (data.status === "success" && data.event === "SEND_CHAT") {
        handleReceiveNewMessage(data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) {
      return messages;
    }

    const lowercaseSearch = searchTerm.toLowerCase().trim();

    return messages.filter((msg) => {
      return msg.name?.toLowerCase().includes(lowercaseSearch);
    });
  }, [messages, searchTerm]);

  // Cập nhật recipients trong Redux store khi messages thay đổi
  useEffect(() => {
    dispatch(setRecipients(messages));
  }, [messages, dispatch]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  //  Callback khi phòng được tạo thành công
  const handleRoomCreated = () => {
    console.log("Room created, refreshing user list");
    fetchUserList();
  };

  const handleJoinRoom = () => {
    console.log("Join room, refreshing user list");
    fetchUserList();
  };

  return (
    <div className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] h-screen flex flex-col relative">
      <SidebarHeader
        setShowCreateRoom={setShowCreateRoom}
        quantityUser={filteredMessages.length}
      />
      <SidebarSearch onSearch={handleSearch} />

      <div className="flex-1 overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <MessageItem
              key={msg.actionTime + generateId()}
              message={{
                name: msg.name,
                avatar: msg.avatar || (msg.type === 1 ? "👥" : "👨‍💼"), // Sử dụng avatar thực, fallback về emoji
                actionTime: formatShortTime(msg.actionTime),
                type: msg.type,
              }}
              activeMessageName={name || ""}
            />
          ))
        ) : (
          <div className="p-4 text-center text-[var(--text-muted)] text-sm">
            {searchTerm ? "Không tìm thấy kết quả" : "Đang load dữ liệu..."}
          </div>
        )}
      </div>

      <SidebarLogout />

      {showCreateRoom && (
        <CreateRoomPanel
          onClose={() => setShowCreateRoom(false)}
          onRoomCreated={handleRoomCreated}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </div>
  );
};

export default ChatSidebar;
