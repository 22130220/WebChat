import ChatSidebar from "./partials/ChatSidebar";
import ChatMain from "./partials/ChatMain";
import ChatDirectory from "./partials/ChatDirectory";
import pubSub from "../../utils/eventBus";
import wSocket from "../../utils/wSocket";


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

