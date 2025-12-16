import SidebarHeader from '../partials/SidebarHeader';
import SidebarSearch from '../partials/SidebarSearch';
import MessageItem from '../partials/MessageItem';
import SidebarLogout from '../partials/SidebarLogout';
import { messages } from '../../../data/MessageMock';

const ChatSidebar = () => (
  <div className="w-64 h-screen bg-gray-50 border-r flex flex-col">
    <SidebarHeader />
    <SidebarSearch />

    <div className="flex-1 overflow-y-auto">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>

    <SidebarLogout />
  </div>
);

export default ChatSidebar;
