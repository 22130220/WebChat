import ChatSidebar from "./partials/ChatSidebar";
import ChatMain from "./partials/ChatMain";
import ChatDirectory from "./partials/ChatDirectory";
import { useEvent } from "../../hooks/useEvent";
import { Outlet } from "react-router-dom";

function Chat() {
  useEvent("relogin_success", reLoginSuccess);

  function reLoginSuccess(data: any) {
    const RE_LOGIN_CODE = data.data.RE_LOGIN_CODE;
    localStorage.setItem("RE_LOGIN_CODE", RE_LOGIN_CODE);
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <Outlet />
      <ChatDirectory />
    </div>
  );
}
export default Chat;
