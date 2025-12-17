import ChatSidebar from "./partials/ChatSidebar";
import ChatMain from "./partials/ChatMain";
import ChatDirectory from "./partials/ChatDirectory";

function Chat() {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatMain />
      <ChatDirectory />
    </div>
  );
}
export default Chat;

