import ChatSidebar from "./partials/ChatSidebar";
import ChatDirectory from "./partials/ChatDirectory";
import { Outlet } from "react-router-dom";

function Chat() {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <Outlet />
      <ChatDirectory />
    </div>
  );
}
export default Chat;
