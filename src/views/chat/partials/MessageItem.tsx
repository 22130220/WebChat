import type { IMessage } from '../../../types/interfaces/IMessage';

interface Props {
  message: IMessage;
  activeMessageId?: number;
}

const MessageItem = ({ message, activeMessageId }: Props) => {
  return (
    <div
      className={`p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
        message.id === activeMessageId ? 'bg-white' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
          {message.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {message.name}
            </h3>
            <span className="text-xs text-gray-500 ml-2">
              {message.time}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate mb-2">
            {message.preview}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;