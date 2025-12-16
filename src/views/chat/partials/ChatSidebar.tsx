import SidebarHeader from '../partials/SidebarHeader';
import SidebarSearch from '../partials/SidebarSearch';
import MessageItem from '../partials/MessageItem';
import SidebarLogout from '../partials/SidebarLogout';
import { messages } from '../../../data/MessageMock';
import CreateRoomPanel from './CreateRoomPanel';
import React from 'react';

const ChatSidebar = () =>  {
  const [showCreateRoom, setShowCreateRoom] = React.useState(false);
  return (
  <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col relative">
    <SidebarHeader setShowCreateRoom={setShowCreateRoom} />
    <SidebarSearch />

    <div className="flex-1 overflow-y-auto">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>

    <SidebarLogout />

    {showCreateRoom && (
  <CreateRoomPanel onClose={() => setShowCreateRoom(false)} />
)}
  </div>
)};

export default ChatSidebar;
