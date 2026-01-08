import { NavLink } from "react-router-dom";
import type { IMessage } from "../../../types/interfaces/IMessage";

interface Props {
  message: IMessage;
  activeMessageName?: string;
}

const MessageItem = ({ message, activeMessageName }: Props) => {
  return (
    <NavLink to={`/chat/${message.name}/type/${message.type}`}>
      <div
        className={`p-3 hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-primary)] ${
          message.name === activeMessageName ? "bg-[var(--bg-primary)]" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
            {message.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm text-[var(--text-primary)] truncate">
                {message.name}
              </h3>
              <span className="text-xs text-[var(--text-muted)] ml-2">
                {message.actionTime}
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] truncate mb-2"></p>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default MessageItem;
