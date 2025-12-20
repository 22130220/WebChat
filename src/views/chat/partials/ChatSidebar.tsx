import SidebarHeader from '../partials/SidebarHeader';
import SidebarSearch from '../partials/SidebarSearch';
import MessageItem from '../partials/MessageItem';
import SidebarLogout from '../partials/SidebarLogout';
import CreateRoomPanel from './CreateRoomPanel';
import React, { use, useEffect } from 'react';
import wSocket from '../../../utils/wSocket';
import { useEvent } from '../../../hooks/useEvent';

const ChatSidebar = () =>  {
  const [showCreateRoom, setShowCreateRoom] = React.useState(false);
  const [messages, setMessages] = React.useState([]);

function fetchMessages() {
  console.log("ChatSidebar mounted, requesting user list");
  const getUserListPayload = {
  action: "onchat",
  data: {
    event: "GET_USER_LIST"
  }
}
 wSocket.send(JSON.stringify(getUserListPayload))
}

function getUserListHandler(data: any) {
console.log("Received user list:", data);

    setMessages(data.data);
}

useEvent("getUserList", fetchMessages)
useEvent("user_list_success", getUserListHandler)

  return (
  <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col relative">
    <SidebarHeader setShowCreateRoom={setShowCreateRoom} />
    <SidebarSearch />

    <div className="flex-1 overflow-y-auto">
      {messages.map(msg => (
        <MessageItem key={msg.actionTime} message={{
          name: msg.name,
          avatar: '👨‍💼',
          actionTime: msg.actionTime
        }} />
      ))}
    </div>

    <SidebarLogout />

    {showCreateRoom && (
  <CreateRoomPanel onClose={() => setShowCreateRoom(false)} />
)}
  </div>
)};

export default ChatSidebar;
