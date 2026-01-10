import React, { useState } from 'react';
import type { IMessageDetail } from '../../../types/interfaces/IMessageDetail';
import type { IMessage } from '../../../types/interfaces/IMessage';
import RecipientSelector from './RecipientSelector';
import { X, Send } from 'lucide-react';
import wSocket from '../../../utils/wSocket';
import ToastSuccess from '../../../components/ToastSuccess';

interface ForwardMessageModalProps {
  message: IMessageDetail;
  recipients: IMessage[];
  onClose: () => void;
}

const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  message,
  recipients,
  onClose,
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const username = localStorage.getItem('USER_NAME') || '';

  const handleToggleRecipient = (recipient: IMessage) => {
    setSelectedRecipients((prev) => {
      const isAlreadySelected = prev.some(
        (r) => r.name === recipient.name && r.type === recipient.type
      );
      if (isAlreadySelected) {
        return prev.filter((r) => !(r.name === recipient.name && r.type === recipient.type));
      } else {
        return [...prev, recipient];
      }
    });
  };

  const handleForward = async () => {
    if (selectedRecipients.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Gửi tin nhắn forward đến từng người nhận
      for (const recipient of selectedRecipients) {
        const forwardedMessage: IMessageDetail = {
          type: 'FORWARDED',
          content: message.content,
          sender: username,
          to: recipient.name,
          timestamp: new Date().toISOString(),
          originalSender: message.originalSender || message.sender,
          originalTimestamp: message.originalTimestamp || message.timestamp,
          originalType: message.originalType || message.type as "TEXT" | "IMAGE",
          forwardedBy: username,
        };

        const messageList: IMessageDetail[] = [forwardedMessage];
        const typeEvent = recipient.type === 1 ? 'room' : 'people';

        const messagePayload = {
          action: 'onchat',
          data: {
            event: 'SEND_CHAT',
            data: {
              type: typeEvent,
              to: recipient.name,
              mes: JSON.stringify(messageList),
            },
          },
        };

        wSocket.send(JSON.stringify(messagePayload));
      }

      // Hiển thị toast thành công
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error forwarding message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy preview content
  const getPreviewContent = () => {
    if (message.type === 'IMAGE' || message.originalType === 'IMAGE') {
      return '📷 Hình ảnh';
    }
    return message.content.length > 100
      ? message.content.substring(0, 100) + '...'
      : message.content;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Chuyển tiếp tin nhắn
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Message Preview */}
          <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Tin nhắn:</p>
            <div className="bg-[var(--bg-primary)] rounded-lg p-3">
              <p className="text-sm text-[var(--text-primary)]">{getPreviewContent()}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Từ: {message.originalSender || message.sender}
              </p>
            </div>
          </div>

          {/* Recipients Selector */}
          <div className="flex-1 overflow-hidden p-4">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
              Chọn người nhận ({selectedRecipients.length})
            </p>
            <RecipientSelector
              recipients={recipients}
              selectedRecipients={selectedRecipients}
              onToggleRecipient={handleToggleRecipient}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border-primary)] flex gap-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleForward}
              disabled={isLoading || selectedRecipients.length === 0}
              className="flex-1 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <>
                  <Send size={16} />
                  <span>Gửi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <ToastSuccess successMessage={`Đã chuyển tiếp đến ${selectedRecipients.length} người`} />
      )}
    </>
  );
};

export default ForwardMessageModal;
