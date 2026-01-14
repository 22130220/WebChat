import ChatSidebar from "./partials/ChatSidebar";
import ChatDirectory from "./partials/ChatDirectory";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { initMessageNotification } from "../../services/messageNotificationService";

function Chat() {
  useEffect(() => {
    initMessageNotification().then((granted) => {
      if (!granted) {
        console.warn("Người dùng không cấp quyền thông báo");
      }
    });
  }, []);
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <Outlet />
      <ChatDirectory />
    </div>
  );
}
export default Chat;
